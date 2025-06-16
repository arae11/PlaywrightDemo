/**
 * PromocodeHelper
 * 
 * A helper service for validating and processing railcard promocodes via the Orders API.
 * 
 * Main responsibilities:
 * - Validate promocodes by calling the Orders API /validate endpoint.
 * - Extract and interpret tags from promocode validation responses.
 * - Provide helper methods to determine if eligibility/payment should be skipped based on tags.
 * - Calculate final prices considering promocode discounts.
 * - Provide railcard base pricing without promocode applied.
 * 
 * Constructor:
 * - Accepts an optional RailcardApiHelper instance to handle API calls and authentication headers.
 * 
 * Key methods:
 * - validatePromocode(promo, sku, expectedPrice): sends a POST request to validate the promocode.
 * - getTagsFromPromocode(promo, sku, expectedPrice): returns tags from the validation response.
 * - verifyPromocodeTags(promo, sku, expectedPrice): returns booleans for specific tags (skipEligibility, skipPayment, isSantander).
 * - getFinalPriceConsideringSkipPayment(basePrice, skipPayment): returns 0 if skipPayment is true, otherwise the base price.
 * - extractTotalDiscountValue(response): extracts total discount amount from the API response.
 * - calculatePromocodeDiscount(expectedPrice, discountAmount): calculates final discounted price, never negative.
 * - getRailcardValueWithoutPromo(railcard, years): returns base price for railcard type and duration without promocode.
 * 
 * Usage:
 * Instantiate this class (optionally with a RailcardApiHelper) and call the methods
 * to validate promocodes and calculate pricing logic accordingly.
 */

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
   * Returns 0.00 if skipPayment is true, otherwise returns the base price
   * @param basePrice - The base price before promo discount
   * @param skipPayment - Boolean indicating whether payment should be skipped
   * @returns The final price to charge
   */
  getFinalPriceConsideringSkipPayment(
    basePrice: number,
    skipPayment: boolean
  ): number {
    return skipPayment ? 0.0 : basePrice;
  }

  /**
   * Extracts the total discount value from the promocode validation API response.
   * Assumes the response contains a property `totalDiscount` or calculates from `discounts` array.
   * @param response - The promocode validation response object
   * @returns The total discount amount as a number (e.g., 5.00)
   */
  extractTotalDiscountValue(response: any): number {
    // Example 1: If the response has a totalDiscount field
    if (typeof response.totalDiscount === "number") {
      return response.totalDiscount;
    }

    // Example 2: If discounts is an array of discount objects with amount field
    if (Array.isArray(response.discounts)) {
      return response.discounts.reduce(
        (acc: number, discount: { amount?: number }) => {
          return (
            acc + (typeof discount.amount === "number" ? discount.amount : 0)
          );
        },
        0
      );
    }

    // Default fallback if no discount info found
    return 0.0;
  }

  /**
   * Calculates the final price after applying the promocode discount.
   * Ensures the final price is never negative.
   * @param expectedPrice - The base price before discount
   * @param discountAmount - The discount to subtract
   * @returns The final discounted price as a number (e.g. 25.00)
   */
  calculatePromocodeDiscount(
    expectedPrice: number,
    discountAmount: number
  ): number {
    const finalPrice = expectedPrice - discountAmount;
    return finalPrice < 0 ? 0 : parseFloat(finalPrice.toFixed(2));
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
