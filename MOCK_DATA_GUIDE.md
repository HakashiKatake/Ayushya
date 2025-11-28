# 📊 Mock Data Reference Guide

This guide explains all the mock data available in AYUSHYA and how to use it in your features.

## 📁 Mock Data Files

### 1. `mock/events.json`
**Purpose:** Sample hospital events for Medical BlackBox timeline

**Structure:**
```json
{
  "timestamp": "2025-01-03T09:00:00",
  "type": "TEST_ORDERED | DOCTOR_VISIT | MEDICATION_GIVEN | etc.",
  "data": {
    "test": "CBC",
    "doctor": "Dr. Sharma",
    // ... other fields
  }
}
```

**Event Types:**
- `TEST_ORDERED` - Lab test ordered
- `TEST_RESULT` - Lab results received
- `DOCTOR_VISIT` - Doctor consultation
- `MEDICATION_GIVEN` - Medicine administered
- `ROOM_CHANGE` - Room transfer
- `ICU_ADMISSION` - ICU admission
- `ICU_DISCHARGE` - ICU discharge
- `BILL_ITEM_ADDED` - Billing entry
- `INSURANCE_ACTION` - Insurance event
- `NOTE` - General note

**Fraud Flags in Data:**
- `suspicious: true` - Marks event as suspicious
- `note` with "⚠️" - Contains warning message
- Events at 11:59 PM automatically flagged

**Usage Example:**
```typescript
import mockEvents from '@/mock/events.json';

// Load events for a case
const events = mockEvents.map(event => ({
  ...event,
  caseId: caseId,
  source: 'SIMULATOR'
}));

// Save to database
await Event.insertMany(events);
```

---

### 2. `mock/standard_prices.json`
**Purpose:** Expected price ranges for fraud detection

**Structure:**
```json
{
  "tests": {
    "CBC": { "min": 200, "max": 400, "category": "Blood Test" }
  },
  "medications": { ... },
  "procedures": { ... },
  "room_charges": { ... },
  "consumables": { ... },
  "doctor_fees": { ... }
}
```

**Categories:**
- **tests** - Lab tests and imaging
- **medications** - Medicines and injections
- **procedures** - Medical procedures
- **room_charges** - Accommodation
- **consumables** - PPE, gloves, syringes
- **doctor_fees** - Consultation fees

**Usage Example:**
```typescript
import { analyzeBillForFraud } from '@/lib/fraudDetection';

const billItems = [
  {
    description: 'CBC',
    category: 'Blood Test',
    quantity: 1,
    unitPrice: 350,
    totalPrice: 350
  }
];

const analysis = analyzeBillForFraud(billItems);
console.log(analysis.fraudScore); // 0-1 score
console.log(analysis.suspiciousItems); // Array of flagged items
```

---

### 3. `mock/policy_rules.json`
**Purpose:** Insurance policy templates

**Structure:**
```json
{
  "basic_policy": {
    "name": "Standard Health Insurance",
    "room_rent_limit": 3000,
    "icu_limit": 7000,
    "copay_percentage": 10,
    "sum_insured": 500000,
    "exclusions": ["PPE Kits", "Consumables"],
    "sublimits": { ... },
    "pre_hospitalization_days": 30,
    "post_hospitalization_days": 60
  }
}
```

**Policy Types:**
- `basic_policy` - Standard coverage
- `premium_policy` - Enhanced coverage
- `government_scheme` - Ayushman Bharat type

**Usage Example:**
```typescript
import { analyzeInsuranceCoverage } from '@/lib/insuranceAnalysis';

const analysis = analyzeInsuranceCoverage(
  billItems,
  'basic_policy',
  admissionDate
);

console.log(analysis.likelyCovered); // Amount covered
console.log(analysis.outOfPocket); // Patient pays
console.log(analysis.warnings); // Coverage issues
```

---

### 4. `mock/ai_responses.json`
**Purpose:** Pre-generated AI responses for second opinion

