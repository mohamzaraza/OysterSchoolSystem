import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oyster School System",
  description:
    "Equipping every learner with modern, in-demand skills for a better future. Two campuses in PWD, Islamabad.",
  keywords: "Oyster School System, PWD school, Islamabad school, Pakistan education",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
