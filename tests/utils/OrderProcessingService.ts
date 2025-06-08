import { SalesforceApiHelper } from "./salesforceApiHelper";
import { RailcardApiHelper } from "./railcardApiHelper";

export class OrderProcessingService {
  constructor(
    private salesforceApiHelper: SalesforceApiHelper,
    private railcardApiHelper: RailcardApiHelper
  ) {}

  public async processMatureStudentRailcardOrder(orderNumber: string, railcardType: string): Promise<void> {
    if (railcardType.toUpperCase() !== "MATURE") {
      console.log(`Skipping process for railcard type: ${railcardType}`);
      return;
    }

    console.log(`🚀 Processing Mature Student Railcard order for order number: ${orderNumber}`);

    // 1. Query Salesforce to get Salesforce Order ID
    const salesforceId = await this.salesforceApiHelper.queryOrderAndGetSalesforceId(orderNumber);

    // 2. Fetch Railcard Order details
    const railcardOrderResponse = await this.railcardApiHelper.getRailcardOrder(salesforceId);

    // 3. Extract Order Line Item ID
    const orderItemId = this.railcardApiHelper.extractOrderLineItemIdFromResponse(railcardOrderResponse);

    // 4. Receive Documents, Validate and Approve Order Purchase (twice)
    await this.salesforceApiHelper.receiveDocumentsValidateAndApproveOrderPurchase(orderItemId);
    await this.salesforceApiHelper.receiveDocumentsValidateAndApproveOrderPurchase(orderItemId);

    // 5. Mark Order as Complete
    await this.salesforceApiHelper.markOrderAsComplete(salesforceId);

    console.log(`✅ Successfully updated order ${orderNumber}`);
  }
}
