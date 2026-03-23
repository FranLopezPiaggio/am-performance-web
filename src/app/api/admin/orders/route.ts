import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import type { Order, OrderItem } from "@/types/database";

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

        const { data: orders, error: ordersError } = await adminClient
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (ordersError) {
            return NextResponse.json({ error: ordersError.message }, { status: 500 });
        }

        const { data: orderItems, error: itemsError } = await adminClient
            .from("order_items")
            .select("*");

        if (itemsError) {
            return NextResponse.json({ error: itemsError.message }, { status: 500 });
        }

        const ordersWithItems = (orders || []).map((order: Order) => ({
            ...order,
            items: (orderItems || []).filter((item: OrderItem) => item.order_id === order.id),
        }));

        return NextResponse.json(ordersWithItems);
    } catch (error) {
        console.error("Admin orders fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
