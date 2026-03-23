import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ValidatedProjectData {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    city: string;
    squareMeters?: string;
    gymStyle: string;
    budget: string;
    requirements?: string;
  };
}

export async function saveProjectToDatabase(validatedData: ValidatedProjectData): Promise<{ id: string } & ValidatedProjectData> {
  const { customerInfo } = validatedData;

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      client_name: customerInfo.name,
      client_email: customerInfo.email,
      client_phone: customerInfo.phone,
      square_meters: customerInfo.squareMeters ? parseFloat(customerInfo.squareMeters) : null,
      gym_style: customerInfo.gymStyle,
      budget_range: customerInfo.budget,
      requirements: customerInfo.requirements || null,
      status: 'new',
    })
    .select('id')
    .single();

  if (projectError || !project) {
    console.error('Error creating project:', projectError);
    throw new Error('Failed to create project');
  }

  return { id: project.id, ...validatedData };
}