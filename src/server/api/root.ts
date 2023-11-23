import { postRouter } from "~/server/api/routers/post";
import { formRouter } from "~/server/api/routers/formsRouter";
import { createTRPCRouter } from "~/server/api/trpc";
import "@uploadthing/solid/styles.css";
 

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  form: formRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
