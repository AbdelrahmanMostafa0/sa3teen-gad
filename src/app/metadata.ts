import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ساعتين جد",
  metadataBase: new URL("https://sa3teen-gad.vercel.app"),
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
  openGraph: {
    title: "ساعتين جد",
    description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
    images: [
      {
        url: "https://sa3teen-gad.vercel.app/banners/readme-banner.png",
        width: 1200,
        height: 630,
        alt: "ساعتين جد - Pomodoro Timer & Prayer Times",
      },
    ],
    locale: "ar_EG",
    type: "website",
    url: "https://sa3teen-gad.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "ساعتين جد",
    description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
    images: ["https://sa3teen-gad.vercel.app/banners/readme-banner.png"],
  },
};
