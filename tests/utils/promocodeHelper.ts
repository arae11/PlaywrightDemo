import axios from "axios";
import { RailcardApiHelper } from "./railcardApiHelper";
import { clouddebugger } from "googleapis/build/src/apis/clouddebugger";

export class PromocodeHelper {
  private apiHelper: RailcardApiHelper;

  constructor(apiHelper?: RailcardApiHelper) {
    this.apiHelper = apiHelper || new RailcardApiHelper();
  }

  /**
   * Validates a promocode by sending a POST request to the Orders API /validate endpoint.
   * @param promo - The promocode string
   * @param sku - Product SKU
   * @param expectedPrice - Price as number (e.g. 30.00)
   * @returns The response data from the API
   */
  async validatePromocode(
    promo: string,
    sku: string,
    expectedPrice: number
  ): Promise<any> {
    const headers = await this.apiHelper.getAuthHeaders();
    const url = `${this.apiHelper["config"].ordersApiUrl}validate`;

    const requestBody = {
      code: promo,
      email: "",
      products: [
        {
          product: sku,
          price: expectedPrice,
        },
      ],
    };

    try {
      const response = await axios.post(url, requestBody, { headers });
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error validating promocode:",
        error.response?.data || error
      );
      throw error;
    }
  }

  /**
   * Gets tags from the promocode validation response
   * @param promo - The promocode string
   * @param sku - Product SKU
   * @param expectedPrice - Price as number (e.g. 30.00)
   * @returns An array of tags (strings) from the response
   */
  async getTagsFromPromocode(
    promo: string,
    sku: string,
    expectedPrice: number
  ): Promise<string[]> {
    const responseData = await this.validatePromocode(
      promo,
      sku,
      expectedPrice
    );

    if (!responseData || !responseData.tags) {
      throw new Error("No tags found in promocode validation response");
    }

    console.log("🏷️ Tags Found:", responseData.tags);
    return responseData.tags;
  }

  /**
   * Validates a promocode and checks for the presence of specific tags.
   * @param promo - The promocode string
   * @param sku - Product SKU
   * @param expectedPrice - Price as number (e.g. 30.00)
   * @returns An object with tag booleans: skipEligibility, skipPayment, santander
   */
  async verifyPromocodeTags(
    promo: string,
    sku: string,
    expectedPrice: number
  ): Promise<{
    skipEligibility: boolean;
    skipPayment: boolean;
    isSantander: boolean;
  }> {
    if (!promo || promo.trim() === "") {
      console.warn("⚠️ No promocode provided — skipping tag verification.");
      return {
        skipEligibility: false,
        skipPayment: false,
        isSantander: false,
      };
    }
    const tags = await this.getTagsFromPromocode(promo, sku, expectedPrice);

    const skipEligibility = tags.includes("SKIP_ELIGIBILITY");
    const skipPayment = tags.includes("SKIP_PAYMENT");
    const isSantander = tags.includes("SANTANDER");

    console.log("✅ Tag Flags:", {
      skipEligibility,
      skipPayment,
      isSantander,
    });

    return {
      skipEligibility,
      skipPayment,
      isSantander,
    };
  }

  /**
   * Calculates the base price of a railcard without applying any promocode.
   * @param railcard - Railcard type (e.g. "DPRC", "SANTANDER", etc.)
   * @param years - Duration in years (as string, e.g. "1" or "3")
   * @returns The expected price as a number
   */
  getRailcardValueWithoutPromo(railcard: string, years: string): number {
    let expectedPrice = 35.0;

    if (railcard === "SANTANDER") {
      expectedPrice = 0.0;
    } else if (railcard === "DPRC" && years === "1") {
      expectedPrice = 20.0;
    } else if (railcard === "DPRC" && years === "3") {
      expectedPrice = 54.0;
    } else if (railcard !== "DPRC" && years === "3") {
      expectedPrice = 80.0;
    }

    return expectedPrice;
  }
}
