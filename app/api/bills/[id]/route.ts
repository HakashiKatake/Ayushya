import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Bill from '@/models/Bill';
import BillItem from '@/models/BillItem';
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

    const { id } = await params;

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // Verify bill's case belongs to user
    const caseDoc = await Case.findById(bill.caseId);
    if (!caseDoc || caseDoc.patientId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const items = await BillItem.find({ billId: bill._id });

    return NextResponse.json({ bill: { ...bill.toObject(), items } });
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bill = await Bill.findById(id);
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    // Verify bill's case belongs to user
    const caseDoc = await Case.findById(bill.caseId);
    if (!caseDoc || caseDoc.patientId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete bill items
    await BillItem.deleteMany({ billId: bill._id });

    // Delete bill
    await Bill.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Bill deleted' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
