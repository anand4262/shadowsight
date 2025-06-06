"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import {
  addUploadedFile,
  updateProgress,
  removeUploadedFile,
  clearAllUploadedFiles,
} from "@/store/slices/uploadSlice";
import {
  setCsvData,
  setProcessedData,
  setLoading,
   removeCsvDataForFile,
  setError,
  resetState,
} from "@/store/slices/CSVSlice";
import { processData } from "@/utils/GlobalHelpers";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UploadedFile from "@/components/UploadedFile";
import { UploadIcon } from "@/assets/icons";
import readCSVFile from "@/utils/readCSVFile";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { sanitizeDataAsync } from "@/utils/SanitizeData";
import { Alert } from "@/components/ui-elements/alert";

type AlertState = {
  variant: "error" | "success" | "warning";
  title: string;
  description: string;
} | null;

export const UploadCsvFile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const uploadedFiles = useSelector(
    (state: RootState) => state.uploads.uploadedFiles
  );
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [alert, setAlert] = useState<AlertState>(null);
  const isUploading = uploadedFiles.some(
    (file) => file.uploadProgress < 100
  );

  const validateFile = (file: File): boolean => {
    const isCSV = file.name.endsWith(".csv") && file.type === "text/csv";
    const isValidSize = file.size <= 10 * 1024 * 1024;

    if (!isCSV) {
      setAlert({
        variant: "error",
        title: "Invalid File Type",
        description: "Only CSV files are allowed.",
      });
      return false;
    } else if (!isValidSize) {
      setAlert({
        variant: "error",
        title: "File Too Large",
        description: "Maximum allowed size is 10MB.",
      });
      return false;
    }
    return true;
  };

  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      dispatch(updateProgress({ fileName: file.name, progress }));

      if (progress >= 100) {
        clearInterval(interval);
        dispatch(updateProgress({ fileName: file.name, progress: 100 }));
      }
    }, 200);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const existingFileNames = uploadedFiles.map((f) => f.fileName);
    const remainingSlots = 5 - uploadedFiles.length;

    if (remainingSlots <= 0) {
      setAlert({
        variant: "error",
        title: "Upload Limit Reached",
        description: "You can only upload up to 5 CSV files.",
      });
      return;
    }

    const validCsvFiles: File[] = [];
    const skippedDuplicates: string[] = [];

    for (const file of acceptedFiles) {
      if (existingFileNames.includes(file.name)) {
        skippedDuplicates.push(file.name);
        continue;
      }

      if (validateFile(file)) {
        validCsvFiles.push(file);
      }

      if (validCsvFiles.length >= remainingSlots) break;
    }

    if (skippedDuplicates.length > 0) {
      setAlert({
        variant: "error",
        title: "Duplicate File(s)",
        description: `Already uploaded: ${skippedDuplicates.join(", ")}`,
      });
    }

    if (
      validCsvFiles.length < acceptedFiles.length - skippedDuplicates.length
    ) {
      setAlert({
        variant: "warning",
        title: "Some Files Skipped",
        description: `Only ${remainingSlots} more file(s) allowed.`,
      });
    }

    validCsvFiles.forEach((file) => {
      dispatch(
        addUploadedFile({
          fileName: file.name,
          fileSize: file.size,
          uploadProgress: 0,
          status: "pending",
        })
      );
      setFileObjects((prevFiles) => [...prevFiles, file]);
      simulateUpload(file);
    });
  };

  const parseCSVFile = async (file: File) => {
  try {
    const parsedData = await readCSVFile(file);
    const sanitizedData = await sanitizeDataAsync(parsedData);

    // Dispatch with the new payload shape: fileName + records
    dispatch(setCsvData({ fileName: file.name, records: sanitizedData }));

    const processedData = processData(parsedData);
    dispatch(setProcessedData(processedData));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(setError("Error parsing CSV: " + error.message));
    } else {
      dispatch(setError("Unknown error during CSV parsing"));
    }
  }
};


  const handleSave = async () => {
    dispatch(setLoading(true));

    try {
      for (const uploaded of uploadedFiles) {
        if (uploaded.uploadProgress === 100) {
          const file = fileObjects.find((f) => f.name === uploaded.fileName);
          if (file) {
            await parseCSVFile(file);
            setAlert({
              variant: "success",
              title: "Upload Successful",
              description: `file has been uploaded and processed.`,
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClear = () => {
    dispatch(clearAllUploadedFiles());
    dispatch(resetState());
    setFileObjects([]);
  };


   const handleRemoveFile = (fileName: string) => {
    dispatch(removeUploadedFile(fileName)); 
    dispatch(removeCsvDataForFile({ fileName }));
    setFileObjects((prev) => prev.filter((file) => file.name !== fileName));
  };

  const retryUpload = (fileName: string) => {
    const file = fileObjects.find((f) => f.name === fileName);
    if (file) {
      dispatch(updateProgress({ fileName, progress: 0 }));
      simulateUpload(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: true,
    onDrop,
  });

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2500);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return (
    <ShowcaseSection title="Upload your CSV files" className="!p-7">
      {alert && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          description={alert.description}
          className="mb-4"
        />
      )}
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
        <p className="text-xs text-gray-500 mt-1">
          Only .csv files allowed. Max 5 files, each up to 10MB.
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {uploadedFiles.map(({ fileName, fileSize, uploadProgress, status }) => (
            <UploadedFile
              key={fileName}
              message={fileName}
              size={fileSize}
              status={status}
              progress={uploadProgress}
              onClose={() => handleRemoveFile(fileName)}
              onRetry={() => retryUpload(fileName)}
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
            uploadedFiles.length === 0 || isUploading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={uploadedFiles.length === 0 || isUploading}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </ShowcaseSection>
  );
};