**Structure:**
```json
{
  "second_opinion": {
    "treatment_necessary": {
      "dengue_case": {
        "summary": "...",
        "appropriateness": "APPROPRIATE | MOSTLY_APPROPRIATE | QUESTIONABLE",
        "recommendations": [...],
        "questions_for_doctor": [...]
      }
    }
  },
  "fraud_analysis": { ... }
}
```

**Question Types:**
- `treatment_necessary` - Was treatment needed?
- `tests_excessive` - Were tests appropriate?
- `explain_simple` - Explain in simple terms

**Usage Example:**
```typescript
import aiResponses from '@/mock/ai_responses.json';

// Get second opinion response
const response = aiResponses.second_opinion.treatment_necessary.dengue_case;

// Display to user
<div>
  <h3>Summary</h3>
  <p>{response.summary}</p>
  
  <h3>Recommendations</h3>
  <ul>
    {response.recommendations.map(r => <li>{r}</li>)}
  </ul>
</div>
```

---

## 🎯 Common Use Cases

### Use Case 1: Load Demo Events for a Case

```typescript
// In your case detail page or API route
import mockEvents from '@/mock/events.json';
import Event from '@/models/Event';

async function loadDemoEvents(caseId: string) {
  const events = mockEvents.map(event => ({
    caseId,
    timestamp: new Date(event.timestamp),
    type: event.type,
    source: 'SIMULATOR' as const,
    data: event.data
  }));
  
  await Event.insertMany(events);
  return events;
}
```

### Use Case 2: Analyze Bill for Fraud

```typescript
// Bill upload handler
import { analyzeBillForFraud } from '@/lib/fraudDetection';

async function handleBillUpload(billItems: BillItem[]) {
  // Analyze fraud
  const analysis = analyzeBillForFraud(billItems);
  
  // Save to database
  const bill = await Bill.create({
    caseId,
    totalAmount: billItems.reduce((sum, item) => sum + item.totalPrice, 0),
    fraudScore: analysis.fraudScore,
    estimatedOverchargeMin: analysis.estimatedOverchargeMin,
    estimatedOverchargeMax: analysis.estimatedOverchargeMax,
    analysisExplanation: analysis.analysisExplanation
  });
  
  // Save suspicious items
  for (const item of billItems) {
    const suspiciousItem = analysis.suspiciousItems.find(
      s => s.description === item.description
    );
    
    await BillItem.create({
      billId: bill._id,
      ...item,
      isSuspicious: !!suspiciousItem,
      suspicionReasons: suspiciousItem?.reasons || []
    });
  }
  
  return bill;
}
```

### Use Case 3: Check Insurance Coverage

```typescript
// Insurance optimizer
import { analyzeInsuranceCoverage } from '@/lib/insuranceAnalysis';

function InsuranceOptimizer({ billItems, policyType }) {
  const analysis = analyzeInsuranceCoverage(billItems, policyType);
  
  return (
    <div>
      <h2>Coverage Analysis</h2>
      
      <div className="stats">
        <Stat label="Covered" value={`₹${analysis.likelyCovered}`} />
        <Stat label="Out of Pocket" value={`₹${analysis.outOfPocket}`} />
        <Stat label="Co-pay" value={`₹${analysis.copayAmount}`} />
      </div>
      
      {analysis.warnings.length > 0 && (
        <Alert>
          <h3>Warnings</h3>
          <ul>
            {analysis.warnings.map(w => <li>{w}</li>)}
          </ul>
        </Alert>
      )}
      
      <h3>Breakdown by Category</h3>
      <Table>
        <Row>
          <Cell>Tests</Cell>
          <Cell>₹{analysis.breakdown.tests.covered}</Cell>
          <Cell>₹{analysis.breakdown.tests.excluded}</Cell>
        </Row>
        {/* ... more categories */}
      </Table>
    </div>
  );
}
```

### Use Case 4: Display Second Opinion

