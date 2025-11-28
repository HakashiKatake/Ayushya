import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import InsurancePolicy from '@/models/InsurancePolicy';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const policies = await InsurancePolicy.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ policies });
  } catch (error) {
    console.error('Error fetching insurance policies:', error);
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
    const { 
      policyNumber, 
      provider, 
      policyType, 
      coverageAmount, 
      copayPercentage,
      roomRentLimit,
      icuRentLimit,
      exclusions
    } = body;

    if (!policyNumber || !provider || !policyType || !coverageAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const policy = await InsurancePolicy.create({
      userId: user._id,
      policyNumber,
      provider,
      policyType,
      coverageAmount,
      copayPercentage: copayPercentage || 0,
      roomRentLimit,
      icuRentLimit,
      exclusions: exclusions || [],
    });

    return NextResponse.json({ policy }, { status: 201 });
  } catch (error) {
    console.error('Error creating insurance policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
