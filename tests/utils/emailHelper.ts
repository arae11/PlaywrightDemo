import { extractConfirmationLink } from './gmailReader';

export class EmailHelper {
  static async getConfirmationLink(): Promise<string> {
    try {
      return await extractConfirmationLink();
    } catch (error) {
      throw new Error(`Failed to get confirmation link: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}