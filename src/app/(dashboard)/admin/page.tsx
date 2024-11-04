import Announcement from "@/components/Announcement";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";
import FinanceChart from "@/components/FinanceChart";
import UsersCard from "@/components/UsersCard";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="flex gap-4 flex-col md:flex-row ">
      <div className=" w-2/3 mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 justify-between">
          <UsersCard type="admin" />
          <UsersCard type="student" />
          <UsersCard type="teacher" />
          <UsersCard type="parent" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-1/3 h-[420px]">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-2/3 h-[420px]">
            <AttendanceChartContainer />
          </div>
        </div>
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      <div className=" w-1/3 flex flex-col gap-4">
        <EventCalenderContainer searchParams={searchParams} />
        <Announcement />
      </div>
    </div>
  );
};

export default AdminPage;
