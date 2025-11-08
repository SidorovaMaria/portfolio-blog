"use client";
import { File } from "lucide-react";

const DownloadCVBtn = () => {
  const cvFileUrlDocx = "CV.docx"; // Replace with the actual URL of your CV
  const cvFileUrlPDF = "CV.pdf"; // Replace with the actual URL of your CV
  //  file
  // Replace with your desired CV filename
  const cvFileNameDocx = "Maria_Sidorova_CV.docx";
  const cvFileNamePDF = "Maria_Sidorova_CV.pdf";

  const handleDownloadDocx = () => {
    const link = document.createElement("a");
    link.href = cvFileUrlDocx;
    link.download = cvFileNameDocx;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = cvFileUrlPDF;
    link.download = cvFileNamePDF;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className=" flex gap-4 w-full items-center justify-center">
      <div
        role="button"
        onClick={handleDownloadDocx}
        className="inline-block download-cv-btn mb-4 p-3 rounded-xl bg-linear-to-r from-primary/20 to-secondary/20 hover:from-primary/40 hover:to-secondary/40 cursor-pointer  hover:shadow-[3px_3px_0px] shadow-fg/50 transition-all"
      >
        <div className="flex items-center gap-2 ">
          <File size={24} className="text-primary" />
          <span className="text-sm font-medium tracking-wider uppercase">Download CV (docx)</span>
        </div>
      </div>
      <div
        role="button"
        onClick={handleDownloadPDF}
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
