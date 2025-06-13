import axios from "axios";
import * as fs from "fs";
import path from "path";

interface RailcardConfig {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  railcardApiUrl: string;
  ordersApiUrl: string;
  railcardClientId: string;
  railcardClientSecret: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class RailcardApiHelper {
  private config: RailcardConfig;

  constructor(
    configPath: string = path.resolve(
      __dirname,
      "../resources/railcard_credentials.json"
    )
  ) {
    const raw = fs.readFileSync(configPath, "utf-8");
    this.config = JSON.parse(raw) as RailcardConfig;
  }

  /**
   * Fetches a fresh OAuth2 token using client credentials flow
   */
  async getAccessToken(): Promise<string> {
    const { authUrl, clientId, clientSecret } = this.config;

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "client_credentials");

    const response = await axios.post<TokenResponse>(authUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;

    // Shorten token for logging: first 8 + ... + last 4 chars
    const shortToken =
      accessToken.length > 12
        ? `${accessToken.slice(0, 8)}...${accessToken.slice(-4)}`
        : accessToken;

    console.log("✅ Token received:", shortToken);
    return accessToken;
  }

  /**
   * Returns the headers required to call Railcard APIs including fresh Bearer token
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken();

    return {
      client_id: this.config.railcardClientId,
      client_secret: this.config.railcardClientSecret,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Retrieves railcard order details by order ID
   */
  async getRailcardOrder(orderId: string) {
    const headers = await this.getAuthHeaders();
    const url = `${this.config.ordersApiUrl}orders/${orderId}`;

    console.log(`🔍 Querying Railcard Order at: ${url}`);

    try {
      const response = await axios.get(url, { headers });
      console.log(
        `✅ Get Order By Order ID - Response Status: ${response.status}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching railcard order:", error);
      throw error;
    }
  }

  /**
   * Extracts the first orderLineItems.id from the Railcards API response
   * @param response - Parsed JSON response from Railcards API
   * @returns The ID of the first order line item
   */
  extractOrderLineItemIdFromResponse(response: any): string {
    if (!response.hasOwnProperty("orderLineItems")) {
      throw new Error("Response missing orderLineItems");
    }

    const orderLineItems = response.orderLineItems;
    if (!orderLineItems || orderLineItems.length === 0) {
      throw new Error("No order line items found");
    }

    const firstLineItem = orderLineItems[0];
    const lineItemId = firstLineItem.id;

    console.log(`Order Item ID: ${lineItemId}`);
    return lineItemId;
  }
}
