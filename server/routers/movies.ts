import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const moviesRouter = router({
  getAll: publicProcedure.query(async () => {
    const movies = await prisma.movie.findMany({
      include: {
        // For calculating the average rating of reviews for each movie
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculating the average rating for each movie
    return movies.map((movie) => {
      const avgRating =
        movie.reviews.length > 0
          ? movie.reviews.reduce((acc, review) => acc + review.rating, 0) /
            movie.reviews.length
          : null; // If there are no reviews, avgRating is null

      return {
        ...movie,
        avgRating,
      };
    });
  }),

  create: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          releaseDate: z.string(),
          avgRating: z.number().optional(),
        })
        .refine(
          (data) => {
            try {
              const parsedDate = new Date(data.releaseDate);
              return !isNaN(parsedDate.getTime());
            } catch {
              return false;
            }
          },
          { message: "Invalid date format" }
        )
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const releaseDate = new Date(input.releaseDate);

      return await prisma.movie.create({
        data: {
          name: input.name,
          releaseDate,
          avgRating: input.avgRating,
        },
      });
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      return await prisma.movie.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        releaseDate: z
          .string()
          .optional()
          .refine(
            (data) => {
              const parsedDate = new Date(data);
              return !isNaN(parsedDate.getTime());
            },
            { message: "Invalid date format" }
          ),
        avgRating: z.number().optional(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      const updateData: any = {};

      if (input.name) {
        updateData.name = input.name;
      }
      if (input.releaseDate) {
        updateData.releaseDate = new Date(input.releaseDate);
      }
      if (input.avgRating !== undefined) {
        updateData.avgRating = input.avgRating;
      }

      return await prisma.movie.update({
        where: {
          id: input.id,
        },
        data: updateData,
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
      await prisma.movie.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
