import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Bill from '@/models/Bill';
import BillItem from '@/models/BillItem';
import Case from '@/models/Case';
import { analyzeBillForFraud } from '@/lib/fraudDetection';

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query: any = {};

    if (caseId) {
      // Verify case belongs to user
      const caseDoc = await Case.findById(caseId);
      if (!caseDoc || caseDoc.patientId.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }
      query.caseId = caseId;
    }

    const bills = await Bill.find(query).sort({ createdAt: -1 });

    // Get bill items for each bill
    const billsWithItems = await Promise.all(
      bills.map(async (bill) => {
        const items = await BillItem.find({ billId: bill._id });
        return { ...bill.toObject(), items };
      })
    );

    return NextResponse.json({ bills: billsWithItems });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { caseId, items, billDate } = body;

    if (!caseId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify case belongs to user
    const caseDoc = await Case.findById(caseId);
    if (!caseDoc || caseDoc.patientId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);

    // Run fraud detection
    const fraudAnalysis = analyzeBillForFraud(items);

    // Create bill
    const bill = await Bill.create({
      caseId,
      totalAmount,
      fraudScore: fraudAnalysis.fraudScore,
      estimatedOverchargeMin: fraudAnalysis.estimatedOverchargeMin,
      estimatedOverchargeMax: fraudAnalysis.estimatedOverchargeMax,
      analysisExplanation: fraudAnalysis.analysisExplanation,
      billDate: billDate || new Date(),
    });

    // Create bill items
    const billItems = await BillItem.insertMany(
      items.map((item: any) => ({
        billId: bill._id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        category: item.category || 'Other',
        timestamp: item.timestamp || new Date(),
      }))
    );

    return NextResponse.json({
      bill: { ...bill.toObject(), items: billItems },
      fraudAnalysis
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
