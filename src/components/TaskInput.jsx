import { useState } from "react";

export default function TaskInput({ placeholder, onAdd }) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value, priority);
    setValue("");
    setPriority("Medium");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
      />

      <div className="flex gap-3 sm:w-auto w-full">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 w-full sm:w-auto"
        >
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>

        <button
          onClick={handleAdd}
          className="bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-indigo-600 w-full sm:w-auto transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}