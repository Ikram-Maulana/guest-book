import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { redis } from "@/server/redis";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const cachedGuestbook = await redis.lrange("guestbook", 0, -1);

    if (cachedGuestbook.length > 0) {
      return Promise.all(
        cachedGuestbook.map((id) => redis.json.get(`guestbook:${id}`)),
      );
    }

    const guestBook = await prisma.message.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    await Promise.all([
      ...guestBook.map((message) =>
        redis.lpush("guestbook", message.id.toString()),
      ),
      ...guestBook.map((message) =>
        redis.json.set(`guestbook:${message.id}`, "$", message),
      ),
    ]);

    return guestBook;
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

      await Promise.all([
        redis.lpush("guestbook", newGuetsBook.id),
        redis.json.set(`guestbook:${newGuetsBook.id}`, "$", newGuetsBook),
      ]);

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

      await Promise.all([
        redis.lrem("guestbook", 0, input.id.toString()),
        redis.json.del(`guestbook:${input.id}`),
      ]);

      return deletedGuestbook;
    }),

  revalidate: publicProcedure.query(async () => {
    const cachedGuestbook = await redis.lrange("guestbook", 0, -1);

    await Promise.all([
      cachedGuestbook.map((id) => redis.json.del(`guestbook:${id}`)),
      redis.del("guestbook"),
    ]);

    const guestBook = await prisma.message.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await Promise.all([
      ...guestBook.map((message) =>
        redis.lpush("guestbook", message.id.toString()),
      ),
      ...guestBook.map((message) =>
        redis.json.set(`guestbook:${message.id}`, "$", message),
      ),
    ]);

    return "Guestbook successfully revalidated!";
  }),
});
