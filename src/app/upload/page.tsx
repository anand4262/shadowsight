import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { PersonalInfoForm } from "./_components/personal-info";
import  {UploadCsvFile}  from "./_components/upload-csv"

export const metadata: Metadata = {
  title: "Uploads Page",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Uploads" />
       
      <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12">
      <UploadCsvFile />
        </div>
     
      </div>
    </div>
  );
};

