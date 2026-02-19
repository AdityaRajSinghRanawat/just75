import {
  calculateInclusiveDays,
  formatCalendarDisplay,
  toTitleCase,
} from "./studentPageUtils";

export default function OfficialHolidaysSection({
  holidays,
  onEditHoliday,
  onRemoveHoliday,
}) {
  return (
    <div className="border-t pt-8">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Official Holidays ({holidays.length})
      </h2>
      <div className="space-y-3">
        {holidays.map((h) => {
          const days = calculateInclusiveDays(h.startDate, h.endDate);
          return (
            <div
              key={h._id}
              className="flex items-start justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900">
                  {toTitleCase(h.name)}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {formatCalendarDisplay(h.startDate)} to{" "}
                  {formatCalendarDisplay(h.endDate)}
                </div>
                <div className="text-xs font-medium text-blue-700 mt-1">
                  {days}-day{days !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onEditHoliday(h)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-100 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemoveHoliday(h._id)}
                  className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
