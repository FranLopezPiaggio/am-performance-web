import { NextRequest, NextResponse } from 'next/server';
import { handleSubmission } from '@/lib/services/submissionService';
import { createProjectSchema, CreateProjectInput } from '@/lib/validations/projects';
import { saveProjectToDatabase } from '@/lib/supabase/projects';
import { WhatsAppMsgContext } from '@/lib/whatsapp/types';

export async function POST(request: NextRequest) {
    try {
        const rawData = await request.json();

        const result = await handleSubmission<CreateProjectInput>(
            rawData,
            createProjectSchema,
            saveProjectToDatabase,
            'projects' as WhatsAppMsgContext
        );

        if (result.success) {
            return NextResponse.json({
                success: true,
                projectId: result.recordId,
                whatsappUrl: result.whatsappUrl
            });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (error) {
        console.error('Projects API Error:', error);
        return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 });
    }
}