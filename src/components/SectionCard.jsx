import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

export default function SectionCard({
  title,
  placeholder,
  tasks = [],
  onAdd,
  onToggle,
  onRemove,
  droppableId,
}) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [task]);

  const handleAdd = () => {
    if (!task.trim()) return;
    onAdd(task, priority);
    setTask("");
    setPriority("Medium");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const priorityOptions = [
    { value: "High", icon: "🔥", label: "High Priority" },
    { value: "Medium", icon: "⏳", label: "Medium Priority" },
    { value: "Low", icon: "🌿", label: "Low Priority" },
  ];

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white dark:bg-gray-800 shadow-sm rounded-2xl flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-200 overflow-hidden ${
            snapshot.isDraggingOver
              ? "ring-2 ring-indigo-400 dark:ring-indigo-500"
              : "hover:shadow-md"
          }`}
        >
          {/* ===== Sticky Header + Input ===== */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-2xl px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-100">{title}</h2>

            <div className="flex items-start gap-2 w-full">
              {/* Auto-growing textarea */}
              <textarea
                ref={textareaRef}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                rows={1}
                className="flex-1 resize-none overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-[7px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />

              {/* Priority Selector */}
              <div className="flex items-center gap-1 mt-[3px]">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    title={p.label}
                    className={`text-lg transition-all duration-200 px-[6px] py-[3px] rounded-full ${
                      priority === p.value
                        ? "ring-2 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                title="Add Task"
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-8 h-8 transition-transform duration-200 hover:scale-110 shadow-sm mt-[2px]"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* ===== Scrollable Task List ===== */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 custom-scrollbar">
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-gray-400 dark:text-gray-500 text-xs italic text-center py-3">
                No tasks yet — add one above ✍️
              </p>
            )}

            {tasks.map((task, i) => (
              <Draggable key={task.id} draggableId={task.id} index={i}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg border transition-all duration-300 transform cursor-grab active:cursor-grabbing break-words animate-fadeSlideIn ${
                      task.completed
                        ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 opacity-75"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    } ${
                      snapshot.isDragging
                        ? "shadow-lg scale-[1.02] bg-indigo-50 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-600"
                        : ""
                    }`}
                  >
                    {/* Task Text + Checkbox */}
                    <div className="flex items-start gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(i)}
                        className="w-4 h-4 mt-[2px] accent-indigo-500 cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-xs sm:text-sm leading-snug whitespace-pre-wrap break-words ${
                          task.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    {/* Priority Icon */}
                    <span
                      title={`${task.priority} Priority`}
                      className={`text-base ${
                        task.priority === "High"
                          ? "text-red-500 dark:text-red-400"
                          : task.priority === "Medium"
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-blue-500 dark:text-blue-400"
                      }`}
                    >
                      {task.priority === "High"
                        ? "🔥"
                        : task.priority === "Medium"
                        ? "⏳"
                        : "🌿"}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => onRemove(i)}
                      title="Delete Task"
                      className="text-gray-400 hover:text-red-500 text-[10px] transition-all duration-200 hover:scale-110 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Draggable>
            ))}

            {/* Placeholder while dragging */}
            {snapshot.isDraggingOver && (
              <div className="h-12 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-900/30 animate-pulse" />
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}