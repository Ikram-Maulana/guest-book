import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const messageRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          content: input.message,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
