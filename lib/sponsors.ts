import { SITE_URL, SITE_X_URL } from "@/lib/site";

export type SponsorTierId = "diamond" | "gold" | "silver";

export type SponsorTier = {
  id: SponsorTierId;
  name: string;
  price: number;
  perks: string[];
  checkoutUrl: string;
  featured?: boolean;
};

export type SponsorBrand = {
  name: string;
  href: string;
  lightSrc: string;
  darkSrc: string;
  logoHeight: string;
};

export type Sponsor = SponsorBrand & { tier: SponsorTierId };

export type PlatformSponsor = SponsorBrand & { role: string };

export const TIERS_HREF = "/sponsors#tiers";

export const SPONSOR_X_URL = SITE_X_URL;

export const SPONSOR_CONTACT_EMAIL = "sahilmk01@gmail.com";

// fallbacks for when the databuddy key is absent, as in local dev and forks
export const MONTHLY_PAGEVIEWS = "N/A";

export const TOTAL_PAGEVIEWS = "N/A";

// dodo does not echo the product back on the return url, so the tier is carried on redirect_url
function checkoutUrl(productId: string, tier: SponsorTierId) {
  if (!productId)
    return `mailto:${SPONSOR_CONTACT_EMAIL}?subject=${encodeURIComponent(`${tier} sponsorship`)}`;
  const redirect = `${SITE_URL}/sponsors/thank-you?tier=${tier}`;
  return `https://checkout.dodopayments.com/buy/${productId}?quantity=1&redirect_url=${encodeURIComponent(redirect)}`;
}

export const TIERS: SponsorTier[] = [
  {
    id: "diamond",
    name: "Diamond",
    price: 150,
    featured: true,
    checkoutUrl: checkoutUrl("", "diamond"),
    perks: [
      "Largest logo on the sponsors page",
      "Largest logo on the home page",
      "Largest logo in the README",
      "Shoutout on X",
      "Direct line for feedback and requests",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 100,
    checkoutUrl: checkoutUrl("", "gold"),
    perks: [
      "Larger logo on the sponsors page",
      "Logo on the home page",
      "Larger logo in the README",
      "Shoutout on X",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 50,
    checkoutUrl: checkoutUrl("", "silver"),
    perks: ["Logo in the README", "Listed on the sponsors page"],
  },
];

export const SPONSORS: Sponsor[] = [];

export const PLATFORM_TIER_NAME = "Platform Sponsors";

export const PLATFORM_TIER_BLURB =
  "Products that back Mox UI through their open-source programs.";

export const PLATFORM_CARD_HEIGHT = "h-24 sm:h-32";

export const PLATFORM_CARD_WIDTH = "sm:w-[calc((100%-2rem)/3)]";

export const PLATFORM_SPONSORS: PlatformSponsor[] = [];

export const TIER_CARD_HEIGHT: Record<SponsorTierId, string> = {
  diamond: "h-32 sm:h-44",
  gold: "h-24 sm:h-32",
  silver: "h-20 sm:h-24",
};

export const TIER_CARD_WIDTH: Record<SponsorTierId, string> = {
  diamond: "sm:w-[calc((100%-1rem)/2)]",
  gold: "sm:w-[calc((100%-2rem)/3)]",
  silver: "sm:w-[calc((100%-3rem)/4)]",
};

export function sponsorsByTier(tier: SponsorTierId) {
  return SPONSORS.filter((sponsor) => sponsor.tier === tier);
}

export function tierById(tier: SponsorTierId) {
  return TIERS.find((entry) => entry.id === tier)!;
}

export function tierByParam(value?: string | string[]) {
  if (typeof value !== "string") return undefined;
  return TIERS.find((tier) => tier.id === value);
}

export const SPONSOR_ASSET_CHECKLIST = [
  {
    title: "Your logo",
    detail:
      "SVG is best. If you only have a PNG, send it at 2x on a transparent background, at least 512px wide.",
  },
  {
    title: "A light and a dark version",
    detail:
      "The site runs in both themes. If you only have one version, send it anyway and we will make it work.",
  },
  {
    title: "The link destination",
    detail:
      "The exact URL your logo should point to, including any UTM tags you want on it.",
  },
  {
    title: "Your name as it should appear",
    detail:
      "Company or product name, spelled and capitalised the way you want it read.",
  },
  {
    title: "Your X and LinkedIn handles",
    detail: "For the shoutout post, on Diamond and Gold tiers.",
  },
];
