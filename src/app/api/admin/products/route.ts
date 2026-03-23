import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
import type { Product, Category, ProductCategory } from "@/types/database";

interface ProductWithCategories extends Product {
    categories: Category[];
}

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

        const { data: products, error: productsError } = await adminClient
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (productsError) {
            return NextResponse.json({ error: productsError.message }, { status: 500 });
        }

        const { data: productCategories, error: pcError } = await adminClient
            .from("product_categories")
            .select("*");

        if (pcError) {
            return NextResponse.json({ error: pcError.message }, { status: 500 });
        }

        const { data: categories, error: categoriesError } = await adminClient
            .from("categories")
            .select("*");

        if (categoriesError) {
            return NextResponse.json({ error: categoriesError.message }, { status: 500 });
        }

        const productsWithCategories = (products || []).map((product: Product) => {
            const productCategoryLinks = (productCategories || []).filter(
                (pc: ProductCategory) => pc.product_id === product.id
            );
            const categoryIds = productCategoryLinks.map((pc) => pc.category_id);
            const productCategoriesList = (categories || []).filter((c: Category) =>
                categoryIds.includes(c.id)
            );

            return {
                ...product,
                categories: productCategoriesList,
            } as ProductWithCategories;
        });

        return NextResponse.json(productsWithCategories);
    } catch (error) {
        console.error("Admin products fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
