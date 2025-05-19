import { NextResponse } from 'next/server';
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';

export const runtime = 'edge';

export async function GET() {
  try {
    // Create a context for the TRPC request
    const ctx = await createTRPCContext({ req: null, res: null });
    
    // Create a TRPC caller
    const caller = appRouter.createCaller(ctx);
    
    // Call the getAll method
    await caller.movies.getAll();

    return NextResponse.json({ 
      message: 'Database kept alive', 
      timestamp: new Date().toISOString() 
    }, { status: 200 });
  } catch (error) {
    console.error('Database keepalive failed:', error);
    return NextResponse.json({ 
      message: 'Database keepalive failed', 
      error: String(error) 
    }, { status: 500 });
  }
} 