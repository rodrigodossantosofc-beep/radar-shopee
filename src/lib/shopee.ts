import crypto from "crypto";

const endpoint =
  process.env.SHOPEE_AFFILIATE_ENDPOINT ||
  "https://open-api.affiliate.shopee.com.br/graphql";

export async function shopeeAffiliateRequest<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const appId = process.env.SHOPEE_AFFILIATE_APP_ID;
  const secret = process.env.SHOPEE_AFFILIATE_SECRET;

  if (!appId || !secret) {
    throw new Error("Shopee Affiliate credentials are not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = JSON.stringify({ query, variables });
  const signatureBase = appId + timestamp + payload;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signatureBase)
    .digest("hex");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`,
    },
    body: payload,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopee API error: ${response.status}`);
  }

  const body = await response.json();

  if (body.errors?.length) {
    throw new Error(body.errors.map((e: { message?: string }) => e.message).join("; "));
  }

  return body.data as T;
}
