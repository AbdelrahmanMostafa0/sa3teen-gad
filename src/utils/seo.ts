import { Metadata } from "next";

// Site-wide SEO configuration
export const SITE_CONFIG = {
  name: "ساعتين جد",
  nameEn: "Sa3teen Gad",
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
  descriptionEn:
    "Productivity app with Pomodoro timer, task management, and prayer times",
  url: "https://sa3teen-gad.vercel.app",
  ogImage: "/banners/readme-banner.png",
  locale: "ar_EG",
  localeAlternate: "en_US",
  keywords: [
    "ساعتين جد",
    "بومودورو",
    "إدارة المهام",
    "إنتاجية",
    "مؤقت",
    "pomodoro",
    "productivity",
    "task management",
    "timer",
    "prayer times",
    "أوقات الصلاة",
  ],
} as const;

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

/**
 * Generate comprehensive metadata for a page
 * @param options - Metadata configuration options
 * @returns Complete Next.js Metadata object
 */
export function generateMetadata(
  options: GenerateMetadataOptions = {},
): Metadata {
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    keywords = SITE_CONFIG.keywords,
    path = "",
    image = SITE_CONFIG.ogImage,
    noIndex = false,
    type = "website",
  } = options;

  const url = `${SITE_CONFIG.url}${path}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.nameEn}`,
        },
      ],
      locale: SITE_CONFIG.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Generate JSON-LD structured data for WebApplication
 * @returns Structured data object for JSON-LD script
 */
export function generateWebApplicationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.nameEn,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    inLanguage: ["ar", "en"],
    featureList: [
      "Pomodoro Timer",
      "Task Management",
      "Prayer Times Reminder",
      "Water Drinking Reminder",
    ],
  };
}

/**
 * Generate JSON-LD structured data for Organization
 * @returns Structured data object for JSON-LD script
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.nameEn,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/icons/icon-512x512.png`,
    sameAs: [],
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 * @param items - Array of breadcrumb items with name and url
 * @returns Structured data object for JSON-LD script
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
