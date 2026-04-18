export default function JobCard({ title, description, skills, onApply }) {
  return (
    <div className="border p-4 rounded-md shadow-md mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2">{description}</p>
      <p className="mt-2 font-semibold">Skills: {skills.join(", ")}</p>
      {onApply && (
        <button
          onClick={onApply}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      )}
    </div>
  );
}