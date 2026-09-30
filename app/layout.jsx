import './globals.css';

export const metadata = {
  title: 'Facebook',
  description: 'Facebook Clone built with Next.js and Supabase',
  icons: {
    icon: '/images/fb-logo.png',
    shortcut: '/images/fb-logo.png',
    apple: '/images/fb-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('fb_dark_mode') === 'true') {
                  document.documentElement.classList.add('dark-mode');
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="icon" type="image/png" href="/images/fb-logo.png" />
        <link rel="shortcut icon" href="/images/fb-logo.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
