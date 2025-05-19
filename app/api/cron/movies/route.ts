import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { createContext } from "@/server/context";

export const runtime = "nodejs"; // Ensure Node.js runtime

export async function GET() {
  try {
    // Create a caller to directly invoke the tRPC procedure
    const caller = appRouter.createCaller(await createContext());

    // Call the movies.getAll procedure
    const movies = await caller.movies.getAll();

    console.log("Scheduled movie fetch completed", movies.length);

    return new Response(
      JSON.stringify({
        success: true,
        movieCount: movies.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in scheduled movie fetch:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
