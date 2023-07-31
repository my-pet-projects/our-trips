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
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {result?.mediaItems?.map((item) => (
          <div key={item.id}>
            {item.id}
            <img src={item.baseUrl} alt={item.id} />
          </div>
        ))}
      </main>
    </>
  );
}
