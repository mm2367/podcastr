import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConvexClerkProvider from "./Providers/ConvexClerkProvider";
import AudioProvider from "@/app/Providers/audioProvider";
import {Manrope} from "next/font/google";

const manrope=Manrope({subsets:['latin']})
export const metadata: Metadata = {
    title: "Podcastr",
    description: "Generate Your Podcast using AI",
    icons: {
        icon: '/icons/logo.svg'
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexClerkProvider>
        <html lang="en">
        <AudioProvider>
            <body
                className={`${manrope.className} antialiased`}
            >
            {children}
            </body>
        </AudioProvider>
        </html>
        </ConvexClerkProvider>
    );
}
