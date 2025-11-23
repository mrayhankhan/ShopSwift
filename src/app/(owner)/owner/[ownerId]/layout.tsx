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
import { Package, LayoutDashboard, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

        {/* Mobile Header */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white shadow-md border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold text-primary">Shop Portal</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/owner/${ownerId}`} className="flex items-center gap-3 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/owner/${ownerId}/items`} className="flex items-center gap-3 cursor-pointer">
                    <Package className="h-4 w-4" />
                    <span>Manage Items</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/owner/${ownerId}/settings`} className="flex items-center gap-3 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Shop Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-3 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-1 pt-0 md:pt-0">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden md:block top-16 h-[calc(100vh-4rem)]">
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
            <main className="flex-grow p-4 md:p-6 mt-20 md:mt-0">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
