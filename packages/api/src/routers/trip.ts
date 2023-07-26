import { TRPCError } from "@trpc/server";

import { AppError, getStatusCodeFromError } from "@our-trips/shared";
import logger from "@our-trips/shared/logger";

import { MediaLibrary } from "../services/mediaLibrary";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tripRouter = createTRPCRouter({
  fetchMedia: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No authorization token",
      });
    }

    const library = new MediaLibrary();
    try {
      return await library.fetchMediaItems(ctx.session.user.token);
    } catch (err) {
      logger.error(err, "Failed to get media items from Photos API");
      if (err instanceof AppError) {
        if (getStatusCodeFromError(err) === 401) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized to get media items from Photos API",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get media items from Photos API",
      });
    }
  }),
});
