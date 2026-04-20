"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LogOut,
  NotebookTabs,
  PackageSearch,
  Salad,
  Store,
  ShoppingBasket,
  ShoppingCart,
  WalletCards,
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { Button, Badge, Card, Select } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { LANGS } from "@/lib/i18n";

const navItems = [
  { href: "/reports", key: "reports", icon: FileText },
  { href: "/products", key: "products", icon: Store },
  { href: "/purchases", key: "purchases", icon: ShoppingCart },
  { href: "/sales", key: "sales", icon: NotebookTabs },
  { href: "/expenses", key: "expenses", icon: WalletCards },
  { href: "/stock", key: "stock", icon: PackageSearch },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const { session, signOut, resetDemoData, lang, setLang, t } = useApp();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(47,208,87,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(23,124,53,0.12),transparent_24%),linear-gradient(180deg,rgba(234,250,238,1),rgba(229,255,241,0.92))] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(47,208,87,0.12),transparent_25%),radial-gradient(circle_at_top_right,rgba(23,124,53,0.10),transparent_24%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.96))] dark:text-slate-50">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-dark-emerald-100/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:h-18 sm:px-4 lg:px-6">
          <Link href="/reports" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black-forest-700 text-white shadow-soft ring-4 ring-dark-emerald-100 dark:ring-black-forest-950 sm:h-10 sm:w-10">
              <Salad className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none sm:text-base">{t("appName")}</p>
              <p className="mt-1 hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">Live management workspace</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden w-24 sm:block">
              <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                {Object.entries(LANGS).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <Badge variant="success" className="hidden sm:inline-flex text-[11px]">
              {session?.username || "admin"}
            </Badge>
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={resetDemoData}>
              <ShoppingBasket className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("resetDemo")}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 gap-3 overflow-y-auto overflow-x-hidden overscroll-contain px-3 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-20 sm:px-4 sm:pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-24 lg:gap-6 lg:px-6 lg:pb-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className="sticky top-24 space-y-1.5 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition",
                    active
                      ? "bg-black-forest-700 text-white shadow-soft"
                      : "text-slate-600 hover:bg-dark-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(item.key)}
                </Link>
              );
            })}
          </Card>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-dark-emerald-100 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
        <div className="grid grid-flow-col auto-cols-fr gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition sm:text-[11px]",
                  active
                    ? "bg-black-forest-700 text-white"
                    : "text-slate-500 hover:bg-dark-emerald-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-none sm:text-[11px]">{t(item.key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
