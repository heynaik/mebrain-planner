// src/pages/Planner.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import SectionCard from "../components/SectionCard";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Planner({ user }) {
  const [sections, setSections] = useState({
    brainDump: [],
    today: [],
    tomorrow: [],
  });
  const [activeSection, setActiveSection] = useState("today");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // measured header height (px)
  const [headerHeight, setHeaderHeight] = useState(72); // fallback
  const headerRef = useRef(null);

  // ---------- Header measurement (robust) ----------
  useLayoutEffect(() => {
    const wrapper = headerRef.current;
    if (!wrapper) return;

    // Try to find the actual header element (handles fixed/portal headers)
    const findHeader = () =>
      wrapper.querySelector("header") ||
      document.querySelector("header") ||
      wrapper.firstElementChild ||
      wrapper;

    let target = findHeader();

    const updateHeight = () => {
      if (!target) target = findHeader();
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const h = Math.ceil(rect.height || 72);
      setHeaderHeight(h);
    };

    // initial measurement
    updateHeight();

    // ResizeObserver for live changes (menu expanded, responsive, etc.)
    let ro;
    try {
      ro = new ResizeObserver(updateHeight);
      ro.observe(target);
    } catch (e) {
      // ResizeObserver unsupported -> fallback to resize event
    }

    // Fonts may change layout; wait for fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateHeight).catch(() => {});
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  // ---------- Responsive detection ----------
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---------- Firestore helpers ----------
  const sortTasks = (list) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    });
  };

  useEffect(() => {
    async function loadTasks() {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const fetched = { brainDump: [], today: [], tomorrow: [] };
        querySnapshot.forEach((ds) => {
          const data = ds.data();
          // ensure tasks belong to this user (or handle guest differently)
          if (data.userId === (user?.uid || "guest") && fetched[data.section]) {
            fetched[data.section].push({ id: ds.id, ...data });
          }
        });
        Object.keys(fetched).forEach((k) => (fetched[k] = sortTasks(fetched[k])));
        setSections(fetched);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    }
    loadTasks();
  }, [user]);

  const handleAddTask = async (sectionId, text, priority) => {
    if (!text || !text.trim()) return;
    const newTask = {
      text: text.trim(),
      completed: false,
      priority: priority || "Low",
      section: sectionId,
      createdAt: Date.now(),
      userId: user?.uid || "guest",
    };
    try {
      const ref = await addDoc(collection(db, "tasks"), newTask);
      setSections((prev) => ({
        ...prev,
        [sectionId]: sortTasks([...prev[sectionId], { id: ref.id, ...newTask }]),
      }));
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleToggleTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    if (!task) return;
    try {
      const updated = { ...task, completed: !task.completed };
      await updateDoc(doc(db, "tasks", task.id), { completed: updated.completed });
      setSections((prev) => {
        const list = [...prev[sectionId]];
        list[index] = updated;
        return { ...prev, [sectionId]: sortTasks(list) };
      });
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const handleRemoveTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    if (!task) return;
    try {
      await deleteDoc(doc(db, "tasks", task.id));
      setSections((prev) => {
        const list = [...prev[sectionId]];
        list.splice(index, 1);
        return { ...prev, [sectionId]: list };
      });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = async (taskId, newText, newPriority) => {
    try {
      // find section & index
      const sectionKey = Object.keys(sections).find((k) =>
        sections[k].some((t) => t.id === taskId)
      );
      if (!sectionKey) return;
      const idx = sections[sectionKey].findIndex((t) => t.id === taskId);
      const task = sections[sectionKey][idx];
      await updateDoc(doc(db, "tasks", taskId), { text: newText, priority: newPriority });
      setSections((prev) => {
        const copy = { ...prev };
        copy[sectionKey][idx] = { ...copy[sectionKey][idx], text: newText, priority: newPriority };
        copy[sectionKey] = sortTasks(copy[sectionKey]);
        return copy;
      });
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const handleMoveTask = async (sourceId, destId, task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), { section: destId });
      setSections((prev) => {
        const sList = prev[sourceId].filter((t) => t.id !== task.id);
        const dList = sortTasks([...prev[destId], { ...task, section: destId }]);
        return { ...prev, [sourceId]: sList, [destId]: dList };
      });
    } catch (err) {
      console.error("Error moving task:", err);
    }
  };

  // ---------- Drag & drop ----------
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const srcId = source.droppableId;
    const dstId = destination.droppableId;
    if (srcId === dstId) {
      setSections((prev) => {
        const list = [...prev[srcId]];
        const [moved] = list.splice(source.index, 1);
        list.splice(destination.index, 0, moved);
        return { ...prev, [srcId]: sortTasks(list) };
      });
    } else {
      const moved = sections[srcId][source.index];
      handleMoveTask(srcId, dstId, moved);
    }
  };

  // Visible sections (mobile shows just active one)
  const visibleSections = isMobile ? { [activeSection]: sections[activeSection] } : sections;

  // padding top is header height + small gap
  const topPadding = headerHeight ? headerHeight + 16 : 88;
  const bottomPadding = isMobile ? 100 : 60; // leaves room for mobile nav

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300 relative">
      {/* Header wrapper used to find the header node */}
      <div ref={headerRef}>
        <Header />
      </div>

      <main
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
        className="flex flex-col items-center justify-start flex-grow px-4 sm:px-8 transition-all duration-300"
      >
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
                  onMove={handleMoveTask}   // optional helper used by card long-press UI
                  onEdit={handleEditTask}   // optional edit helper
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
        </div>
      )}
    </div>
  );
}