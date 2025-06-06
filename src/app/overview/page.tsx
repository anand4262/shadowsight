"use client"
import {Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { useRouter } from "next/navigation";
import { useTotalCSVRecordCount, useFlatCSVData } from "@/utils/GlobalHelpers";

const Overview = () => {
    const router = useRouter();
    const CSVRecords = useFlatCSVData();
     const totalRecords = useTotalCSVRecordCount();
     const [isClientReady, setIsClientReady] = useState(false);
        useEffect(() => {
            if (totalRecords === 0) {
            router.replace("/upload");
            } else {
            setIsClientReady(true);
            }
        }, [CSVRecords, router]);

        if (!isClientReady) return null;
    return (
        <>
            <Suspense fallback={<OverviewCardsSkeleton />}>
                <OverviewCardsGroup />
            </Suspense>
        </>
    )
}

export default Overview