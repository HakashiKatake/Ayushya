import policyRules from '@/mock/policy_rules.json';

export interface InsuranceAnalysis {
  likelyCovered: number;
  outOfPocket: number;
  warnings: string[];
  breakdown: {
    roomCharges: { claimed: number; covered: number; excluded: number };
    icuCharges: { claimed: number; covered: number; excluded: number };
    tests: { claimed: number; covered: number; excluded: number };
    medications: { claimed: number; covered: number; excluded: number };
    consumables: { claimed: number; covered: number; excluded: number };
    other: { claimed: number; covered: number; excluded: number };
  };
  copayAmount: number;
}

export interface PolicyDetails {
  name: string;
  room_rent_limit: number;
  icu_limit: number;
  copay_percentage: number;
  sum_insured: number;
  exclusions: string[];
  pre_hospitalization_days?: number;
  post_hospitalization_days?: number;
}

export interface BillItem {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp?: string;
}

export function analyzeInsuranceCoverage(
  billItems: BillItem[],
  policyType: 'basic_policy' | 'premium_policy' | 'government_scheme' = 'basic_policy',
  admissionDate?: Date
): InsuranceAnalysis {
  const policy = (policyRules as any)[policyType] as PolicyDetails;
  
  const breakdown = {
    roomCharges: { claimed: 0, covered: 0, excluded: 0 },
    icuCharges: { claimed: 0, covered: 0, excluded: 0 },
    tests: { claimed: 0, covered: 0, excluded: 0 },
    medications: { claimed: 0, covered: 0, excluded: 0 },
    consumables: { claimed: 0, covered: 0, excluded: 0 },
    other: { claimed: 0, covered: 0, excluded: 0 },
  };
  
  const warnings: string[] = [];
  let totalClaimed = 0;
  let totalCovered = 0;

  billItems.forEach((item) => {
    totalClaimed += item.totalPrice;
    
    // Check if item is in exclusions
    const isExcluded = policy.exclusions.some((exclusion) =>
      item.description.toLowerCase().includes(exclusion.toLowerCase())
    );

    if (isExcluded) {
      warnings.push(`${item.description} is excluded from coverage`);
      categorizeItem(item, breakdown, 0, true);
      return;
    }

    let coveredAmount = item.totalPrice;

    // Apply room rent limits
    if (item.description.toLowerCase().includes('general ward') || 
        item.description.toLowerCase().includes('room')) {
      breakdown.roomCharges.claimed += item.totalPrice;
      
      const dailyRate = item.unitPrice;
      if (dailyRate > policy.room_rent_limit) {
        const excessPerDay = dailyRate - policy.room_rent_limit;
        const totalExcess = excessPerDay * item.quantity;
        coveredAmount -= totalExcess;
        warnings.push(
          `Room rent (₹${dailyRate}/day) exceeds limit (₹${policy.room_rent_limit}/day). Excess: ₹${totalExcess}`
        );
      }
      breakdown.roomCharges.covered += coveredAmount;
    }
    // Apply ICU limits
    else if (item.description.toLowerCase().includes('icu')) {
      breakdown.icuCharges.claimed += item.totalPrice;
      
      const dailyRate = item.unitPrice;
      if (dailyRate > policy.icu_limit) {
        const excessPerDay = dailyRate - policy.icu_limit;
        const totalExcess = excessPerDay * item.quantity;
        coveredAmount -= totalExcess;
        warnings.push(
          `ICU charges (₹${dailyRate}/day) exceed limit (₹${policy.icu_limit}/day). Excess: ₹${totalExcess}`
        );
      }
      breakdown.icuCharges.covered += coveredAmount;
    }
    // Categorize other items
    else {
      categorizeItem(item, breakdown, coveredAmount, false);
    }

    totalCovered += coveredAmount;
  });

  // Apply copay
  const copayAmount = (totalCovered * policy.copay_percentage) / 100;
  totalCovered -= copayAmount;

  // Check sum insured limit
  if (totalCovered > policy.sum_insured) {
    warnings.push(
      `Total claim (₹${totalCovered.toFixed(2)}) exceeds sum insured (₹${policy.sum_insured})`
    );
    totalCovered = policy.sum_insured;
  }

  const outOfPocket = totalClaimed - totalCovered;

  return {
    likelyCovered: Math.round(totalCovered),
    outOfPocket: Math.round(outOfPocket),
    warnings,
    breakdown,
    copayAmount: Math.round(copayAmount),
  };
}

function categorizeItem(
  item: BillItem,
  breakdown: InsuranceAnalysis['breakdown'],
  coveredAmount: number,
  isExcluded: boolean
) {
  const desc = item.description.toLowerCase();
  const cat = item.category.toLowerCase();

  if (desc.includes('test') || desc.includes('scan') || desc.includes('ray') || 
      cat.includes('blood test') || cat.includes('imaging') || cat.includes('diagnostic')) {
    breakdown.tests.claimed += item.totalPrice;
    if (!isExcluded) breakdown.tests.covered += coveredAmount;
    else breakdown.tests.excluded += item.totalPrice;
  } else if (desc.includes('tablet') || desc.includes('capsule') || desc.includes('injection') || 
             desc.includes('medicine') || cat.includes('analgesic') || cat.includes('antibiotic')) {
    breakdown.medications.claimed += item.totalPrice;
    if (!isExcluded) breakdown.medications.covered += coveredAmount;
    else breakdown.medications.excluded += item.totalPrice;
  } else if (desc.includes('glove') || desc.includes('syringe') || desc.includes('ppe') || 
             desc.includes('cotton') || cat.includes('consumable')) {
    breakdown.consumables.claimed += item.totalPrice;
    if (!isExcluded) breakdown.consumables.covered += coveredAmount;
    else breakdown.consumables.excluded += item.totalPrice;
  } else {
    breakdown.other.claimed += item.totalPrice;
    if (!isExcluded) breakdown.other.covered += coveredAmount;
    else breakdown.other.excluded += item.totalPrice;
  }
}