```typescript
// Second opinion page
import aiResponses from '@/mock/ai_responses.json';

function SecondOpinionView({ questionType }) {
  // For demo, always show dengue case response
  const response = aiResponses.second_opinion[questionType].dengue_case;
  
  return (
    <div>
      <Badge variant={
        response.appropriateness === 'APPROPRIATE' ? 'success' : 'warning'
      }>
        {response.appropriateness}
      </Badge>
      
      <h2>Summary</h2>
      <p>{response.summary}</p>
      
      <h3>Our Recommendations</h3>
      <ul>
        {response.recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      
      <h3>Questions to Ask Your Doctor</h3>
      <ul>
        {response.questions_for_doctor.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔍 Fraud Detection Rules

The fraud detection engine (`lib/fraudDetection.ts`) checks for:

### 1. **Price Overcharging**
- Compares billed amount vs expected range
- Flags if price > maximum expected
- Calculates overcharge amount

### 2. **Excessive Quantities**
- Flags >10 units of consumables
- Example: 20 gloves charged

### 3. **11:59 PM Dark Pattern**
- Checks timestamp hour/minute
- Flags items added 23:59 or 00:00
- Common billing fraud technique

### 4. **Duplicate Tests**
- Finds same test ordered within 2 days
- Flags as unnecessary repetition

### 5. **Unknown Items**
- Items not in standard_prices.json
- Flagged for manual review

## 💡 Tips for Development

### Tip 1: Start with Mock Data
Don't worry about real AI or OCR initially. Use mock data to build UI and logic.

### Tip 2: Create Mock Bill Items
```typescript
const mockBillItems = [
  { description: 'CBC', category: 'Blood Test', quantity: 1, unitPrice: 300, totalPrice: 300 },
  { description: 'CT Scan', category: 'Imaging', quantity: 1, unitPrice: 6000, totalPrice: 6000 }, // Overpriced!
  { description: 'Gloves', category: 'Consumable', quantity: 20, unitPrice: 50, totalPrice: 1000 } // Excessive!
];
```

### Tip 3: Test Fraud Scenarios
Create bills with known fraud patterns to test detection:
- Price way above max
- Midnight timestamps
- Duplicate items
- Excessive quantities

### Tip 4: Extend Mock Data
You can add more scenarios to each JSON file:
- More event types
- More medical tests
- More insurance policies
- More AI response scenarios

## 📈 Future: Real AI Integration

When ready to add real AI (OpenAI, Gemini), you can:

1. Keep mock responses as fallback
2. Use AI for:
   - Bill OCR (text extraction from images)
   - Natural language explanations
   - Dynamic second opinions
   - Personalized recommendations

3. Structure:
```typescript
async function getSecondOpinion(question: string, caseData: any) {
  try {
    // Try real AI
    const aiResponse = await callOpenAI(question, caseData);
    return aiResponse;
  } catch (error) {
    // Fallback to mock
    return mockAiResponses.second_opinion[questionType];
  }
}
```

---

## 🎨 UI Components for Mock Data

### Event Timeline Item
```typescript
function EventItem({ event }) {
  const icon = getEventIcon(event.type);
  const color = getEventColor(event.type);
  const isSuspicious = event.data.suspicious;
  
  return (
    <div className={`flex gap-4 ${isSuspicious ? 'border-red-500' : ''}`}>
      <div className={`icon ${color}`}>{icon}</div>
      <div>
        <div className="font-semibold">{event.type}</div>
        <div className="text-sm text-gray-600">
          {formatEventData(event.data)}
        </div>
        {isSuspicious && (
          <Badge variant="destructive">Suspicious</Badge>
        )}
      </div>
    </div>
  );
}
```

### Fraud Score Display
```typescript
function FraudScore({ score }) {
  const percentage = Math.round(score * 100);
  const level = score > 0.7 ? 'HIGH' : score > 0.3 ? 'MEDIUM' : 'LOW';
  const color = score > 0.7 ? 'red' : score > 0.3 ? 'yellow' : 'green';
  
  return (
    <Card>
      <div className="text-6xl font-bold" style={{ color }}>
        {percentage}%
      </div>
      <div className="text-xl">{level} RISK</div>
    </Card>
  );
}
```

---

**Happy coding with mock data! 🚀**
