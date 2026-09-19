import { shopeeAffiliateRequest } from "@/lib/shopee";

export async function GET() {
  try {
    const query = `
      query {
        productOfferV2(limit: 5) {
          nodes {
            itemId
            productName
            price
            sales
            ratingStar
            shopId
            shopName
            productLink
            imageUrl
          }
        }
      }
    `;

    const data = await shopeeAffiliateRequest(query);
    return Response.json({ ok: true, data });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
