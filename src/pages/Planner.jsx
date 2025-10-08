import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";
import PlannerLayout from "./PlannerLayout";
import usePlannerTasks from "../hooks/usePlannerTasks"; // 🧩 NEW — Firestore logic hook

export default function Planner({ user }) {
  const [activeSection, setActiveSection] = useState("today");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ use the new hook for all task logic
  const {
    sections,
    handleAddTask,
    handleToggleTask,
    handleRemoveTask,
    handleEditTask,
    handleMoveTask,
  } = usePlannerTasks(user);

  // ✅ Responsive
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Helpers
  const allTasks = [
    ...sections.brainDump,
    ...sections.today,
    ...sections.tomorrow,
  ];

  const oldTasks = allTasks.filter(
    (t) => !t.completed && Date.now() - t.createdAt > 4 * 24 * 60 * 60 * 1000
  );

  const visibleSections = isMobile
    ? { [activeSection]: sections[activeSection] }
    : sections;

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const srcId = source.droppableId;
    const dstId = destination.droppableId;
    if (srcId === dstId) {
      // reorder within same section (handled internally by hook logic)
      handleMoveTask(srcId, dstId, sections[srcId][source.index]);
    } else {
      const moved = sections[srcId][source.index];
      handleMoveTask(srcId, dstId, moved);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300 relative">
      {/* ✅ Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      {/* ✅ Header (mobile) */}
      <div className="block md:hidden">
        <Header user={user} />
      </div>

      {/* 🧩 Main Layout */}
      <PlannerLayout
        sections={sections}
        visibleSections={visibleSections}
        allTasks={allTasks}
        oldTasks={oldTasks}
        isMobile={isMobile}
        onDragEnd={onDragEnd}
        handleAddTask={handleAddTask}
        handleToggleTask={handleToggleTask}
        handleRemoveTask={handleRemoveTask}
        handleMoveTask={handleMoveTask}
        handleEditTask={handleEditTask}
      />

      {/* === Mobile Bottom Navigation === */}
      {isMobile && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <MobileNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
      )}
    </div>
  );
}