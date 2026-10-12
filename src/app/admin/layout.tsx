import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Back-office Afroza Editor",
    template: "%s — Back-office Afroza Editor",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans text-[15px] leading-[1.5] text-bo-ink">
      {children}
      <Toaster theme="light" position="bottom-right" richColors closeButton />
    </div>
  );
}
