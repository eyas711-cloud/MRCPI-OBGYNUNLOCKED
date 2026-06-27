import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "MRCPI-OBGYN Unlocked — Expert OSCE Preparation",
    template: "%s | MRCPI-OBGYN Unlocked",
  },
  description:
    "Expert-led MRCPI Obstetrics & Gynaecology OSCE preparation. Structured video courses, live mock examinations, and personalised feedback from Dr. Einas Diab.",
  keywords: [
    "MRCPI OSCE",
    "MRCPI OBGYN",
    "Obstetrics OSCE preparation",
    "Gynaecology OSCE",
    "OSCE mock exam",
    "RCPI Part 2 OSCE",
    "O&G OSCE preparation",
    "Dr Einas Diab",
  ],
  openGraph: {
    title: "MRCPI-OBGYN Unlocked",
    description:
      "Pass the MRCPI OBGYN OSCE with confidence. Expert-led preparation by Dr. Einas Diab.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
