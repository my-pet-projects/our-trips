import { exampleRouter } from "./routers/example";
import { tripRouter } from "./routers/trip";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  trip: tripRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
