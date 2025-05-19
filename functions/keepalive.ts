import { Handler } from '@netlify/functions'; // or appropriate import for your platform
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';

export const handler: Handler = async (event, context) => {
  try {
    const ctx = await createTRPCContext({ req: event, res: context.res });
    const caller = appRouter.createCaller(ctx);
    
    await caller.movies.getAll();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Database kept alive', 
        timestamp: new Date().toISOString() 
      })
    };
  } catch (error) {
    console.error('Database keepalive failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Database keepalive failed', 
        error: String(error) 
      })
    };
  }
}; 