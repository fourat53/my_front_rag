"use client";

import { useEffect, useState } from "react";
import { themes, ThemesType } from "@/providers/theme-provider";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function ThemeSwitch({
  labeled,
  className,
}: {
  labeled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "z-50 flex items-center gap-1 rounded-full border p-1 bg-card",
        labeled && "w-full grid grid-cols-3 px-2",
        className,
      )}
    >
      {themes.map((t: ThemesType) => (
        <ThemeButton key={t.mode} t={t} labeled={labeled} />
      ))}
    </div>
  );
}

function ThemeButton({ t, labeled }: { t: ThemesType; labeled?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <Button
      variant="outline"
      icon={t.icon}
      className={cn(
        "rounded-full p-1 size-8",
        mounted &&
          theme === t.mode &&
          "bg-accent hover:bg-accent border-2 text-white hover:text-white",
        labeled && "w-full flex items-center gap-2",
      )}
      onClick={() => setTheme(t.mode)}
    >
      {labeled && <span>{t.label}</span>}
    </Button>
  );
}
