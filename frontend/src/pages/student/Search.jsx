
import { useState } from "react";


export default function Search({ onSearch = () => { } }) {
  const [filters, setFilters] = useState({
    title: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v.trim() !== "")
    );

    onSearch(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({
      title: "",
      location: "",
    });

    onSearch({});
  };

  return (
    <div
      style={{
        border: "1px solid #2d3748",
        borderRadius: "16px",
        padding: "18px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      {/* Title Input */}
      <input
        name="title"
        value={filters.title}
        placeholder="Job Title"
        onChange={handleChange}
        style={{
          flex: 1,
          minWidth: "180px",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #374151",
          background: "#0f172a",
          color: "#f9fafb",
          outline: "none",
        }}
      />

      {/* Location Input */}
      <input
        name="location"
        value={filters.location}
        placeholder="Location"
        onChange={handleChange}
        style={{
          flex: 1,
          minWidth: "180px",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #374151",
          background: "#0f172a",
          color: "#f9fafb",
          outline: "none",
        }}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #e2b96f, #c9973e)",
          color: "#111827",
          fontWeight: "600",
        }}
      >
        🔍 Search
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #374151",
          cursor: "pointer",
          background: "transparent",
          color: "#9ca3af",
        }}
      >
        Reset
      </button>
    </div>
  );
}