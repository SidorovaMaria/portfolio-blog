"use client";
import { File } from "lucide-react";

const DownloadCVBtn = () => {
  const cvFileUrlPlain = "Maria_Sidorova_CV.pdf";
  const cvFileUrlFigma = "CV.pdf";
  const cvFileNamePlain = "Maria_Sidorova_CV.pdf";
  const cvFileNameFigma = "Maria_Sidorova_CV.pdf";

  const handleDownloadPlain = () => {
    const link = document.createElement("a");
    link.href = cvFileUrlPlain;
    link.download = cvFileNamePlain;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownloadFigma = () => {
    const link = document.createElement("a");
    link.href = cvFileUrlFigma;
    link.download = cvFileNameFigma;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className=" flex gap-4 w-full items-center justify-center">
      <div
        role="button"
        onClick={handleDownloadPlain}
        className="inline-block download-cv-btn mb-4 p-3 rounded-xl bg-linear-to-r from-primary/20 to-secondary/20 hover:from-primary/40 hover:to-secondary/40 cursor-pointer  hover:shadow-[3px_3px_0px] shadow-fg/50 transition-all"
      >
        <div className="flex items-center gap-2 ">
          <File size={24} className="text-primary" />
          <span className="text-sm font-medium tracking-wider uppercase">Download CV </span>
        </div>
      </div>
      <div
        role="button"
        onClick={handleDownloadFigma}
        className="inline-block download-cv-btn mb-4 p-3 rounded-xl bg-linear-to-r from-primary/20 to-secondary/20 hover:from-primary/40 hover:to-secondary/40 cursor-pointer  hover:shadow-[3px_3px_0px] shadow-fg/50 transition-all"
      >
        <div className="flex items-center gap-2 ">
          <File size={24} className="text-primary" />
          <span className="text-sm font-medium tracking-wider uppercase">Download CV (figma) </span>
        </div>
      </div>
    </div>
  );
};

export default DownloadCVBtn;
