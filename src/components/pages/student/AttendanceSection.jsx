export default function AttendanceSection({
  showTopBorder = true,
  currentPresent,
  currentTotal,
  desiredPercent,
  onPresentChange,
  onTotalChange,
  onDesiredPercentChange,
}) {
  return (
    <div className={showTopBorder ? "border-t pt-8" : ""}>
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Your Attendance
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Total{" "}
            <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Present
            </span>{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            type="number"
            min="0"
            placeholder="e.g. 45"
            value={currentPresent}
            onChange={(e) => onPresentChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Total{" "}
            <span className="bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Lectures
            </span>{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            type="number"
            min="0"
            placeholder="e.g. 60"
            value={currentTotal}
            onChange={(e) => onTotalChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Attendance % <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 75"
            value={desiredPercent}
            onChange={(e) => onDesiredPercentChange(e.target.value)}
          />
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[75, 70, 65, 60].map((p) => (
              <button
                key={p}
                onClick={() => onDesiredPercentChange(String(p))}
                className={`py-1.5 rounded-lg font-semibold text-sm transition-all ${
                  Number(desiredPercent) === p
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
