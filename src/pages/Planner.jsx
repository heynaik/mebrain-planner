import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import SectionCard from "../components/SectionCard";
import Header from "../components/Header";

export default function Planner() {
  const [sections, setSections] = useState({
    brainDump: [],
    today: [],
    tomorrow: [],
  });

  // ===== SORT TASKS =====
  const sortTasks = (list) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    });
  };

  // ===== ADD TASK =====
  const handleAddTask = (sectionId, text, priority) => {
    if (!text || !text.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
    };
    setSections((prev) => ({
      ...prev,
      [sectionId]: sortTasks([...prev[sectionId], newTask]),
    }));
  };

  // ===== TOGGLE COMPLETION =====
  const handleToggleTask = (sectionId, index) => {
    setSections((prev) => {
      const list = [...prev[sectionId]];
      list[index] = { ...list[index], completed: !list[index].completed };
      return { ...prev, [sectionId]: sortTasks(list) };
    });
  };

  // ===== REMOVE TASK =====
  const handleRemoveTask = (sectionId, index) => {
    setSections((prev) => {
      const list = [...prev[sectionId]];
      list.splice(index, 1);
      return { ...prev, [sectionId]: list };
    });
  };

  // ===== DRAG HANDLER =====
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcId = source.droppableId;
    const dstId = destination.droppableId;
    const srcIndex = source.index;
    const dstIndex = destination.index;

    if (srcId === dstId) {
      if (srcIndex === dstIndex) return;
      setSections((prev) => {
        const list = [...prev[srcId]];
        const [moved] = list.splice(srcIndex, 1);
        list.splice(dstIndex, 0, moved);
        return { ...prev, [srcId]: sortTasks(list) };
      });
    } else {
      setSections((prev) => {
        const sourceList = [...prev[srcId]];
        const destinationList = [...prev[dstId]];
        const [moved] = sourceList.splice(srcIndex, 1);
        if (!moved) return prev;
        destinationList.splice(dstIndex, 0, moved);
        return {
          ...prev,
          [srcId]: sortTasks(sourceList),
          [dstId]: sortTasks(destinationList),
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300 flex flex-col">
      <Header />
<main className="flex flex-col items-center justify-start flex-grow pt-16 sm:pt-10 pb-12 px-4 sm:px-8 transition-all duration-300">        <DragDropContext onDragEnd={onDragEnd}>
          <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "brainDump", title: "🧠 Brain Dump", placeholder: "Write down random thoughts..." },
              { id: "today", title: "📅 Today", placeholder: "Add today’s tasks..." },
              { id: "tomorrow", title: "🌅 Tomorrow", placeholder: "Add tomorrow’s tasks..." },
            ].map((section) => (
              <SectionCard
                key={section.id}
                droppableId={section.id}
                title={section.title}
                placeholder={section.placeholder}
                tasks={sections[section.id]}
                onAdd={(text, priority) => handleAddTask(section.id, text, priority)}
                onToggle={(index) => handleToggleTask(section.id, index)}
                onRemove={(index) => handleRemoveTask(section.id, index)}
              />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}