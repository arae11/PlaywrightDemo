import { randomUUID } from 'crypto';

interface EmailEpochResult {
    email: string;
    epoch: number;
}

export function generateEmailWithEpoch(
    originalEmail: string, 
    railcardType: string
): EmailEpochResult {
    const epoch = Math.floor(Date.now() / 1000);
    const uniquePart = randomUUID().slice(0, 8); // Shorten UUID for email readability
    const modifiedEmail = originalEmail.replace('@', `+${railcardType}${epoch}${uniquePart}@`);
    
    return {
        email: modifiedEmail,
        epoch
    };
}