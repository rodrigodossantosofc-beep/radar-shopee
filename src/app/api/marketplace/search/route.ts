import { searchShopeePublic } from "@/lib/marketplace/shopee-public";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q")?.trim();
  const requestedLimit = Number(searchParams.get("limit") ?? "30");
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 30;

  if (!keyword) {
    return Response.json({ ok: false, error: "Informe ?q=produto" }, { status: 400 });
  }

  try {
    const result = await searchShopeePublic(keyword, limit);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha desconhecida",
        note: "Endpoints públicos da Shopee podem aplicar bloqueios e mudar sem aviso. O Radar preserva essa falha em vez de fabricar dados.",
      },
      { status: 502 }
    );
  }
}
