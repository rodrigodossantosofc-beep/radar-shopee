import type { MarketplaceProduct, MarketplaceSearchResult } from "./types";

const BASE = "https://shopee.com.br";

function money(value: unknown): number | null {
  return typeof value === "number" ? value / 100000 : null;
}

function integer(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : null;
}

function normalize(raw: unknown): MarketplaceProduct | null {
  const source = raw as Record<string, any>;
  const item = source?.item_basic ?? source?.item_card?.item ?? source;
  if (!item?.itemid || !item?.shopid || !item?.name) return null;

  const ratingCount = item?.item_rating?.rating_count;
  const reviews = Array.isArray(ratingCount)
    ? ratingCount.reduce((sum: number, n: unknown) => sum + (typeof n === "number" ? n : 0), 0)
    : null;

  const sold =
    integer(item?.historical_sold) ??
    integer(item?.sold) ??
    integer(item?.sold_count);

  return {
    itemId: String(item.itemid),
    shopId: String(item.shopid),
    name: String(item.name),
    price: money(item.price),
    priceBeforeDiscount: money(item.price_before_discount),
    discountPct: integer(item.raw_discount),
    sales: sold,
    rating: typeof item?.item_rating?.rating_star === "number" ? item.item_rating.rating_star : null,
    reviewCount: reviews,
    stock: integer(item.stock),
    imageUrl: item.image ? `https://down-br.img.susercontent.com/file/${item.image}` : null,
    productUrl: `${BASE}/product/${item.shopid}/${item.itemid}`,
    isOfficial: typeof item.is_official_shop === "boolean" ? item.is_official_shop : null,
    source: "shopee-public",
  };
}

export async function searchShopeePublic(
  keyword: string,
  limit = 30
): Promise<MarketplaceSearchResult> {
  const safeLimit = Math.min(Math.max(limit, 1), 60);
  const url = new URL(`${BASE}/api/v4/search/search_items`);
  url.searchParams.set("by", "relevancy");
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("newest", "0");
  url.searchParams.set("order", "desc");
  url.searchParams.set("page_type", "search");
  url.searchParams.set("scenario", "PAGE_GLOBAL_SEARCH");
  url.searchParams.set("version", "2");

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "accept-language": "pt-BR,pt;q=0.9",
      "user-agent": "Mozilla/5.0 RadarShopee/0.1",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Shopee public search returned HTTP ${response.status}`);
  }

  const body = await response.json();
  const rows = Array.isArray(body?.items) ? body.items : [];
  const products = rows.map(normalize).filter(Boolean) as MarketplaceProduct[];

  const warnings: string[] = [];
  if (products.length === 0) warnings.push("A Shopee não retornou produtos nesta chamada.");
  if (products.some((p) => p.sales == null)) {
    warnings.push("Quantidade vendida não é garantida pela busca pública; campos ausentes permanecem nulos.");
  }

  return {
    keyword,
    collectedAt: new Date().toISOString(),
    products,
    warnings,
  };
}
