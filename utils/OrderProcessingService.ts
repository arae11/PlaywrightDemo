/**
 * OrderProcessingService
 * 
 * Handles business logic for processing Mature Student Railcard orders.
 * 
 * Responsibilities:
 * - Checks if the railcard type is "MATURE", otherwise skips processing.
 * - Queries Salesforce to get the Salesforce Order ID based on the order number.
 * - Retrieves detailed railcard order info via the Railcard API.
 * - Extracts the order line item ID from the railcard order response.
 * - Calls Salesforce API helper twice to receive documents, validate, and approve the order purchase,
 *   with a 5-second delay between calls to ensure proper processing.
 * - Marks the Salesforce order as complete once all validations and approvals are successful.
 * - Logs progress and success messages for traceability.
 * 
 * Usage:
 * Instantiate this service with SalesforceApiHelper and RailcardApiHelper instances,
 * then call `processMatureStudentRailcardOrder` with the order number and railcard type.
 */

import { SalesforceApiHelper } from "./salesforceApiHelper";
import { RailcardApiHelper } from "./railcardApiHelper";

export class OrderProcessingService {
  constructor(
    private salesforceApiHelper: SalesforceApiHelper,
    private railcardApiHelper: RailcardApiHelper
  ) {}

  public async processMatureStudentRailcardOrder(
    orderNumber: string,
    railcardType: string
  ): Promise<void> {
    if (railcardType.toUpperCase() !== "MATURE") {
      console.log(`Skipping process for railcard type: ${railcardType}`);
      return;
    }

    console.log(
      `🚀 Processing Mature Student Railcard order for order number: ${orderNumber}`
    );

    // 1. Query Salesforce to get Salesforce Order ID
    const salesforceId =
      await this.salesforceApiHelper.queryOrderAndGetSalesforceId(orderNumber);

    // 2. Fetch Railcard Order details
    const railcardOrderResponse = await this.railcardApiHelper.getRailcardOrder(
      salesforceId
    );

    // 3. Extract Order Line Item ID
    const orderItemId =
      this.railcardApiHelper.extractOrderLineItemIdFromResponse(
        railcardOrderResponse
      );

    // 4. Receive Documents, Validate and Approve Order Purchase (twice)
    await this.salesforceApiHelper.receiveDocumentsValidateAndApproveOrderPurchase(
      orderItemId
    );
    // Small wait before re-validating
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.salesforceApiHelper.receiveDocumentsValidateAndApproveOrderPurchase(
      orderItemId
    );

    // 5. Mark Order as Complete
    await this.salesforceApiHelper.markOrderAsComplete(salesforceId);

    console.log(`✅ Successfully updated order ${orderNumber}`);
  }
}
