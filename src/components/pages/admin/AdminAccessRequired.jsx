export default function AdminAccessRequired() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Admin Access Required
        </h2>
        <p className="text-slate-600 mt-2">Please sign in with an admin account</p>
      </div>
    </div>
  );
}
