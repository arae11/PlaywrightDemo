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