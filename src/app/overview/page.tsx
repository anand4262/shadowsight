import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";

const Overview = () => {

    return (
        <>
            <Suspense fallback={<OverviewCardsSkeleton />}>
                <OverviewCardsGroup />
            </Suspense>
        </>
    )
}

export default Overview