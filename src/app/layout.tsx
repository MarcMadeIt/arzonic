import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfitSans = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arzonic Agency",
  description: "Danish Modern Web Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo-arzonic.png" />
        {/* SLET DENNE UNDER, NÅR FÆRDIG, DET LUKKER FOR SEO  */}
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={outfitSans.className}>{children}</body>
    </html>
  );
}
