import { NextResponse } from 'next/server';
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Check for a secret token
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('Keepalive route called at:', new Date().toISOString());

  try {
    const ctx = await createTRPCContext({ req: null, res: null });
    const caller = appRouter.createCaller(ctx);
    
    const startTime = Date.now();
    await caller.movies.getAll();
    const endTime = Date.now();

    console.log(`Database query completed in ${endTime - startTime}ms`);

    return NextResponse.json({ 
      message: 'Database kept alive', 
      timestamp: new Date().toISOString(),
      queryTime: endTime - startTime 
    }, { status: 200 });
  } catch (error) {
    console.error('Database keepalive failed:', error);
    return NextResponse.json({ 
      message: 'Database keepalive failed', 
      error: String(error) 
    }, { status: 500 });
  }
} 