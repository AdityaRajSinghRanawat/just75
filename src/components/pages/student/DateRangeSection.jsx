import {
  formatDateInput,
  normalizeCalendarDate,
} from "./studentPageUtils";

export default function DateRangeSection({
  semesters,
  semesterId,
  startDate,
  endDate,
  onEndDateChange,
}) {
  const semester = semesters.find((s) => s._id === semesterId);
  const today = normalizeCalendarDate(startDate);
  const mid1DateFormatted = formatDateInput(semester?.mid1Date);
  const mid2DateFormatted = formatDateInput(semester?.mid2Date);
  const mid1Valid =
    mid1DateFormatted && normalizeCalendarDate(mid1DateFormatted) >= today;
  const mid2Valid =
    mid2DateFormatted && normalizeCalendarDate(mid2DateFormatted) >= today;

  return (
    <div className="border-t pt-8">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Date Range
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-600"
            type="date"
            value={startDate}
            disabled
          />
          <p className="text-xs text-slate-500 mt-1">Today's date (read-only)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            End Date <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full px-4 py-3 border border-slate-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            onFocus={(e) => e.target.showPicker?.()}
          />
          <p className="text-xs text-slate-500 mt-1">
            End date is excluded from the calculation window.
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => mid1DateFormatted && onEndDateChange(mid1DateFormatted)}
              disabled={!mid1Valid}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                mid1Valid
                  ? endDate === mid1DateFormatted
                    ? "bg-blue-600 text-white cursor-pointer"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 border border-gray-300 line-through cursor-not-allowed"
              }`}
            >
              Mid 1
            </button>

            <button
              onClick={() => mid2DateFormatted && onEndDateChange(mid2DateFormatted)}
              disabled={!mid2Valid}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                mid2Valid
                  ? endDate === mid2DateFormatted
                    ? "bg-blue-600 text-white cursor-pointer"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 border border-gray-300 line-through cursor-not-allowed"
              }`}
            >
              Mid 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
