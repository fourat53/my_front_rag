"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { MoonIcon, SunIcon, MonitorIcon } from "@phosphor-icons/react";
import { JSX } from "react";

export type ThemesType = {
  mode: string;
  icon: JSX.Element;
  label?: string;
};

export const themes: ThemesType[] = [
  { mode: "light", icon: <SunIcon />, label: "Light" },
  { mode: "dark", icon: <MoonIcon />, label: "Dark" },
  { mode: "system", icon: <MonitorIcon />, label: "System" },
];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
