"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Moon, Sun } from "lucide-react";

const ThemeButton = () => {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="p-2 font-medium text-sm cursor-pointer mb-[2px]"
                >
                    <Sun className="w-5 h-5 mr-2" />
                    <span className="mr-2">Light</span>
                    {theme === "light" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="p-2 font-medium text-sm cursor-pointer mb-[2px]"
                >
                    <Moon className="w-5 h-5 mr-2" />
                    <span className="mr-2">Dark</span>
                    {theme === "dark" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="p-2 font-medium text-sm cursor-pointer mb-[2px]"
                >
                    <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold">A</span>
                    <span className="mr-2">System</span>
                    {theme === "system" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeButton;
