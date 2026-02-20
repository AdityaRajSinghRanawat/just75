import { formatPeriods } from "./studentPageUtils";

export default function ResultsSection({ result, periodsPerDay }) {
  if (!result) return null;

  return (
    <div className="result-entry-animation border-t pt-8 bg-blue-50 border-blue-200 rounded-lg p-6 -mx-8 -mb-8 px-8">
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Your Results
      </h2>
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm font-medium text-slate-600">
            Must Attend (remaining)
          </div>
          <div className="text-3xl font-bold text-blue-600 mt-1">
            {formatPeriods(result.mustAttend, periodsPerDay)}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm font-medium text-slate-600">
            Can Miss (remaining)
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {formatPeriods(result.canMiss, periodsPerDay)}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm font-medium text-slate-600">
            Maximum Possible
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {result.maxPossiblePercent.toFixed(1)}%
          </div>
        </div>
        <div
          className={`rounded-lg p-4 font-semibold text-center text-white ${
            result.achievable ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {result.achievable
            ? "Goal is achievable"
            : "Goal may not be achievable"}
        </div>
      </div>
    </div>
  );
}
