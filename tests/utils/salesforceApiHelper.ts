import fs from "fs";
import path from "path";
import fetch, { Response } from "node-fetch";

interface SalesforceConfig {
  authUrl: string;
  clientId: string;
  clientSecret: string;
}

interface TokenResponse {
  access_token: string;
  instance_url?: string;
  token_type: string;
  issued_at: string;
  signature: string;
  expires_in?: number;
}

interface SalesforceQueryResponse {
  totalSize: number;
  done: boolean;
  records: Array<{ Id: string }>;
}

export class SalesforceApiHelper {
  private clientId: string;
  private clientSecret: string;
  private authUrl: string;
  private instanceUrl: string = "https://rdg--uat.sandbox.my.salesforce.com"; // default fallback

  private accessToken: string | null = null;
  private tokenExpiry: number = 0; // Unix timestamp in ms

  constructor() {
    const configPath = path.resolve(
      __dirname,
      "../resources/salesforce_credentials.json"
    );
    const config: SalesforceConfig = JSON.parse(
      fs.readFileSync(configPath, "utf8")
    );

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authUrl = config.authUrl;
  }

  // Refresh Salesforce Token
  private async refreshToken(): Promise<string> {
    console.log("🔄 Refreshing Salesforce token...");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);

    const response = await fetch(this.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Failed to refresh token: ${response.status} - ${errorText}`
      );
      throw new Error(`Salesforce authentication failed: ${response.status}`);
    }

    const tokenData: TokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiry =
      Date.now() +
      (tokenData.expires_in
        ? tokenData.expires_in * 1000
        : 3600 * 1000 - 60 * 1000); // 1 hour - 60s buffer

    console.log(
      "✅ Token refreshed successfully. Access token:",
      this.accessToken
    );
    return this.accessToken;
  }

  // Get Valid Salesforce Token if expired or missing
  public async getValidToken(): Promise<string> {
    const now = Date.now();
    if (!this.accessToken || now >= this.tokenExpiry) {
      console.log("⚠️ Token expired or missing. Refreshing...");
      return await this.refreshToken();
    }

    console.log("✅ Using cached token.");
    return this.accessToken;
  }

  // Generates Salesforce Request headers
  public async getHeaders(): Promise<{ [key: string]: string }> {
    const token = await this.getValidToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    return headers;
  }

  // Authenticate Salesforce api
  public async authenticate() {
    // Skip if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      console.log("🟢 Existing Salesforce token is still valid.");
      return;
    }

    console.log("🔄 Refreshing Salesforce token...");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);

    const res = await fetch(this.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(
        `❌ Salesforce authentication failed: ${res.status} ${await res.text()}`
      );
    }

    const tokenData = await res.json();

    this.accessToken = tokenData.access_token;
    this.instanceUrl =
      tokenData.instance_url || "https://rdg--uat.sandbox.my.salesforce.com";
    this.tokenExpiry =
      Date.now() +
      (tokenData.expires_in ? tokenData.expires_in * 1000 : 3600000);

    console.log(
      `✅ Token refreshed successfully. Access token: ${this.accessToken}`
    );
  }

  // Gets OrderId from OrderNumber
  async queryOrderByNumber(orderNumber: string) {
    await this.authenticate(); // Ensure token is valid

    const query = `Select Id From Order where OrderNumber = '${orderNumber}'`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${this.instanceUrl}/services/data/v60.0/query/?q=${encodedQuery}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `❌ Failed to query order. Status: ${res.status}, Body: ${errorText}`
      );
      throw new Error(
        `Salesforce order query failed with status ${res.status}`
      );
    }

    const result = await res.json();
    return result;
  }

  extractOrderIdFromResponse(response: SalesforceQueryResponse): string {
    if (response.totalSize !== 1) {
      throw new Error(
        `Expected exactly 1 order, but got ${response.totalSize}`
      );
    }
    if (!response.done) {
      throw new Error(`Query incomplete, done flag is false`);
    }

    if (!response.records || response.records.length === 0) {
      throw new Error("No records found in response");
    }

    const firstRecord = response.records[0];
    if (!firstRecord.Id) {
      throw new Error("Order ID not found in the first record");
    }

    console.log(`🎯 Extracted Order ID: ${firstRecord.Id}`);
    return firstRecord.Id;
  }

  // Combines query + extraction into one method
  public async queryOrderAndGetSalesforceId(
    orderNumber: string
  ): Promise<string> {
    const response = await this.queryOrderByNumber(orderNumber);
    const sfOrderId = this.extractOrderIdFromResponse(response);
    return sfOrderId;
  }

  // === New method added here ===
  /**
   * Updates Salesforce asset to mark documents received, validate and approve order purchase
   * @param orderItemId Salesforce order line item ID to update
   */
  public async receiveDocumentsValidateAndApproveOrderPurchase(
    orderItemId: string
  ): Promise<void> {
    const updateData = {
      Documents_Received__c: true,
      Validated__c: true,
      Status__c: "Approved Application",
      Eligible__c: true,
    };

    const headers = await this.getHeaders();

    const url = `${this.instanceUrl}/services/data/v63.0/sobjects/OrderItem/${orderItemId}`;

    console.log(`🔄 Sending PATCH to update order item ${orderItemId}`);

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updateData),
    });

    if (response.status === 204) {
      console.log("✅ Documents Received, Order Validated, and Approved");
    } else {
      const text = await response.text();
      console.error(
        `❌ Failed to update order item ${orderItemId}. Status: ${response.status}, Body: ${text}`
      );
      throw new Error(`Failed to update order item ${orderItemId}`);
    }
  }

  /**
   * Marks the Salesforce order as complete by updating its status to 'Activated'
   * @param orderId Salesforce order ID to update
   */
  public async markOrderAsComplete(orderId: string): Promise<void> {
    const updateData = {
      Status: "Activated",
    };

    const headers = await this.getHeaders();

    const url = `${this.instanceUrl}/services/data/v63.0/sobjects/Order/${orderId}`;

    console.log(`🔄 Sending PATCH to mark order ${orderId} as complete`);

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updateData),
    });

    if (response.status === 204) {
      console.log("✅ Order marked as complete");
    } else {
      const text = await response.text();
      console.error(
        `❌ Failed to mark order ${orderId} as complete. Status: ${response.status}, Body: ${text}`
      );
      throw new Error(`Failed to mark order ${orderId} as complete`);
    }
  }
}
