import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      let { limit } = input;
      limit ??= 2;
      const { cursor } = input;

      const guestBook = await prisma.message.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (guestBook.length > limit) {
        const nextItem = guestBook.pop();
        nextCursor = nextItem!.id;
      }

      return {
        data: guestBook,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newGuetsBook = await prisma.message.create({
        data: {
          content: input.message,
          authorId: ctx.session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return newGuetsBook;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedGuestbook = await prisma.message.delete({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      return deletedGuestbook;
    }),
});
