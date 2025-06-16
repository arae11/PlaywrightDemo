export function isDualCardholderRailcard(railcard?: string): boolean {
  if (!railcard) return false;
  const dualRailcards = ["FAMILYANDFRIENDS", "TWOTOGETHER"];
  return dualRailcards.includes(railcard.toUpperCase());
}

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

export function isAgeRelatedRailcard(railcard: string): boolean {
  const ageBasedRailcards = ["1625", "2630", "MATURE", "SENIOR"];
  return ageBasedRailcards.includes(railcard.toUpperCase());
}

