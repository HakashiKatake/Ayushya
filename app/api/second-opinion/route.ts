import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import SecondOpinionRequest from '@/models/SecondOpinionRequest';
import Case from '@/models/Case';
import aiResponsesData from '@/mock/ai_responses.json';

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

    let query: any = { userId: user._id };

    if (caseId) {
      // Verify case belongs to user
      const caseDoc = await Case.findById(caseId);
      if (!caseDoc || caseDoc.patientId.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }
      query.caseId = caseId;
    }

    const requests = await SecondOpinionRequest.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching second opinion requests:', error);
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
    const { caseId, questionType, context } = body;

    if (!caseId || !questionType) {
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

    // Get mock AI response based on question type
    const aiResponses: any = aiResponsesData;
    const mockResponse = aiResponses[questionType] || aiResponses.treatment_necessary;

    // Create second opinion request
    const secondOpinionRequest = await SecondOpinionRequest.create({
      userId: user._id,
      caseId,
      questionType,
      context: context || '',
      response: mockResponse.response,
      appropriatenessScore: mockResponse.appropriateness,
      recommendations: mockResponse.recommendations,
      questionsForDoctor: mockResponse.questions_for_doctor,
    });

    return NextResponse.json({ 
      request: secondOpinionRequest,
      mockResponse 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating second opinion request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
