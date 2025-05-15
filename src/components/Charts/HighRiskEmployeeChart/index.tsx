import {getHighRiskPolicyMatrix} from "@/utils/GlobalHelpers"
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { CSVRecord } from '@/store/types/CSVTypes';

import React from 'react'

const HighRiskEmployeeChart = () => {
    const uploadedFiles = useSelector((state: RootState) => state.csv.data) as CSVRecord[];
    const data = getHighRiskPolicyMatrix(uploadedFiles)
    //console.log("emp", data)
  return (
    <div>HighRiskEmployeeChart</div>
  )
}

export default HighRiskEmployeeChart