import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "Threads",
  description:
    "Connect and engage through seamless, threaded conversations in our dynamic community platform.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
