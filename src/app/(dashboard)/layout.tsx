import Navbar from "@/components/admin/layout/Navbar";
import Topbar from "@/components/admin/layout/Topbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col sm:flex-row bg-base-200 sm:h-lvh h-dvh relative">
      <Navbar />
      <div className="p-3 w-full sm:pl-[238px] xl:pl-[300px] flex flex-col gap-3 md:gap-5 pb-28 md:pb-0">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
