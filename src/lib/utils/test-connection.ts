// src/lib/test-connection.ts
// Smoke Test: Verify Supabase Connection
// AMPerformance - AGENT-BACKEND

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Initializes the Supabase client using environment variables.
 * Throws error if required env vars are missing.
 */
function getSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required environment variables:\n' +
      '  - NEXT_PUBLIC_SUPABASE_URL\n' +
      '  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Please check your .env.local file.'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Smoke Test Function
 * 
 * Tests the Supabase connection by executing a simple count query on products.
 * This verifies:
 * 1. Environment variables are set correctly
 * 2. Supabase client can be initialized
 * 3. Database connection is working
 * 
 * @returns Promise<{ success: boolean; message: string; data?: unknown; error?: string }>
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}> {
  console.log('🔌 Testing Supabase Connection...\n');

  try {
    // 1. Initialize Supabase client
    console.log('📡 Initializing Supabase client...');
    const supabase = getSupabaseClient();
    console.log('   ✓ Client initialized');
    console.log(`   📍 URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

    // 2. Execute simple count query
    console.log('🔍 Executing test query: products count...');
    const { error, count, status, statusText } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('   ❌ Query failed:', error.message);
      console.error('   📊 Status:', status, statusText);
      
      return {
        success: false,
        message: 'Failed to execute query',
        error: error.message,
      };
    }

    // 3. Success!
    console.log('   ✓ Query executed successfully');
    console.log(`   📊 Products count: ${count ?? 0}`);
    console.log(`   📊 Status: ${status} ${statusText}\n`);

    return {
      success: true,
      message: `Connection successful! Found ${count ?? 0} products.`,
      data: { count, status },
    };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Connection test failed:', errorMessage);

    return {
      success: false,
      message: 'Connection test failed',
      error: errorMessage,
    };
  }
}

/**
 * Alternative: Test connection using RPC (PostgreSQL function)
 * Useful if the table doesn't exist yet but database is reachable
 */
export async function testDatabaseVersion(): Promise<{
  success: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, version: data };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

// Run if called directly (for manual testing)
if (require.main === module) {
  testSupabaseConnection()
    .then((result) => {
      console.log('\n📋 Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
