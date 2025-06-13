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
