"use client";

import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { useTheme } from "next-themes";

export default function App() {
  const { theme } = useTheme();
  return (
    <div className="px-8 pb-8 mt-28 min-h-[calc(100vh-7rem)]">
      <div className="max-h-80vh overflow-y-auto">
        <PDFViewer
          config={{
            src: "/demo.docx",
            theme: {
              preference: theme,
              light: {
                accent: {
                  primary: "orange",
                  primaryHover: "orange",
                  primaryActive: "orange",
                  primaryLight: "gray",
                  primaryForeground: "white",
                },
                background: {
                  app: "white",
                  surface: "white",
                  surfaceAlt: "white",
                  elevated: "white",
                  overlay: "white",
                  input: "white",
                },
                foreground: {
                  primary: "#1C1917",
                  secondary: "#1C1917",
                  muted: "#1C1917",
                  disabled: "#1C1917",
                  onAccent: "#1C1917",
                },
                interactive: {
                  hover: "gray",
                  active: "gray",
                  selected: "gray",
                  focus: "gray",
                },
              },
              dark: {
                accent: {
                  primary: "orange",
                  primaryHover: "orange",
                  primaryActive: "orange",
                  primaryLight: "orange",
                  primaryForeground: "white",
                },
                background: {
                  app: "#1C1917",
                  surface: "#1C1917",
                  surfaceAlt: "#1C1917",
                  elevated: "#1C1917",
                  overlay: "#1C1917",
                  input: "#1C1917",
                },
                foreground: {
                  primary: "white",
                  secondary: "white",
                  muted: "white",
                  disabled: "white",
                  onAccent: "white",
                },
                interactive: {
                  hover: "gray",
                  active: "gray",
                  selected: "gray",
                  focus: "gray",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
