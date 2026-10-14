import './globals.css';

export const metadata = {
  title: 'Monitoring Tindak Lanjut Temuan APIP',
  description: 'Prototipe sistem monitoring tindak lanjut temuan hasil pengawasan APIP (Inspektorat).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
