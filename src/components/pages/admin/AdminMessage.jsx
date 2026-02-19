export default function AdminMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-sm md:text-base">
      {message}
    </div>
  );
}
