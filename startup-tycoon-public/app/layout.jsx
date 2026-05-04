import './globals.css'

export const metadata = {
  title: 'Startup Tycoon Public',
  description: 'Page publique SSR/SSG pour Startup Tycoon',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
