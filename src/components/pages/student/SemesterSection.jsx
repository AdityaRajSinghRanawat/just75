export default function SemesterSection({
  semesters,
  semesterId,
  onSemesterChange,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Select Semester
      </h2>
      <select
        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        value={semesterId}
        onChange={(e) => onSemesterChange(e.target.value)}
      >
        <option value="">Choose a semester</option>
        {semesters.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
