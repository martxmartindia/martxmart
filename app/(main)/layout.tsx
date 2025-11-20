import EnhancedNavbar from "@/components/layout/EnhancedNavbar"
import Footer from "@/components/layout/footer"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { ChatProvider } from "@/components/chat/ChatProvider"
import NewsletterSignup from "@/components/NewsletterSignup";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
return (
      <div suppressHydrationWarning={true}>
        <ChatProvider>
            <EnhancedNavbar />
            <main className="flex-1">{children}</main>
            <ChatWidget />
            <NewsletterSignup />
            <Footer />
        </ChatProvider>
      </div>
  );
}
