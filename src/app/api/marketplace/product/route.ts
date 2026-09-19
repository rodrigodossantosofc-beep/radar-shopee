import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get("itemId");
  const shopId = request.nextUrl.searchParams.get("shopId");

  if (!itemId || !shopId) {
    return Response.json({ ok: false, error: "Informe itemId e shopId" }, { status: 400 });
  }

  const url = new URL("https://shopee.com.br/api/v4/item/get");
  url.searchParams.set("itemid", itemId);
  url.searchParams.set("shopid", shopId);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "accept-language": "pt-BR,pt;q=0.9",
        "user-agent": "Mozilla/5.0 RadarShopee/0.1",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) throw new Error(`Shopee product returned HTTP ${response.status}`);
    const body = await response.json();

    return Response.json({
      ok: true,
      collectedAt: new Date().toISOString(),
      source: "shopee-public",
      data: body?.data ?? null,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha desconhecida",
      },
      { status: 502 }
    );
  }
}
