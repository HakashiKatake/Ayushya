import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Case from '@/models/Case';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const caseData = await Case.findOne({ _id: id, patientId: user._id });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ case: caseData });
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const updatedCase = await Case.findOneAndUpdate(
      { _id: id, patientId: user._id },
      body,
      { new: true }
    );

    if (!updatedCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ case: updatedCase });
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
