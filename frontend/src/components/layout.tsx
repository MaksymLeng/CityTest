import { Outlet, NavLink } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from '@/assets/kosice.png';
import ThemeButton from "@/components/theme-button.tsx";

export default function Layout() {
    return (
        <div className="flex min-h-screen overflow-x-hidden bg-background text-foreground">
            <aside className="lg:w-64 w-52 border-r bg-red-100/70 dark:bg-zinc-900/50 dark:border-zinc-800 flex flex-col transition-colors duration-300">
                <div className="p-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                        <img src={logo} alt="Logo" className="h-7 w-7" />
                    </div>
                    <span className="font-bold text-lg">Test city</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink
                        to="/announcements"
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-yellow-50 text-gray-900 dark:bg-yellow-500/10 dark:text-yellow-500"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                            )
                        }
                    >
                        <Megaphone className="h-5 w-5" />
                        Announcements
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b dark:border-zinc-800 flex items-center justify-end px-8 bg-background sticky top-0 z-40 transition-colors duration-300">
                    <ThemeButton />
                </header>

                <div className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}