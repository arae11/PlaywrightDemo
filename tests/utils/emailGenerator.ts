import { randomUUID } from 'crypto';

interface EmailEpochResult {
    loginEmail: string;
    epoch: number;
    bobEmail?: string;
}

export function generateEmailWithEpoch(
    originalEmail: string,
    railcardType: string,
    orderType: 'BFS' | 'BOB'
): EmailEpochResult {
    const epoch = Math.floor(Date.now() / 1000);
    const uniquePart = randomUUID().slice(0, 8); // Shortened UUID

    const loginEmail = originalEmail.replace('@', `+${railcardType}${epoch}${uniquePart}@`);

    if (orderType === 'BOB') {
        const bobPart = randomUUID().slice(0, 8);
        const bobEmail = originalEmail.replace('@', `+BOB${epoch}${bobPart}@`);
        return {
            loginEmail,
            epoch,
            bobEmail
        };
    }

    return {
        loginEmail,
        epoch
    };
}
