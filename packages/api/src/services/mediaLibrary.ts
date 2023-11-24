import { util } from "zod";

import { AppError } from "@our-trips/shared";

export class MediaLibrary {
  /**
   * @throws Will throw an error if the call to upstream API will fail.
   */
  public async fetchMediaItems(token: string) {
    try {
      let mediaItems: MediaItem[] = [];
      let hasNextPage = true;
      let nextPageToken = "";
      while (hasNextPage) {
        const result = await this.doFetch(token, nextPageToken);
        mediaItems = [...mediaItems, ...result.mediaItems];
        nextPageToken = result.nextPageToken ?? "";
        hasNextPage = !!result.nextPageToken;
      }

      const dateMap = new Map<string, MediaItem[]>();
      for (const mediaItem of mediaItems) {
        const creationTime = new Date(mediaItem.mediaMetadata.creationTime);
        const date = new Date(
          Date.UTC(
            creationTime.getUTCFullYear(),
            creationTime.getUTCMonth(),
            creationTime.getUTCDate(),
          ),
        ).toISOString();
        let dateList = dateMap.get(date);
        if (!dateList) {
          dateList = [];
          dateMap.set(date, dateList);
        }
        dateList.push(mediaItem);
      }

      const itemsByDate = Array.from(dateMap).map((item) => {
        return { date: item[0], mediaItems: item[1] } as MediaItemsByDate;
      });

      return itemsByDate;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get media items from Photos API`,
        cause: err,
      });
    }
  }

  public async downloadMediaItem(items: MediaItem[]) {
    for (const item of items) {
      const url = `${item.baseUrl}=d`;
      const response = await fetch(url);
      if (!response.ok) {
        throw await AppError.fromResponse(response);
      }

      const result = await response.blob();
      console.log("res", result);
      item.blob = result;
    }
  }

  /**
   * @throws Will throw an error if the HTTP call will fail.
   */
  private async doFetch(token: string, pageToken?: string) {
    const searchParams = {
      pageSize: 100,
      pageToken: pageToken,
      filters: {
        dateFilter: {
          ranges: [
            {
              startDate: {
                year: 2023,
                month: 6,
                day: 12,
              },
              endDate: {
                year: 2023,
                month: 6,
                day: 13,
              },
            },
          ],
        },
      },
    };

    console.log(searchParams);

    const host = "https://photoslibrary.googleapis.com";
    const url = `${host}/v1/mediaItems:search`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(searchParams),
    });
    if (!response.ok) {
      throw await AppError.fromResponse(response);
    }

    const result = (await response.json()) as MediaItemResult;
    return result;
  }
}

export interface MediaItemsByDate {
  date: string;
  mediaItems: MediaItem[];
}

export interface MediaItemErrorResult {
  error: Error;
}

export interface Error {
  code: number;
  message: string;
  status: string;
}

export interface MediaItemResult {
  mediaItems: MediaItem[];
  nextPageToken?: string;
}

export interface MediaItem {
  id: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: MediaMetadata;
  filename: string;
  blob: Blob;
}

export interface MediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo: Photo;
  video: Video;
}

export interface Photo {
  cameraMake: string;
  cameraModel: string;
  focalLength: number;
  apertureFNumber: number;
  isoEquivalent: number;
  exposureTime: string;
}

export interface Video {
  fps: number;
  status: string;
}
