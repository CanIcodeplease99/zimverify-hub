// ZimVerify Pricing Configuration
// All prices in USD — easy to update from a single location.

export interface CheckType {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  downloadable: boolean;
}

export interface Bundle {
  id: string;
  label: string;
  count: number;
  totalPrice: number;
  unitPrice: number;
}

export interface BusinessTier {
  id: string;
  name: string;
  volumeRange: string;
  platformFee: number | null; // null = no fee
  perReport: number;
  features: string[];
  highlight?: boolean;
}

// ── Public / Citizen ──────────────────────────────────────────────
export const checkTypes: CheckType[] = [
  {
    id: "quick",
    name: "Quick Check",
    price: 1.0,
    description: "Instant on-screen result — no downloadable report.",
    features: [
      "Basic identity (make / model / year)",
      "Licence status",
      "Simple risk flag (Clear / Needs review / Possible issue)",
    ],
    downloadable: false,
  },
  {
    id: "full",
    name: "Full Vehicle Report",
    price: 5.0,
    description: "CARFAX‑style detailed report you can download and keep.",
    features: [
      "Ownership history",
      "Title / licence history & flags",
      "Stolen / write-off / salvage alerts",
      "Service & inspection events",
      "Full chronological event timeline",
      "Downloadable & printable PDF",
      "Stored in your account history",
    ],
    downloadable: true,
  },
];

export const bundles: Bundle[] = [
  { id: "bundle-3", label: "3 Full Reports", count: 3, totalPrice: 12, unitPrice: 4.0 },
  { id: "bundle-5", label: "5 Full Reports", count: 5, totalPrice: 18, unitPrice: 3.6 },
];

// ── Business / Institutional ──────────────────────────────────────
export const businessTiers: BusinessTier[] = [
  {
    id: "small",
    name: "Small Business",
    volumeRange: "0 – 100 reports/mo",
    platformFee: null,
    perReport: 5,
    features: ["Web portal access", "Standard support", "Account dashboard"],
  },
  {
    id: "professional",
    name: "Professional",
    volumeRange: "101 – 1,000 reports/mo",
    platformFee: 49,
    perReport: 3,
    features: [
      "Portal + bulk upload",
      "Optional basic API key",
      "Priority support",
      "Usage analytics",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise / API",
    volumeRange: "1,001+ reports/mo",
    platformFee: 149,
    perReport: 1.5,
    features: [
      "Full API access",
      "Dedicated SLAs",
      "Account manager",
      "Custom analytics & reports",
      "Volume discounts available",
    ],
  },
];

// Helpers
export const formatUSD = (amount: number) =>
  amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
