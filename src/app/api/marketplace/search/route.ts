import { NextRequest } from "next/server";
import { searchShopeePublic } from "@/lib/marketplace/shopee-public";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("q")?.trim();
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "30");

  if (!keyword) {
    return Response.json({ ok: false, error: "Informe ?q=produto" }, { status: 400 });
  }

  try {
    const result = await searchShopeePublic(keyword, Number.isFinite(limit) ? limit : 30);
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
