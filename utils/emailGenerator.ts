/**
 * Unique Email Generator with Epoch Suffix
 *
 * Purpose:
 *  - Generates unique test email addresses by appending the current epoch timestamp 
 *    and a UUID fragment to a base email.
 *  - Ensures email uniqueness across test runs, especially useful for registration flows.
 *
 * Main Function: generateEmailWithEpoch(originalEmail, railcardType, orderType, secondaryHolder)
 *  - originalEmail: Base email to mutate (e.g., 'digitalrailcardtest@gmail.com').
 *  - railcardType: Used to label the email with railcard type context.
 *  - orderType: 'BFS' or 'BOB'; determines if a BOB-specific email should be generated.
 *  - secondaryHolder: 'Yes' or 'No'; determines if a secondary email is needed (for TwoTogether etc.).
 *
 * Output:
 *  - Returns an object of type `EmailEpochResult` containing:
 *      - loginEmail: Always present; unique main email address.
 *      - bobEmail: Present if orderType is 'BOB'.
 *      - secondaryEmail: Present for TwoTogether or if secondaryHolder is 'Yes'.
 *      - epoch: Epoch timestamp used for uniqueness.
 *
 * Notes:
 *  - Uses UUID and current epoch to guarantee uniqueness.
 *  - Emails are logged to console for traceability.
 */

import { randomUUID } from 'crypto';

interface EmailEpochResult {
  loginEmail: string;
  epoch: number;
  bobEmail?: string;
  secondaryEmail?: string;
}

export function generateEmailWithEpoch(
  originalEmail: string,
  railcardType: string,
  orderType: 'BFS' | 'BOB',
  secondaryHolder: string // expects 'Yes' or 'No'
): EmailEpochResult {
  const epoch = Math.floor(Date.now() / 1000);
  const uniquePart = randomUUID().slice(0, 8);

  const loginEmail = originalEmail.replace(
    '@',
    `+${railcardType}${epoch}${uniquePart}@`
  );
  console.log(`Generated loginEmail: ${loginEmail}`);

  const result: EmailEpochResult = {
    loginEmail,
    epoch,
  };

  if (orderType === 'BOB') {
    const bobPart = randomUUID().slice(0, 8);
    result.bobEmail = originalEmail.replace('@', `+BOB${epoch}${bobPart}@`);
    console.log(`Generated bobEmail: ${result.bobEmail}`);
  }

  if (
    railcardType.toUpperCase() === 'TWOTOGETHER' ||
    secondaryHolder?.toUpperCase() === 'YES'
  ) {
    const secondaryPart = randomUUID().slice(0, 8);
    result.secondaryEmail = originalEmail.replace('@', `+SEC${epoch}${secondaryPart}@`);
    console.log(`Generated secondaryEmail: ${result.secondaryEmail}`);
  }

  return result;
}
