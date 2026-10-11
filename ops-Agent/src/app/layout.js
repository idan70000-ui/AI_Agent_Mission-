export const metadata = {
  title: 'סוכן חקירת תקלות',
  description: 'The Barrel — מערכת ניטור שירות',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ margin: 0, background: '#0f0d0a' }}>{children}</body>
    </html>
  );
}
