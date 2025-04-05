"use client";

import { useDropzone } from "react-dropzone";
import {  useState } from "react";
import readCSVFile from "@/utils/readCSVFile";
import { UploadIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UploadedFile from "@/components/UploadedFile";

export const UploadCsvFile = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Handle file selection & start progress
  const onDrop = (acceptedFiles: File[]) => {
    const validCsvFiles = acceptedFiles.filter(
      (file) => file.name.endsWith(".csv") && file.type === "text/csv"
    );

    if (validCsvFiles.length === 0) {
      alert("Invalid file type. Please upload CSV files only.");
      return;
    }

    validCsvFiles.forEach((file) => simulateUpload(file));
  };

  const simulateUpload = (file: File) => {
    setSelectedFiles((prev) => [...prev, file]);
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles((prev) => [...prev, file]);
      }
    }, 200);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setUploadedFiles([]);
  };

  const handleSave = () => {
    uploadedFiles.forEach((file) => {
      readCSVFile(file); // Parse all at once
    });
    alert("Files parsed!");
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadProgress((prev) => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: true,
    onDrop,
  });

  return (
    <ShowcaseSection title="Upload your CSV files" className="!p-7">
      <div
        {...getRootProps()}
        className="relative dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary mb-5 flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-gray-300 bg-gray-100 hover:border-[#5750F1] cursor-pointer p-4"
      >
        <input {...getInputProps()} />
        <div className="flex dark:border-dark-3 dark:bg-gray-dark size-14 items-center justify-center rounded-full border border-gray-300 bg-white">
          <UploadIcon />
        </div>
        <p className="mt-2 text-sm font-medium">
          <span className="text-[#5750F1]">Click to upload</span> or drag & drop CSV files
        </p>
        <p className="text-xs text-gray-500 mt-1">Only .csv files are accepted. Multiple supported.</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {selectedFiles.map((file) => (
            <UploadedFile
              key={file.name}
              message={file.name}
              size={file.size}
              progress={uploadProgress[file.name] || 0}
              onClose={() => handleRemoveFile(file.name)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="rounded-lg border border-gray-400 px-6 py-2 text-sm font-medium text-gray-800 hover:shadow dark:border-dark-3 dark:text-white"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="button"
          className={`rounded-lg px-6 py-2 text-sm font-medium text-white bg-[#5750F1] hover:bg-opacity-90 transition ${
            uploadedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={uploadedFiles.length === 0}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </ShowcaseSection>
  );
};
