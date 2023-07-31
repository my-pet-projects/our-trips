import { util } from "zod";

import { AppError } from "@our-trips/shared";

export class MediaLibrary {
  /**
   * @throws Will throw an error if the call to upstream API will fail.
   */
  public async fetchMediaItems(token: string) {
    try {
      return await this.doFetch(token);
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
  private async doFetch(token: string) {
    const searchParams = {
      pageSize: 10,
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
  nextPageToken: string;
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
  creationTime: Date;
  width: string;
  height: string;
  photo: Photo;
}

export interface Photo {
  cameraMake: string;
  cameraModel: string;
  focalLength: number;
  apertureFNumber: number;
  isoEquivalent: number;
  exposureTime: string;
}
