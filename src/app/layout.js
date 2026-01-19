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
        url: "https://talha-weld.vercel.app/og-image.svg",
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
    images: ["https://talha-weld.vercel.app/og-image.svg"],
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
      { url: "/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/global/site-icon.png", sizes: "any" }
    ],
    shortcut: "/favicon-light.svg",
    apple: "/global/site-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f9f4eb" media="(prefers-color-scheme: light)" />
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
