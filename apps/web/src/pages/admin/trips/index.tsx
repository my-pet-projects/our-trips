import Head from "next/head";

import { api } from "@/utils/api";

export default function Page() {
  const { data: result, error } = api.trip.fetchMedia.useQuery();
  const { data: trips, error: tripError } = api.trip.all.useQuery();

  console.log(result, error);
  console.log(trips, tripError);

  return (
    <>
      <Head>
        <title>Trips catalog</title>
      </Head>
      <main className="">
        <div className="container mx-auto px-5 py-2 lg:pt-12">
          <div>
            {result?.map((date, idx) => (
              <div key={idx}>
                <div>{date.date}</div>
                <div className="-m-1 flex flex-wrap md:-m-2">
                  {date.mediaItems.map((item) => (
                    <div key={item.id} className="flex flex-wrap">
                      <div className="relative p-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={item.id}
                          className="block h-full max-h-52 rounded-lg object-cover object-center"
                          src={item.baseUrl}
                        />
                        {/* <video width="80%" controls>
                  <source src={`${item.baseUrl}=dv`} type="video/mp4" />
                </video> */}
                        <div className="absolute bottom-1 left-1 right-1 rounded-b-lg bg-gray-800 p-1 px-4 py-2 opacity-70">
                          <p className="text-sm text-gray-300">
                            {item.mediaMetadata.creationTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
