import { Toaster } from "@ui"
import './global.css';

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <section>{children}</section> {/* Valid inside body */}
        <Toaster />
        {/* This Toaster component is used to display notifications */}
      </body>
    </html>
  )
}