import { moviesRouter } from "./routers/movies";
import { reviewsRouter } from "./routers/reviews";
import { router } from "./trpc";

export const appRouter = router({
  movies: moviesRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
