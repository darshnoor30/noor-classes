import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "NOOR CLASSES | Personalized 1-on-1 Tuitions", description: "Premium 1-on-1 home tuitions in Mohali, Chandigarh & Tricity and live online tutoring worldwide." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
