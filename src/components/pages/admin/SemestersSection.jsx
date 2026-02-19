function SemesterMidDates({ semester }) {
  if (!semester.mid1Date && !semester.mid2Date) return null;

  return (
    <div className="text-xs md:text-sm text-slate-600 mt-1">
      {semester.mid1Date && semester.mid2Date && (
        <>
          <span className="text-blue-600 font-medium">Mid 1:</span>{" "}
          {new Date(semester.mid1Date).toLocaleDateString()} |{" "}
          <span className="text-blue-600 font-medium">Mid 2:</span>{" "}
          {new Date(semester.mid2Date).toLocaleDateString()}
        </>
      )}
      {semester.mid1Date && !semester.mid2Date && (
        <>
          <span className="text-blue-600 font-medium">Mid 1:</span>{" "}
          {new Date(semester.mid1Date).toLocaleDateString()}
        </>
      )}
      {!semester.mid1Date && semester.mid2Date && (
        <>
          <span className="text-blue-600 font-medium">Mid 2:</span>{" "}
          {new Date(semester.mid2Date).toLocaleDateString()}
        </>
      )}
    </div>
  );
}

export default function SemestersSection({
  loading,
  semesters,
  selectedSemester,
  onSelectSemester,
  onCreateSemester,
  onEditSemester,
  onDeleteSemester,
}) {
  return (
    <div className="pb-6 md:pb-8 border-b">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Semesters
        </h2>
        <button
          onClick={onCreateSemester}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
        >
          <span>+</span> New Semester
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : semesters.length === 0 ? (
        <div className="text-slate-500 p-4 bg-slate-50 rounded-lg text-sm md:text-base">
          No semesters yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {semesters.map((s) => (
            <div
              key={s._id}
              onClick={() => onSelectSemester(s._id)}
              className={`p-4 rounded-lg cursor-pointer transition-all text-sm md:text-base flex items-start justify-between gap-3 ${
                selectedSemester === s._id
                  ? "bg-blue-50 border-2 border-blue-600"
                  : "bg-slate-50 border-2 border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900">{s.name}</div>
                <SemesterMidDates semester={s} />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSemester(s);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm px-3 py-1 hover:bg-blue-50 rounded transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSemester(s._id);
                  }}
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
