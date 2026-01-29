import Script from 'next/script'
import './globals.css'
import './styles/index.scss'

// https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/apple-touch-icon.png"
      ></link>
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/favicon-32x32.png"
      ></link>
      <link rel="icon" type="image/svg" href="/static/favicon.svg"></link>
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/favicon-16x16.png"
      ></link>
      <link rel="manifest" href="/static/site.webmanifest"></link>
      <link
        rel="mask-icon"
        href="/static/safari-pinned-tab.svg"
        color="#00c88c"
      ></link>
      <meta name="msapplication-TileColor" content="#ffffff"></meta>
      <meta name="theme-color" content="#ffffff"></meta>
      <title>LoginSign</title>
      <meta name="title" content="LoginSign" />
      <meta
        name="description"
        content="LoginSign allows you to log in to web applications and provides security by sharing anonymous login information while keeping your online privacy."
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://LoginSign.com" />
      <meta property="og:title" content="LoginSign" />
      <meta property="og:description" content="LoginSign." />
      <meta property="og:image" content="/static/banner.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://LoginSign.com" />
      <meta property="twitter:title" content="LoginSign" />
      <meta property="twitter:description" content="LoginSign." />
      <meta property="twitter:image" content="/static/banner.png" />

      <body>{children}</body>
    </html>
  )
}
