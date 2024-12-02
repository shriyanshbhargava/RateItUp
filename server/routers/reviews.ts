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

  update: publicProcedure
    .input(
      z.object({
        id: z.number(), // Review ID to identify the review
        movieId: z.number().optional(), // Optional movieId to update
        reviewer: z.string().optional(), // Optional reviewer name
        rating: z.number().min(0).max(10).optional(), // Optional rating with a range (e.g., 0-10)
        comments: z.string().optional(), // Optional comments
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      // Validate that at least one field to update is provided
      if (
        input.movieId === undefined &&
        input.reviewer === undefined &&
        input.rating === undefined &&
        input.comments === undefined
      ) {
        throw new Error("At least one field must be provided to update.");
      }

      // Update the review
      return await prisma.review.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.movieId !== undefined && { movieId: input.movieId }),
          ...(input.reviewer !== undefined && { reviewer: input.reviewer }),
          ...(input.rating !== undefined && { rating: input.rating }),
          ...(input.comments !== undefined && { comments: input.comments }),
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
