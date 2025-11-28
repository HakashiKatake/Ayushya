import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import Case from '@/models/Case';

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const eventType = searchParams.get('eventType');

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

    if (eventType) {
      query.eventType = eventType;
    }

    const events = await Event.find(query).sort({ timestamp: -1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
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
    const { caseId, eventType, timestamp, description, details } = body;

    if (!caseId || !eventType || !timestamp) {
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

    const event = await Event.create({
      caseId,
      eventType,
      timestamp,
      description,
      details,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
