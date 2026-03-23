import "./globals.css";
import BiometricGuard from "@/components/BiometricGuard";

export const metadata = {
  title: "Mobile Auth Frontend",
  description: "A Capacitor-ready Next.js Authentication App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BiometricGuard>
          {children}
        </BiometricGuard>
      </body>
    </html>
  );
}
