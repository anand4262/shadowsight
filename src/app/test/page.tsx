'use client'
import { useSelector } from 'react-redux'; 
import { RootState } from "@/store/Store";
import {EmailDomainChart} from "@/components/Charts/EmailDomains"
import { ActivityOverviewChart } from '@/components/Charts/ActivityOverviewChart';

import React from 'react'

const page = () => {
    const CSVRecords = useSelector((state: RootState) => state.csv.data);
    console.log( CSVRecords)
  return (
    <div>
      <div className="mb-5">
        <EmailDomainChart />
      </div>
      <ActivityOverviewChart />
    </div>
  )
}

export default page