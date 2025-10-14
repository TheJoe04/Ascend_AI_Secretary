"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";
import { AscendLogo } from "@/components/logo/ascend-logo";
import { 
  LayoutDashboard, 
  Phone, 
  MessageSquare, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calls', href: '/calls', icon: Phone },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <div className={cn(
      "relative flex h-full flex-col bg-card border-r transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b">
        <AscendLogo 
          size={sidebarCollapsed ? "sm" : "md"}
          showText={!sidebarCollapsed}
          className="text-primary"
        />
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-16 z-10 h-6 w-6 rounded-full border bg-background"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      {!sidebarCollapsed && (
        <div className="border-t p-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              System Status
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Twilio</span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600">Connected</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">OpenAI</span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-600">Connected</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ElevenLabs</span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-red-600">Disconnected</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

