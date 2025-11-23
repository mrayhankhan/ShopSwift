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
import Link from 'next/link';
import { ReactNode } from 'react';
import { users } from '@/lib/data';
import { redirect } from 'next/navigation';
import { Home, Package, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    <Settings />
                      Shop Settings
                    </Link >
                  </SidebarMenuButton >
                </SidebarMenuItem >
              </SidebarMenu >
            </SidebarContent >
          </Sidebar >
    <SidebarInset>
      <main className="flex-grow p-4 md:p-6">{children}</main>
    </SidebarInset>
        </div >
      </div >
    </SidebarProvider >
  );
}
