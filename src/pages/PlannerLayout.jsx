// src/pages/PlannerLayout.jsx
import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import SectionCard from "../components/SectionCard";
import DailyProductivityCard from "../components/FloatingProductivity";
import OldTasksSection from "../components/OldTasksSection";

/**
 * PlannerLayout - presentational layout for Planner page
 * Keeps layout separate from data logic so Planner.jsx stays smaller.
 */
export default function PlannerLayout({
  sections,
  visibleSections,
  allTasks,
  oldTasks,
  isMobile,
  onDragEnd,
  handleAddTask,
  handleToggleTask,
  handleRemoveTask,
  handleMoveTask,
  handleEditTask,
}) {
  // reduced top padding so the 3 columns sit a little higher and feel balanced
  const topPadding = 40;
  const bottomPadding = isMobile ? 100 : 60;

  return (
    <main
      style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      className="flex flex-col items-center justify-start flex-grow px-4 sm:px-8 md:pl-24 transition-all duration-300"
    >
      {/* Productivity + old tasks */}
      <div className="w-full flex flex-col items-center mb-6">
        <DailyProductivityCard tasks={allTasks} />
        <OldTasksSection tasks={oldTasks} onToggle={handleToggleTask} />
      </div>

      {/* Task columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={`w-full max-w-[1400px] grid ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          } gap-6`}
        >
          {Object.keys(visibleSections).map((id) => {
            const sectionData = {
              brainDump: {
                title: "🧠 Brain Dump",
                placeholder: "Write down random thoughts...",
              },
              today: {
                title: "📅 Today",
                placeholder: "Add today’s tasks...",
              },
              tomorrow: {
                title: "🌅 Tomorrow",
                placeholder: "Add tomorrow’s tasks...",
              },
            }[id];

            return (
              <SectionCard
                key={id}
                droppableId={id}
                title={sectionData.title}
                placeholder={sectionData.placeholder}
                tasks={sections[id]}
                onAdd={(text, priority) => handleAddTask(id, text, priority)}
                onToggle={(index) => handleToggleTask(id, index)}
                onRemove={(index) => handleRemoveTask(id, index)}
                onMove={handleMoveTask}
                onEdit={handleEditTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </main>
  );
}