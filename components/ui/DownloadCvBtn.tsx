/**
 * A client-side component that renders download buttons for CV files.
 *
 * @component
 * @example
 * ```tsx
 * <DownloadCVBtn />
 * ```
 *
 * @remarks
 * This component displays two download buttons for different CV versions:
 * - Standard CV (Maria_Sidorova_CV.pdf)
 * - Figma version CV (CV.pdf)
 *
 * The download is triggered programmatically by creating a temporary anchor element.
 * Both files will be downloaded with the unified filename "Maria_Sidorova_CV.pdf".
 *
 * @returns A flex container with download buttons styled with gradient backgrounds and hover effects
 */
"use client";

import { File } from "lucide-react";
const files = [
  {
    label: "Download CV",
    file: "Maria_Sidorova_CV.pdf",
  },
  {
    label: "Download CV (figma)",
    file: "CV.pdf",
  },
];
const DownloadCVBtn = () => {
  const downloadFile = (fileName: string) => {
    const link = document.createElement("a");
    link.href = fileName;
    link.download = "Maria_Sidorova_CV.pdf"; // unified desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex w-full items-center justify-center gap-4">
      {files.map((item) => (
        <button
          key={item.label}
          onClick={() => downloadFile(item.file)}
          className="download-cv-btn inline-block mb-4 rounded-xl bg-linear-to-r from-primary/20 to-secondary/20 p-3 shadow-fg/50 transition-all hover:from-primary/40 hover:to-secondary/40 hover:shadow-[3px_3px_0px]"
        >
          <div className="flex items-center gap-2">
            <File size={24} className="text-primary" />
            <span className="text-sm font-medium uppercase tracking-wider">{item.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DownloadCVBtn;
