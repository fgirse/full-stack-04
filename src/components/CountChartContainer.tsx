import Image from "next/image";
import { Prisma } from "@prisma/client";

import CountChart from "./CountChart";

// Update the import path below if your prisma client is located elsewhere, e.g. "../../lib/prisma"
import prisma  from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  }) as Prisma.StudentGroupByOutputType[];

  // TypeScript now knows about the 'sex' property
  const maleStudent = data.find((d) => d.sex === "MALE");
  const boys = maleStudent?._count?._all ?? 0;

  const femaleStudent = data.find((d) => d.sex === "FEMALE");
  const girls = femaleStudent?._count?._all ?? 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <CountChart boys={boys} girls={girls} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-plSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((boys / (boys + girls)) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-plYellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((girls / (boys + girls)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;