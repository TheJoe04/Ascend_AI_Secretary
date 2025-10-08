"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Monitor,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { globalSearchQuery, setGlobalSearchQuery, notifications } = useAppStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Search */}
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calls, messages, leads..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-md border bg-popover p-1 shadow-md">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@company.com</p>
              </div>
              <div className="py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

