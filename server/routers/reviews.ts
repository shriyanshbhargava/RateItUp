import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const reviewsRouter = router({
  getAll: publicProcedure.query(async () => {
    return prisma.review.findMany({
      include: {
        movie: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        movieId: z.number(),
        reviewer: z.string().optional(),
        rating: z.number(),
        comments: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      return await prisma.review.create({
        data: {
          movieId: input.movieId,
          reviewer: input.reviewer,
          rating: input.rating,
          comments: input.comments,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      return await prisma.review.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getReviewsByMovieId: publicProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async (opts) => {
      const { input } = opts;
      return await prisma.review.findMany({
        where: { AND: [{ movieId: { equals: input.movieId } }] }, // Filter reviews by movieId
      });
    }),
});
