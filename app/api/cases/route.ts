import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Case from '@/models/Case';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find or create user
    let user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        role: 'PATIENT',
      });
      console.log('Auto-created user:', user);
    }

    const cases = await Case.find({ patientId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
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
    const { hospitalName, location, admissionDatetime, chiefComplaint } = body;

    if (!hospitalName || !location || !admissionDatetime || !chiefComplaint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Find or create user
    let user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) {
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        role: 'PATIENT',
      });
      console.log('Auto-created user:', user);
    }

    const newCase = await Case.create({
      patientId: user._id,
      hospitalName,
      location,
      admissionDatetime: new Date(admissionDatetime),
      chiefComplaint,
      status: 'ACTIVE',
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
