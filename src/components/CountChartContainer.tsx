import prisma from "@/lib/prisma";
import Image from "next/image";
import CountChart from "./CountChart";

const CountChartContainer = async () => {
  try {
    type GroupedStudent = {
      sex: string;
      _count: {
        _all: number;
      };
    };

    const data = await prisma.student.groupBy({
      by: ["sex"],
      _count: {
        _all: true, // Be explicit about what we're counting
      },
    }) as GroupedStudent[];

    const boys = data.find((d) => d.sex === "MALE")?._count._all || 0;
    const girls = data.find((d) => d.sex === "FEMALE")?._count._all || 0;
    const total = boys + girls;

    return (
      <div className="bg-white rounded-xl w-full h-full p-4">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Students</h1>
          <Image src="/moreDark.png" alt="More options" width={20} height={20} />
        </div>
        
        {/* CHART */}
        <CountChart boys={boys} girls={girls} />
        
        {/* BOTTOM */}
        <div className="flex justify-center gap-16">
          <div className="flex flex-col gap-1">
            <div className="w-5 h-5 bg-plSky rounded-full" />
            <h1 className="font-bold">{boys}</h1>
            <h2 className="text-xs text-gray-300">
              Boys ({total > 0 ? Math.round((boys / total) * 100) : 0}%)
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-5 h-5 bg-plYellow rounded-full" />
            <h1 className="font-bold">{girls}</h1>
            <h2 className="text-xs text-gray-300">
              Girls ({total > 0 ? Math.round((girls / total) * 100) : 0}%)
            </h2>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    return (
      <div className="bg-white rounded-xl w-full h-full p-4">
        <p className="text-red-500 text-center">Error loading student data</p>
      </div>
    );
  }
};

export default CountChartContainer;
