interface EmailEpochResult {
    email: string;
    epoch: number;
}

export function generateEmailWithEpoch(
    originalEmail: string, 
    railcardType: string
): EmailEpochResult {
    const epoch = Math.floor(Date.now() / 1000);
    const modifiedEmail = originalEmail.replace('@', `+${railcardType}${epoch}@`);
    
    const result = {
        email: modifiedEmail,
        epoch
    };

    // Log the returned email and epoch
    // console.log('Generated email with epoch:', result);
    
    return result;
}