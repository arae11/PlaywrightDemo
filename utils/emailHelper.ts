/**
 * EmailHelper: Confirmation Link Retriever
 *
 * Purpose:
 *  - Provides a simple wrapper for extracting confirmation links from Gmail messages.
 *  - Simplifies usage of `extractConfirmationLink` for Playwright tests and other workflows.
 *
 * Main Class: EmailHelper
 *  - getConfirmationLink(targetEmail): Asynchronously retrieves the confirmation link for the provided target email.
 *
 * Logic:
 *  - Delegates extraction to `extractConfirmationLink` (imported from `gmailReader`).
 *  - Wraps any errors with a custom error message for better debugging.
 *
 * Notes:
 *  - Useful for automating account verification flows that rely on email confirmation.
 */


import { extractConfirmationLink } from './gmailReader';

export class EmailHelper {
  static async getConfirmationLink(targetEmail: string): Promise<string> {
    try {
      return await extractConfirmationLink(targetEmail);
    } catch (error) {
      throw new Error(`Failed to get confirmation link: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}