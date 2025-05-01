"use client";

import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import { addUploadedFile, updateProgress, removeFile, clearAllUploadedFiles } from "@/store/slice/uploadSlice";
import { setCsvData, setProcessedData, setLoading, setError, resetState } from "@/store/slice/CSVSlice";
import { processData } from "@/utils/GlobalHelpers";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UploadedFile from "@/components/UploadedFile";
import { UploadIcon } from "@/assets/icons";
import readCSVFile from "@/utils/readCSVFile";  // Assuming this function handles CSV parsing

export const UploadCsvFile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const uploadedFiles = useSelector((state: RootState) => state.uploads.uploadedFiles);

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
      // Store file metadata in Redux without parsing or simulating upload progress yet
      dispatch(addUploadedFile({ file, uploadProgress: 0, status: "pending" }));
    });
  };

  // Simulate file upload progress (or actual file upload if needed)
  const simulateUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      dispatch(updateProgress({ fileName: file.name, progress }));

      if (progress >= 100) {
        clearInterval(interval); // Stop progress simulation when 100% is reached
        dispatch(updateProgress({ fileName: file.name, progress: 100 }));
      }
    }, 200); // Adjust the speed of progress simulation as needed
  };

  // Parse CSV data after upload completes (on Save button click)
  const parseCSVFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      readCSVFile(file)
        .then((parsedData) => {
          dispatch(setCsvData(parsedData)); // Store parsed CSV data in Redux
          const processedData = processData(parsedData); // Process parsed data if necessary
          dispatch(setProcessedData(processedData)); // Store processed data in Redux
          resolve();
        })
        .catch((error) => {
          dispatch(setError("Error during CSV parsing: " + error.message));
          reject(error);
        });
    });
  };

  // Handle Save: Parse CSV and process data when the user clicks Save
  const handleSave = () => {
    dispatch(setLoading(true));

    // Loop through the uploaded files and trigger parsing only when the upload is complete
    const uploadPromises = uploadedFiles.map((uploaded) => {
      const file = uploaded.file;

      // Simulate the file upload progress (or use actual upload API logic)
      simulateUpload(file);

      // Return a Promise that resolves once the file is fully uploaded and parsed
      return new Promise<void>((resolve, reject) => {
        if (uploaded.uploadProgress === 100) {
          parseCSVFile(file)
            .then(() => resolve()) // Parsing is done, resolve the promise
            .catch((error) => reject(error)); // If parsing fails, reject the promise
        } else {
          reject("Upload not completed");
        }
      });
    });

    // Once all files are processed, handle the final state change
    Promise.all(uploadPromises)
      .then(() => {
        dispatch(setLoading(false));  // End loading state after process finishes
      })
      .catch((error) => {
        dispatch(setError(error)); // Handle errors during parsing
        dispatch(setLoading(false));  // End loading state on error
      });
  };

  // Handle Clear: Reset all uploaded files and parsed data
  const handleClear = () => {
    dispatch(clearAllUploadedFiles()); // Clears the uploaded files from Redux
    dispatch(resetState()); // Reset other data like processed data
  };

  // Handle File Removal: Remove individual files from Redux state
  const handleRemoveFile = (fileName: string) => {
    dispatch(removeFile(fileName)); // Removes the specific file from Redux state
  };

  // Set up the dropzone for file drag-and-drop or manual upload
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
        <p className="text-xs text-gray-500 mt-1">Only .csv files are accepted. Maximum 5 files, each up to 10MB.</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {uploadedFiles.map(({ file, uploadProgress }) => (
            <UploadedFile
              key={file.name}
              message={file.name}
              size={file.size}
              progress={uploadProgress}
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
