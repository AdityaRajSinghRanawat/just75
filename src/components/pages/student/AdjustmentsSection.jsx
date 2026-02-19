import {
  calculateInclusiveDays,
  formatCalendarDisplay,
} from "./studentPageUtils";

function AdjustmentCard({ title, item, onEdit, onRemove, tone }) {
  const isHoliday = tone === "green";
  const days = calculateInclusiveDays(item.startDate, item.endDate);
  const dateStr = `${formatCalendarDisplay(item.startDate)} to ${formatCalendarDisplay(item.endDate)}`;
  const toneClass = isHoliday
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";

  return (
    <div className={`p-3 border rounded-lg ${toneClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-700">{title}</div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="text-sm text-slate-600 mb-1">{dateStr}</div>
      <div className="text-xs font-medium text-slate-500">
        {days}-day{days !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function AdjustmentsSection({
  extraHolidays,
  extraWorkingDays,
  onAdd,
  onEditHoliday,
  onEditWorkingDay,
  onRemoveHoliday,
  onRemoveWorkingDay,
}) {
  return (
    <div className="border-t pt-8">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Adjustments
      </h2>
      <button
        onClick={onAdd}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
      >
        <span className="text-lg">+</span> Add Extra Holidays or Working Days
      </button>

      {(extraHolidays.length > 0 || extraWorkingDays.length > 0) && (
        <div className="mt-4 space-y-2">
          {extraHolidays.map((item, i) => (
            <AdjustmentCard
              key={`h-${i}`}
              title="Extra Holiday"
              item={item}
              tone="green"
              onEdit={() => onEditHoliday(i, item)}
              onRemove={() => onRemoveHoliday(i)}
            />
          ))}
          {extraWorkingDays.map((item, i) => (
            <AdjustmentCard
              key={`w-${i}`}
              title="Extra Working Day"
              item={item}
              tone="red"
              onEdit={() => onEditWorkingDay(i, item)}
              onRemove={() => onRemoveWorkingDay(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
