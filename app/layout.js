import './globals.css'

export const metadata = {
  title: 'Smart Bookmark App',
  description: 'Save and organize your bookmarks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}