"use client";

import ContributionSkyline from "@/components/ui/contribution-skyline";

export default function ContributionSkylineDemo() {
  return (
    <div className="h-full w-full overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto w-full max-w-[980px]">
        <ContributionSkyline endDate="2017-11-08" />
      </div>
    </div>
  );
}
