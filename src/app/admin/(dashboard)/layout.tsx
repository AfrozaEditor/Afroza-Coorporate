import Sidebar from "@/components/admin/Sidebar";
import { requireEditorPage } from "@/lib/auth";
import { countNewsForAdmin } from "@/lib/news/queries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const editor = await requireEditorPage();
  const newsCount = await countNewsForAdmin();

  return (
    <div className="flex min-h-screen flex-wrap bg-bo-bg">
      <Sidebar fullName={editor.fullName} jobTitle={editor.jobTitle} newsCount={newsCount} />
      {children}
    </div>
  );
}
