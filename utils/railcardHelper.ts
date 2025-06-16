/**
 * Checks if the given railcard is one of the dual-cardholder types.
 * Dual cardholder railcards include "FAMILYANDFRIENDS" and "TWOTOGETHER".
 * 
 * @param railcard - The railcard type string (optional)
 * @returns true if railcard is a dual cardholder type, false otherwise
 */
export function isDualCardholderRailcard(railcard?: string): boolean {
  if (!railcard) return false;
  const dualRailcards = ["FAMILYANDFRIENDS", "TWOTOGETHER"];
  return dualRailcards.includes(railcard.toUpperCase());
}

/**
 * Normalizes date of birth components by converting them to zero-padded strings.
 * For example, day = 7 becomes "07", month = 3 becomes "03".
 * Year is returned as a string without padding.
 * If any component is missing, it defaults to an empty string (or "00" for day/month).
 * 
 * @param day - Day of month (string or number, optional)
 * @param month - Month (string or number, optional)
 * @param year - Year (string or number, optional)
 * @returns An object with zero-padded day, month, and year strings
 */
export function normalizeDOB(
  day?: string | number,
  month?: string | number,
  year?: string | number
) {
  return {
    day: (day ?? "").toString().padStart(2, "0"),
    month: (month ?? "").toString().padStart(2, "0"),
    year: (year ?? "").toString(),
  };
}

/**
 * Checks if the given railcard is age-related.
 * Age-related railcards include "1625", "2630", "MATURE", and "SENIOR".
 * 
 * @param railcard - The railcard type string (required)
 * @returns true if railcard is age-related, false otherwise
 */
export function isAgeRelatedRailcard(railcard: string): boolean {
  const ageBasedRailcards = ["1625", "2630", "MATURE", "SENIOR"];
  return ageBasedRailcards.includes(railcard.toUpperCase());
}

