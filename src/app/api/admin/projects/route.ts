import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Admin routes use service role key to bypass RLS
function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET() {
    try {
        // First validate user session with regular client
        const supabase = await import("@/lib/supabase/server").then(m => m.createClient());
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role from app_metadata
        const isAdmin = user.app_metadata?.role === 'admin';
        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Use service role client to bypass RLS for admin data fetching
        const adminClient = createAdminClient();

        const { data: projects, error: projectsError } = await adminClient
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (projectsError) {
            return NextResponse.json({ error: projectsError.message }, { status: 500 });
        }

        return NextResponse.json(projects || []);
    } catch (error) {
        console.error("Admin projects fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
