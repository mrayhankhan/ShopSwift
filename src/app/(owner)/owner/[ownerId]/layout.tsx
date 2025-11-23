'use client';

import AppHeader from "@/components/app-header";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Package, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { UserRole } from "@/lib/types";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const ownerId = params.ownerId as string;
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <AppHeader userId={ownerId} userRole={UserRole.ShopOwner} />
        <div className="flex flex-1">
          <Sidebar className="top-16 h-[calc(100vh-4rem)]">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/owner/${ownerId}`}
                  >
                    <Link href={`/owner/${ownerId}`}>
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(`/owner/${ownerId}/items`)}
                  >
                    <Link href={`/owner/${ownerId}/items`}>
                      <Package />
                      Manage Items
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(`/owner/${ownerId}/settings`)}
                  >
                    <Link href={`/owner/${ownerId}/settings`}>
                      <Settings />
                      Shop Settings
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-grow p-4 md:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
