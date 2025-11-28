import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import InsurancePolicy from '@/models/InsurancePolicy';
import Bill from '@/models/Bill';
import BillItem from '@/models/BillItem';
import { analyzeInsuranceCoverage } from '@/lib/insuranceAnalysis';

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { billId, policyId } = body;

    if (!billId || !policyId) {
      return NextResponse.json({ error: 'Missing billId or policyId' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get policy
    const policy = await InsurancePolicy.findById(policyId);
    if (!policy || policy.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    // Get bill and items
    const bill = await Bill.findById(billId);
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    const billItems = await BillItem.find({ billId: bill._id });

    // Analyze coverage
    const analysis = analyzeInsuranceCoverage(billItems, policy.toObject());

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing insurance coverage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
