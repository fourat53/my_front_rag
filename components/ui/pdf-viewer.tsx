import { PDFViewer } from "@embedpdf/react-pdf-viewer";
import { useTheme } from "next-themes";

export default function App() {
  const { theme } = useTheme();
  return (
    <div style={{ height: "100vh" }}>
      <PDFViewer
        config={{
          src: "https://snippet.embedpdf.com/ebook.pdf",
          theme: { preference: theme },
        }}
      />
    </div>
  );
}
