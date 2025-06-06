"use client"
import {Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { useRouter } from "next/navigation";
import { useTotalCSVRecordCount, useFlatCSVData } from "@/utils/GlobalHelpers";
import { evaluateRisk } from "@/utils/riskrules";
import { SuggestionCard } from "@/components/suggestioncard";
import { enhanceWithML } from "@/utils/enhanceWithMLHelps";

const Overview = () => {
    const router = useRouter();
    const CSVRecords = useFlatCSVData();
    const records = enhanceWithML(CSVRecords); 
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
            <div className="col-span-12 mt-8">
              <h2 className="text-xl font-semibold mb-4">Smart Risk Suggestions (Rule + ML)</h2>
              {records.slice(0, 10).map((record: any, idx: number) => {
                const riskScore = record.riskScore ?? record.riskscore ?? 0;
                const integration = record.integration ?? "unknown";
                const mlComment = record.mlComment ?? "";
                const suggestion = evaluateRisk({ riskScore, integration });
            
                return suggestion ? (
                  <SuggestionCard
                    key={idx}
                    suggestion={suggestion}
                    recordMeta={{
                      user: record.user,
                      activityId: record.activityId,
                      date: record.date,
                      mlComment: mlComment, // ✅ Optional ML insight
                    }}
                  />
                ) : null;
              })}
            </div>
        </>
    )
}

export default Overview