import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiUrl =
    "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0/search";
  const apiKey = process.env.KEY_ID;

  //Route search pour récupérer toutes les entrées à la query prud'hommes avec comme juridiction le tj
  //https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0/search?query=prud%27hommes&jurisdiction=tj
  // ensuite il faut regarder si dans les "solutions" il y a une annulation, un rejet, un avis, une déchéance, une irrecevabilité, un non lieu etc

  try {
    const response = await fetch(
      `${apiUrl}?query=prud%27hommes&jurisdiction=tj`,
      {
        headers: {
          accept: "application/json",
          KeyId: `${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur API Judilibre");
    }

    const data = await response.json();
    //filtre des décisions où l'employeur a été condamné
    const condamnations = data.results.filter(
      (decision: any) =>
        decision.solution?.includes("Fait droit à une partie des demandes") ||
        (decision.highlights?.text &&
          decision.highlights.text.some((txt: string) =>
            /condamne|dommages et intérêts|indemnité|paiement de salaires/i.test(
              txt
            )
          ))
    );
    console.log(condamnations.length)
    return NextResponse.json(condamnations);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
