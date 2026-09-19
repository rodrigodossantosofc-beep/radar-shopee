export type MarketplaceProduct = {
  itemId: string;
  shopId: string;
  name: string;
  price: number | null;
  priceBeforeDiscount: number | null;
  discountPct: number | null;
  sales: number | null;
  rating: number | null;
  reviewCount: number | null;
  stock: number | null;
  imageUrl: string | null;
  productUrl: string;
  isOfficial: boolean | null;
  source: "shopee-public";
};

export type MarketplaceSearchResult = {
  keyword: string;
  collectedAt: string;
  products: MarketplaceProduct[];
  warnings: string[];
};
