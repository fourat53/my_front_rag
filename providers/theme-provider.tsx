"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { JSX } from "react";

export type ThemesType = {
  mode: string;
  icon: JSX.Element;
  label?: string;
};

export const themes: ThemesType[] = [
  { mode: "light", icon: <IconSun />, label: "Light" },
  { mode: "dark", icon: <IconMoon />, label: "Dark" },
  { mode: "system", icon: <IconDeviceDesktop />, label: "System" },
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
