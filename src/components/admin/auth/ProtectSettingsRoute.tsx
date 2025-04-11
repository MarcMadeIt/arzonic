// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { readUserSession } from "@/lib/auth/readUserSession";

// const ProtectSettingsRoute = ({ children }: { children: React.ReactNode }) => {
//   const pathname = usePathname();
//   const [accessDenied, setAccessDenied] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const session = await readUserSession();
//       if (session) {
//         if (pathname === "/admin/settings" && session.role === "editor") {
//           setAccessDenied(true);
//         }
//       } else {
//         setAccessDenied(true);
//       }
//       setLoading(false);
//     })();
//   }, [pathname]);

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen"></div>;
//   }

//   if (accessDenied) {
//     return (
//       <div className="flex items-center justify-center h-60 md:h-screen"></div>
//     );
//   }

//   return <>{children}</>;
// };

// export default ProtectSettingsRoute;
