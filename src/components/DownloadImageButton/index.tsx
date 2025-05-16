// components/DownloadImageButton.tsx
"use client";

import { RefObject } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui-elements/button";

interface DownloadImageButtonProps {
  targetRef: RefObject<HTMLElement | null>; // ✅ FIXED type here
  filename?: string;
  label?: string;
}

const DownloadImageButton: React.FC<DownloadImageButtonProps> = ({
  targetRef,
  filename = "downloaded-dashboard.png",
  label = "Download Dashboard Image",
}) => {
  const handleDownload = async () => {
    if (targetRef.current) {
      const canvas = await html2canvas(targetRef.current, {
        useCORS: true,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <Button
      label={label}
      variant="dark"
      size="default"
      shape="rounded"
      onClick={handleDownload}
    />
  );
};

export default DownloadImageButton;
