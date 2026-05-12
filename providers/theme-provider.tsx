"use client";

import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react";
import { JSX } from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export type ThemesType = {
  mode: string;
  icon: JSX.Element;
};

export const themes: ThemesType[] = [
  { mode: "light", icon: <IconSun /> },
  { mode: "dark", icon: <IconMoon /> },
  { mode: "system", icon: <IconDeviceDesktop /> },
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
