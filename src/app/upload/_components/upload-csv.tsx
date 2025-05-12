"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import { addUploadedFile, updateProgress, removeUploadedFile, clearAllUploadedFiles } from "@/store/slices/uploadSlice";
import { setCsvData, setProcessedData, setLoading, setError, resetState } from "@/store/slices/CSVSlice";
import { processData } from "@/utils/GlobalHelpers";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UploadedFile from "@/components/UploadedFile";
import { UploadIcon } from "@/assets/icons";
import readCSVFile from "@/utils/readCSVFile";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import {sanitizeDataAsync }from "@/utils/SanitizeData"

export const UploadCsvFile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const uploadedFiles = useSelector((state: RootState) => state.uploads.uploadedFiles);
  const [fileObjects, setFileObjects] = useState<File[]>([]);  // Store actual File objects temporarily

  // File validation (CSV and size check)
  const validateFile = (file: File): boolean => {
    const isCSV = file.name.endsWith(".csv") && file.type === "text/csv";
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10 MB

    if (!isCSV) {
      alert("Invalid file type. Please upload CSV files only.");
    } else if (!isValidSize) {
      alert("File is too large. Maximum allowed size is 10MB.");
    }
    return isCSV && isValidSize;
  };

  // Handle the file drop (or file select via click)
  const onDrop = (acceptedFiles: File[]) => {
    const validCsvFiles = acceptedFiles.filter((file) => validateFile(file));

    if (validCsvFiles.length === 0) return;

    validCsvFiles.forEach((file) => {
      // Store file metadata (name, size, progress) in Redux
      dispatch(addUploadedFile({ fileName: file.name, fileSize: file.size, uploadProgress: 0, status: "pending" }));

      // Temporarily store the File object in component state
      setFileObjects((prevFiles) => [...prevFiles, file]);

      // Start the upload progress (real-time progress update)
      simulateUpload(file);
    });
  };

  // Simulate file upload progress (this will update the progress bar)
  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      dispatch(updateProgress({ fileName: file.name, progress }));

      if (progress >= 100) {
        clearInterval(interval);
        dispatch(updateProgress({ fileName: file.name, progress: 100 }));
      }
    }, 200); // Adjust the speed of progress simulation as needed
  };

  // Parse CSV data after the upload is complete (on Save button click)
  const parseCSVFile = async (file: File) => {
    try {
      const parsedData = await readCSVFile(file);  // Pass the actual File object
      const sanitizedData = await sanitizeDataAsync(parsedData)
      
      dispatch(setCsvData(sanitizedData));  // Store parsed CSV data in Redux
      const processedData = processData(parsedData); // Process parsed data if necessary
      dispatch(setProcessedData(processedData)); // Store processed data in Redux
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(setError("Error during CSV parsing: " + error.message));
      } else {
        dispatch(setError("An unknown error occurred during CSV parsing"));
      }
    }
  };

  // Handle Save: Parse CSV and process data when the user clicks Save
  const handleSave = async () => {
    dispatch(setLoading(true));

    try {
      for (const uploaded of uploadedFiles) {
        const { fileName, uploadProgress } = uploaded;

        // Only parse if the upload progress reaches 100%
        if (uploadProgress === 100) {
          // Find the actual File object in state by matching fileName
          const file = fileObjects.find((f) => f.name === fileName);
          if (file) {
            await parseCSVFile(file);  // Only parse when progress is 100%
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      }
    } finally {
      dispatch(setLoading(false));  // End loading state after process finishes
    }
  };

  // Handle Clear: Reset all uploaded files and parsed data
  const handleClear = () => {
    dispatch(clearAllUploadedFiles()); // Clears the uploaded files from Redux
    dispatch(resetState());
    setFileObjects([]);  // Reset the local state of file objects
  };

  // Handle File Removal: Remove individual files from Redux state
  const handleRemoveFile = (fileName: string) => {
    dispatch(removeUploadedFile(fileName)); // Removes the specific file from Redux state
    setFileObjects((prev) => prev.filter((file) => file.name !== fileName)); // Remove from local state
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: true,
    onDrop,
  });

  return (
    <ShowcaseSection title="Upload your CSV files" className="!p-7">
      <div {...getRootProps()} className="relative dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary mb-5 flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-gray-300 bg-gray-100 hover:border-[#5750F1] cursor-pointer p-4">
        <input {...getInputProps()} />
        <div className="flex dark:border-dark-3 dark:bg-gray-dark size-14 items-center justify-center rounded-full border border-gray-300 bg-white">
          <UploadIcon />
        </div>
        <p className="mt-2 text-sm font-medium">
          <span className="text-[#5750F1]">Click to upload</span> or drag & drop CSV files
        </p>
        <p className="text-xs text-gray-500 mt-1">Only .csv files are accepted. Maximum 5 files, each up to 10MB.</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {uploadedFiles.map(({ fileName, fileSize, uploadProgress }) => (
            <UploadedFile key={fileName} message={fileName} size={fileSize} progress={uploadProgress} onClose={() => handleRemoveFile(fileName)} />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button type="button" className="rounded-lg border border-gray-400 px-6 py-2 text-sm font-medium text-gray-800 hover:shadow dark:border-dark-3 dark:text-white" onClick={handleClear}>
          Clear
        </button>
        <button type="button" className={`rounded-lg px-6 py-2 text-sm font-medium text-white bg-[#5750F1] hover:bg-opacity-90 transition ${uploadedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={uploadedFiles.length === 0} onClick={handleSave}>
          Save
        </button>
      </div>
    </ShowcaseSection>
  );
};
