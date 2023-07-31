import { TRPCError } from "@trpc/server";

import { tripDb } from "@our-trips/db";
import { AppError, getStatusCodeFromError } from "@our-trips/shared";
import logger from "@our-trips/shared/logger";

import type { MediaItemResult } from "../services/mediaLibrary";
import { MediaLibrary } from "../services/mediaLibrary";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tripRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.select().from(tripDb);
    } catch (err) {
      logger.error(err, "Failed to fetch trips");
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch trips",
      });
    }
  }),
  fetchMedia: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No authorization token",
      });
    }

    const library = new MediaLibrary();
    let mediaItemResult = {} as MediaItemResult;
    try {
      mediaItemResult = await library.fetchMediaItems(ctx.session.user.token);
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

    // try {
    //   await library.downloadMediaItem(mediaItemResult.mediaItems);
    // } catch (err) {
    //   logger.error(err, "Failed to download media items from Photos API");
    //   throw new TRPCError({
    //     code: "INTERNAL_SERVER_ERROR",
    //     message: "Failed to download media items from Photos API",
    //   });
    // }

    return mediaItemResult;
  }),
});
