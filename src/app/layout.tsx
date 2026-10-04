import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import PageTransition from "@/components/PageTransition";

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
      <head>
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1107628541760237');
          fbq('track', 'PageView');
        `}} />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1107628541760237&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Skip to main content
          </a>
          <PageTransition />
          <AnnouncementBanner />
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
