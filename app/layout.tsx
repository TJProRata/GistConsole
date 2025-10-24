import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Header } from "@/components/Header";
import { DM_Serif_Text } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gist Widget Builder",
  description: "Chat widget management builder",
};

const dmSerifText = DM_Serif_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={dmSerifText.variable}>
        <body>
          <ConvexClientProvider>
            <Header />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
