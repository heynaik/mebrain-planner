// src/pages/Planner.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import SectionCard from "../components/SectionCard";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Planner({ user }) {
  const [sections, setSections] = useState({
    brainDump: [],
    today: [],
    tomorrow: [],
  });

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
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = { brainDump: [], today: [], tomorrow: [] };

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.section && fetched[data.section]) {
            fetched[data.section].push({ id: docSnap.id, ...data });
          }
        });

        Object.keys(fetched).forEach((key) => (fetched[key] = sortTasks(fetched[key])));
        setSections(fetched);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }

    if (user) loadTasks();
  }, [user]);

  const handleAddTask = async (sectionId, text, priority) => {
    if (!text || !text.trim()) return;

    const newTask = {
      text: text.trim(),
      completed: false,
      priority: priority || "Low",
      section: sectionId,
      createdAt: Date.now(),
      userId: user.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setSections((prev) => ({
        ...prev,
        [sectionId]: sortTasks([...prev[sectionId], { id: docRef.id, ...newTask }]),
      }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    const updated = { ...task, completed: !task.completed };

    try {
      await updateDoc(doc(db, "tasks", task.id), { completed: updated.completed });
      setSections((prev) => {
        const list = [...prev[sectionId]];
        list[index] = updated;
        return { ...prev, [sectionId]: sortTasks(list) };
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleRemoveTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    try {
      await deleteDoc(doc(db, "tasks", task.id));
      setSections((prev) => {
        const list = [...prev[sectionId]];
        list.splice(index, 1);
        return { ...prev, [sectionId]: list };
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcId = source.droppableId;
    const dstId = destination.droppableId;
    const srcIndex = source.index;
    const dstIndex = destination.index;

    if (srcId === dstId) {
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
        moved.section = dstId;
        updateDoc(doc(db, "tasks", moved.id), { section: dstId });
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
<main className="flex flex-col items-center justify-start flex-grow pt-20 pb-24 px-4 sm:px-8 transition-all duration-300">        <DragDropContext onDragEnd={onDragEnd}>
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