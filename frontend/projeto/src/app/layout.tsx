import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "E-Commerce App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
