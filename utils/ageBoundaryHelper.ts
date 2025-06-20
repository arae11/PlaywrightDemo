/**
 * Railcard Boundary DOB Calculator
 * 
 * Purpose:
 *  - Calculates valid boundary Dates of Birth (DOB) for railcard eligibility.
 *  - Used for generating test data for different railcard types, durations, and eligibility boundaries.
 * 
 * Types:
 *  - BoundaryType: 'lower' | 'upper'
 *  - RailcardType: '1625' | '2630' | 'MATURE' | 'SENIOR' | 'NETWORK' | 'TWOTOGETHER' | 'FAMILYANDFRIENDS' | 'SANTANDER' | 'DPRC'
 *  - BoundaryDOB: { day: number, month: number, year: number }
 * 
 * Main Function: calculateBoundaryDOB(railcard, boundaryType, years)
 *  - railcard: The type of railcard.
 *  - boundaryType: Whether to calculate the lower or upper eligibility boundary.
 *  - years: Railcard duration (defaults to 1 year; accepts 1 or 3).
 * 
 * Logic:
 *  - Validates inputs.
 *  - Determines min and max eligible ages based on railcard type and duration.
 *  - Calculates boundary DOB:
 *      - Lower boundary: Subtract minAge + 2 weeks from today.
 *      - Upper boundary: Subtract maxAge (+1 if flexible), add 1 day buffer if applicable.
 * 
 * Utility Function: subtractYearsFromDate(date, years)
 *  - Subtracts an approximate number of days (years * 365) from a given date.
 * 
 * Notes:
 *  - Currently only supports 1625, 2630, MATURE, and SENIOR railcard types.
 *  - Throws errors for unsupported railcard types or invalid inputs.
 */


export type BoundaryType = 'lower' | 'upper';
export type RailcardType = '1625' | '2630' | 'MATURE' | 'SENIOR' | 'NETWORK' | 'TWOTOGETHER' | 'FAMILYANDFRIENDS' | 'SANTANDER' | 'DPRC';

interface BoundaryDOB {
  day: number;
  month: number;
  year: number;
}

export function calculateBoundaryDOB(
  railcard: RailcardType,
  boundaryType: BoundaryType,
  years: 1 | 3 = 1
): BoundaryDOB {
  const currentDate = new Date();

  // Validate inputs
  if (!['lower', 'upper'].includes(boundaryType.toLowerCase())) {
    throw new Error(`Invalid boundary_type: ${boundaryType}`);
  }

  if (![1, 3].includes(years)) {
    throw new Error(`Invalid YEARS: ${years}`);
  }

  // Set min and max age
  const rc = railcard.toUpperCase();
  let minAge: number;
  let maxAge: number;

  switch (rc) {
    case '1625':
      minAge = 16;
      maxAge = years === 3 ? 23 : 25;
      break;
    case '2630':
      minAge = 26;
      maxAge = 30;
      break;
    case 'MATURE':
      minAge = 26;
      maxAge = 150;
      break;
    case 'SENIOR':
      minAge = 60;
      maxAge = 150;
      break;
    default:
      throw new Error(`Unsupported railcard type: ${railcard}`);
  }

  let birthDate: Date;

  if (boundaryType.toLowerCase() === 'lower') {
    // Lower boundary: just older than minAge, so subtract minAge + 0 years and 2 weeks
    birthDate = new Date(
      currentDate.getFullYear() - minAge,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    // Subtract 2 weeks
    birthDate.setDate(birthDate.getDate() - 14); // Subtract 2 weeks
  } else {
    // Upper boundary logic
    // For SENIOR/MATURE, use maxAge
    // For others (like 16-25), use maxAge + 1 and add 1-day buffer
    const isFlexible = !['SENIOR', 'MATURE'].includes(rc);
    const yearsToSubtract = maxAge + (isFlexible ? 1 : 0);

    birthDate = new Date(
      currentDate.getFullYear() - yearsToSubtract,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (isFlexible) {
      // Add 1-day buffer to get "just younger" than the limit
      birthDate.setDate(birthDate.getDate() + 1);
    }
  }

  return {
    day: birthDate.getDate(),
    month: birthDate.getMonth() + 1, // Month is 0-indexed
    year: birthDate.getFullYear()
  };
}

export function subtractYearsFromDate(date: Date, years: number): Date {
  const approxDays = years * 365;
  const result = new Date(date);
  result.setDate(result.getDate() - approxDays);
  return result;
}
