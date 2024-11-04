import { FaEllipsisV } from "react-icons/fa";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalenderContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4">
      <EventCalendar />

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-3">Events</h1>
        <FaEllipsisV className=" text-black cursor-pointer" size={13} />
      </div>

      <div className="flex flex-col gap-2">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalenderContainer;
