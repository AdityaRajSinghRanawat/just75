import { formatCalendarDisplay, toTitleCase } from "./adminPageUtils";

export default function HolidaysSection({
  holidays,
  onAddHoliday,
  onEditHoliday,
  onDeleteHoliday,
}) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Official Holidays (All Semesters)
        </h2>
        <button
          onClick={onAddHoliday}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
        >
          <span>+</span> Add Holiday
        </button>
      </div>

      {holidays.length === 0 ? (
        <div className="text-slate-500 p-4 bg-slate-50 rounded-lg text-sm md:text-base">
          No official holidays yet.
        </div>
      ) : (
        <div className="space-y-3">
          {holidays.map((h) => (
            <div
              key={h._id}
              className="flex items-start justify-between gap-3 p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm md:text-base">
                  {toTitleCase(h.name)}
                </div>
                <div className="text-xs md:text-sm text-slate-600 mt-1">
                  {formatCalendarDisplay(h.startDate)} to{" "}
                  {formatCalendarDisplay(h.endDate)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditHoliday(h)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-blue-50 rounded transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteHoliday(h._id)}
                  className="text-red-600 hover:text-red-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
