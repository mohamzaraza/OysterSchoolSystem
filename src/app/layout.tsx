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
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
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
