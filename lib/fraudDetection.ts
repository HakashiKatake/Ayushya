import standardPrices from '@/mock/standard_prices.json';

export interface FraudAnalysisResult {
  fraudScore: number;
  estimatedOverchargeMin: number;
  estimatedOverchargeMax: number;
  analysisExplanation: string;
  suspiciousItems: Array<{
    description: string;
    category: string;
    billedPrice: number;
    expectedMin: number;
    expectedMax: number;
    overcharge: number;
    reasons: string[];
  }>;
}

export interface BillItemInput {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp?: string;
}

export function analyzeBillForFraud(items: BillItemInput[]): FraudAnalysisResult {
  let totalSuspiciousAmount = 0;
  let totalOverchargeMin = 0;
  let totalOverchargeMax = 0;
  const suspiciousItems: FraudAnalysisResult['suspiciousItems'] = [];
  const flags: string[] = [];

  items.forEach((item) => {
    const standard = findStandardPrice(item.description, item.category);
    
    if (!standard) {
      // Unknown item - mark as suspicious
      suspiciousItems.push({
        description: item.description,
        category: item.category,
        billedPrice: item.totalPrice,
        expectedMin: 0,
        expectedMax: 0,
        overcharge: 0,
        reasons: ['Unknown item - cannot verify pricing'],
      });
      return;
    }

    const expectedMin = standard.min * item.quantity;
    const expectedMax = standard.max * item.quantity;
    const reasons: string[] = [];
    let isSuspicious = false;

    // Check if price is above expected range
    if (item.totalPrice > expectedMax) {
      const overcharge = item.totalPrice - expectedMax;
      totalOverchargeMin += overcharge;
      totalOverchargeMax += overcharge;
      isSuspicious = true;
      reasons.push(
        `Price ₹${item.totalPrice} exceeds expected range ₹${expectedMin}-₹${expectedMax}`
      );
    }

    // Check for excessive quantity
    if (item.quantity > 10 && item.category === 'Consumable') {
      isSuspicious = true;
      reasons.push(`Excessive quantity: ${item.quantity} units`);
    }

    // Check for midnight timing (11:59 PM rule)
    if (item.timestamp) {
      const hour = new Date(item.timestamp).getHours();
      const minute = new Date(item.timestamp).getMinutes();
      if ((hour === 23 && minute >= 59) || (hour === 0 && minute === 0)) {
        isSuspicious = true;
        reasons.push('⚠️ 11:59 PM Dark Pattern: Item added at suspicious time');
        flags.push('midnight_billing');
      }
    }

    if (isSuspicious) {
      totalSuspiciousAmount += item.totalPrice;
      suspiciousItems.push({
        description: item.description,
        category: item.category,
        billedPrice: item.totalPrice,
        expectedMin,
        expectedMax,
        overcharge: item.totalPrice > expectedMax ? item.totalPrice - expectedMax : 0,
        reasons,
      });
    }
  });

  // Calculate fraud score (0-1)
  const totalBillAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const fraudScore = Math.min(totalSuspiciousAmount / totalBillAmount, 1);

  // Generate explanation
  const explanation = generateFraudExplanation(suspiciousItems, flags, fraudScore);

  return {
    fraudScore,
    estimatedOverchargeMin: totalOverchargeMin,
    estimatedOverchargeMax: totalOverchargeMax,
    analysisExplanation: explanation,
    suspiciousItems,
  };
}

function findStandardPrice(description: string, category: string): { min: number; max: number } | null {
  const prices = standardPrices as any;
  
  // Try to find in all categories
  for (const [categoryKey, items] of Object.entries(prices)) {
    const itemsObj = items as Record<string, { min: number; max: number }>;
    
    // Exact match
    if (itemsObj[description]) {
      return itemsObj[description];
    }
    
    // Partial match
    const partialMatch = Object.keys(itemsObj).find((key) =>
      description.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(description.toLowerCase())
    );
    
    if (partialMatch) {
      return itemsObj[partialMatch];
    }
  }
  
  return null;
}

function generateFraudExplanation(
  suspiciousItems: FraudAnalysisResult['suspiciousItems'],
  flags: string[],
  fraudScore: number
): string {
  if (fraudScore < 0.2) {
    return 'Low risk of fraud. Most charges appear reasonable.';
  } else if (fraudScore < 0.5) {
    return `Medium fraud risk detected. ${suspiciousItems.length} item(s) have pricing concerns. ${
      flags.includes('midnight_billing')
        ? 'Dark pattern detected: Items added at 11:59 PM.'
        : ''
    }`;
  } else {
    return `High fraud risk! ${suspiciousItems.length} item(s) flagged. ${
      flags.includes('midnight_billing')
        ? 'Dark pattern detected: Items added at 11:59 PM. '
        : ''
    }Significant overcharging detected. Consider filing a complaint.`;
  }
}

// Check for duplicate tests
export function detectDuplicateTests(events: Array<{ type: string; timestamp: string; data: any }>): Array<{
  test: string;
  timestamps: string[];
  daysBetween: number;
}> {
  const testOrders = events.filter((e) => e.type === 'TEST_ORDERED');
  const duplicates: Array<{ test: string; timestamps: string[]; daysBetween: number }> = [];
  
  for (let i = 0; i < testOrders.length; i++) {
    for (let j = i + 1; j < testOrders.length; j++) {
      if (testOrders[i].data.test === testOrders[j].data.test) {
        const time1 = new Date(testOrders[i].timestamp);
        const time2 = new Date(testOrders[j].timestamp);
        const daysBetween = Math.abs(time2.getTime() - time1.getTime()) / (1000 * 60 * 60 * 24);
        
        // Flag if duplicate within 2 days
        if (daysBetween < 2) {
          duplicates.push({
            test: testOrders[i].data.test,
            timestamps: [testOrders[i].timestamp, testOrders[j].timestamp],
            daysBetween,
          });
        }
      }
    }
  }
  
  return duplicates;
}
