export const metadata = {
  title: "WL Pass",
  description: "Check if a wallet holds a WL Pass",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif", color: "#0B0B0C", background: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
