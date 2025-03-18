import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url);
  const KeyId = process.env.KEY_ID;

  //   const company = searchParams.get('company');

  //   if (!company) {
  //     return NextResponse.json({ error: 'Missing company parameter' }, { status: 400 });
  //   }

  try {
    const response = await fetch(
      "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0/stats",
      {
        headers: {
          accept: "application/json",
          KeyId: `${KeyId}`,
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log("API response", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
