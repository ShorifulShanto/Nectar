
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Olipop Odyssey',
  description: 'A modern functional soda brand inspired by classic flavors with healthier ingredients',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-black text-white selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
