'use client'
import { useSelector } from 'react-redux'; 
import { RootState } from "@/store/Store";



import React from 'react'

const page = () => {
    const CSVRecords = useSelector((state: RootState) => state);
    console.log( CSVRecords)
  return (
    <div>page</div>
  )
}

export default page