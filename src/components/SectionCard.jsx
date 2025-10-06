import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useState, useRef, useEffect } from "react";
import { Plus, Save, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SectionCard({
  title,
  placeholder,
  tasks = [],
  onAdd,
  onToggle,
  onRemove,
  onMove,
  onEdit,
  droppableId,
}) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingTask, setEditingTask] = useState(null);
  const [longPressedTask, setLongPressedTask] = useState(null);
  const pressTimerRef = useRef(null); // ref for the long-press timer
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [task]);

  // clear timer on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    };
  }, []);

  const priorityOptions = [
    { value: "High", icon: "🔥" },
    { value: "Medium", icon: "⏳" },
    { value: "Low", icon: "🌿" },
  ];

  const sections = [
    { id: "brainDump", label: "🧠 Brain Dump" },
    { id: "today", label: "📅 Today" },
    { id: "tomorrow", label: "🌅 Tomorrow" },
  ];

  const handleAddOrSave = () => {
    if (!task.trim()) return;
    if (editingTask) {
      onEdit(editingTask.id, task, priority);
      setEditingTask(null);
    } else {
      onAdd(task, priority);
    }
    setTask("");
    setPriority("Medium");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddOrSave();
    }
  };

  // Start long-press timer unless press began on the drag handle.
  const handlePointerDownOnCard = (taskObj, e) => {
    // If the press originates from the drag handle (or inside it), skip long-press.
    // This is robust and avoids race conditions with React event ordering.
    try {
      if (e?.target && e.target.closest && e.target.closest("[data-drag-handle]")) {
        // do nothing; user is starting interaction on the handle (drag)
        return;
      }
    } catch (err) {
      // ignore and continue
    }

    // clear existing timer first
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    // start timer to open long-press menu
    pressTimerRef.current = window.setTimeout(() => {
      setLongPressedTask(taskObj);
      pressTimerRef.current = null;
    }, 500);
  };

  const handlePointerUpOnCard = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  // Cancel long-press if user moves finger (typical when dragging)
  const handlePointerMoveOnCard = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  // Move between sections (called from long-press menu)
  const handleMove = (targetSectionId) => {
    if (onMove && longPressedTask) {
      onMove(longPressedTask.section, targetSectionId, longPressedTask);
      setLongPressedTask(null);
    }
  };

  const handleEditStart = (taskObj) => {
    setEditingTask(taskObj);
    setTask(taskObj.text);
    setPriority(taskObj.priority);
    setLongPressedTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTask("");
    setPriority("Medium");
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-white dark:bg-gray-800 shadow-sm rounded-2xl flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-200 overflow-hidden ${
            snapshot.isDraggingOver ? "ring-2 ring-indigo-400 dark:ring-indigo-500" : "hover:shadow-md"
          }`}
        >
          {/* Header + input */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-t-2xl px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
              <AnimatePresence>
                {editingTask && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-indigo-500 font-medium"
                  >
                    ✏️ Editing task
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-start gap-2">
              <textarea
                ref={textareaRef}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={editingTask ? "Edit your task..." : placeholder}
                rows={1}
                className="flex-1 resize-none overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-[7px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />

              <div className="flex items-center gap-1 mt-[3px]">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`text-lg transition-all duration-200 px-[6px] py-[3px] rounded-full ${
                      priority === p.value ? "ring-2 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                    title={p.value}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {editingTask ? (
                  <motion.div key="save-mode" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-2">
                    <button onClick={handleAddOrSave} className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm" title="Save">
                      <Save size={18} />
                    </button>
                    <button onClick={handleCancelEdit} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-sm" title="Cancel">
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button key="add-mode" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={handleAddOrSave} className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm" title="Add Task">
                    <Plus size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Tasks list */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 custom-scrollbar">
            {tasks.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-xs italic text-center py-3">No tasks yet — add one above ✍️</p>}

            {tasks.map((t, i) => (
              <Draggable key={t.id} draggableId={t.id} index={i} isDragDisabled={!!editingTask}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    onPointerDown={(e) => handlePointerDownOnCard(t, e)}
                    onPointerUp={handlePointerUpOnCard}
                    onPointerMove={handlePointerMoveOnCard}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer select-none ${
                      t.completed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 opacity-80" : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    } ${snapshot.isDragging ? "shadow-lg scale-[1.02] border-indigo-300 dark:border-indigo-600" : ""}`}
                  >
                    <div className="flex items-start gap-2 flex-1">
                      <input type="checkbox" checked={t.completed} onChange={() => onToggle(i)} className="w-4 h-4 mt-[3px] accent-indigo-500 cursor-pointer" />
                      <span className={`text-sm ${t.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}>{t.text}</span>
                    </div>

                    <span className={`text-base ${t.priority === "High" ? "text-red-500" : t.priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>
                      {t.priority === "High" ? "🔥" : t.priority === "Medium" ? "⏳" : "🌿"}
                    </span>

                    {/* drag handle: has data attribute — used to detect origin of press */}
                    <div
                      {...provided.dragHandleProps}
                      data-drag-handle="true"
                      className="ml-3 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-300 cursor-grab active:cursor-grabbing select-none"
                      title="Drag to move"
                    >
                      <GripVertical size={16} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>

          {/* Long-press popup (opens only when long press started NOT on handle) */}
          <AnimatePresence>
            {longPressedTask && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setLongPressedTask(null)}>
                <motion.div onClick={(e) => e.stopPropagation()} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 w-[80%] max-w-xs">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-3 text-center">{longPressedTask.text}</h3>
                  <div className="flex flex-col gap-2">
                    {sections.filter((s) => s.id !== droppableId).map((s) => (
                      <button key={s.id} onClick={() => handleMove(s.id)} className="w-full text-sm py-2 rounded-lg bg-white/60 dark:bg-gray-700/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                        Move to {s.label}
                      </button>
                    ))}

                    <button onClick={() => handleEditStart(longPressedTask)} className="w-full text-sm py-2 rounded-lg bg-indigo-500/80 text-white hover:bg-indigo-600 transition">✏️ Edit</button>

                    <button onClick={() => { const idx = tasks.findIndex((x) => x.id === longPressedTask.id); if (idx !== -1) onRemove(idx); setLongPressedTask(null); }} className="w-full text-sm py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition">Delete</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Droppable>
  );
}