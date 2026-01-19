import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "Talha Rizwan | Full Stack Developer & Remote Operative",
  description: "Building digital ecosystems from a cabin in the clouds. Remote operations, high-altitude code, and pixel-perfect signal transmission. Full Stack Developer specializing in React, Next.js, and modern web technologies.",
  keywords: "Talha Rizwan, Full Stack Developer, Remote Developer, React Developer, Next.js, Web Development, UI/UX Design, Software Engineer, Pakistan Developer",
  authors: [{ name: "Talha Rizwan" }],
  creator: "Talha Rizwan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talha-weld.vercel.app",
    title: "Talha Rizwan | Full Stack Developer & Remote Operative",
    description: "Building digital ecosystems from a cabin in the clouds. Remote operations, high-altitude code, and pixel-perfect signal transmission.",
    siteName: "Talha Rizwan Portfolio",
    images: [
      {
        url: "/global/logo.png",
        width: 1200,
        height: 630,
        alt: "Talha Rizwan - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Rizwan | Full Stack Developer & Remote Operative",
    description: "Building digital ecosystems from a cabin in the clouds. Remote operations, high-altitude code, and pixel-perfect signal transmission.",
    images: ["/global/logo.png"],
  },
  robots: {
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/global/site-icon.png", sizes: "any" }
    ],
    shortcut: "/favicon.svg",
    apple: "/global/site-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body suppressHydrationWarning>
        <PageTransition>
          <Nav />
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
