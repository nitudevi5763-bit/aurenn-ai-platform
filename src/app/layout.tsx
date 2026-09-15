import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurenn AI — AI Intake & Lead Operations",
  description: "Client and admin dashboard for Aurenn AI's AI intake and lead operations platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
