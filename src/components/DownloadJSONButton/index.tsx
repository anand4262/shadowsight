import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { Button } from "@/components/ui-elements/button";

const DownloadJSONButton: React.FC = () => {
  const jsonData = useSelector((state: RootState) => state.csv.data);

  const handleDownload = () => {
    if (!jsonData || jsonData.length === 0) return;

    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sanitized_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (

    <Button
        onClick={handleDownload}
        label="Download Data"
        variant="primary"
        size="default"
        shape="rounded"
    />
  );
};

export default DownloadJSONButton;
