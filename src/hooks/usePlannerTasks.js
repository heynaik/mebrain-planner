// src/hooks/usePlannerTasks.js
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

const getRandomMessage = (milestone) => {
  const messages = {
    1: ["Nice start 💪", "You’re off to a good start 🚀"],
    3: ["Momentum unlocked ⚡", "Keep this energy up 🔥"],
    5: ["Goal achieved 🏆", "You crushed your tasks 🎯"],
    10: ["🔥 Bonus streak!", "Legend status 👑"],
  };
  const options = messages[milestone] || ["Great work!"];
  return options[Math.floor(Math.random() * options.length)];
};

export default function usePlannerTasks(user) {
  const [sections, setSections] = useState({
    brainDump: [],
    today: [],
    tomorrow: [],
  });
  const celebratedMilestones = useRef(new Set());

  const sortTasks = (list) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    });
  };

  // Load tasks from Firestore
  useEffect(() => {
    async function loadTasks() {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetched = { brainDump: [], today: [], tomorrow: [] };
      querySnapshot.forEach((ds) => {
        const data = ds.data();
        if (data.userId === (user?.uid || "guest") && fetched[data.section]) {
          fetched[data.section].push({ id: ds.id, ...data });
        }
      });
      Object.keys(fetched).forEach((k) => (fetched[k] = sortTasks(fetched[k])));
      setSections(fetched);
    }
    loadTasks();
  }, [user]);

  // Task actions
  const handleAddTask = async (sectionId, text, priority) => {
    if (!text.trim()) return;
    const newTask = {
      text: text.trim(),
      completed: false,
      priority: priority || "Low",
      section: sectionId,
      createdAt: Date.now(),
      userId: user?.uid || "guest",
    };
    const ref = await addDoc(collection(db, "tasks"), newTask);
    setSections((prev) => ({
      ...prev,
      [sectionId]: sortTasks([...prev[sectionId], { id: ref.id, ...newTask }]),
    }));
  };

  const handleToggleTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    if (!task) return;

    const now = Date.now();
    const updated = { ...task, completed: !task.completed, completedAt: !task.completed ? now : null };
    await updateDoc(doc(db, "tasks", task.id), {
      completed: updated.completed,
      completedAt: updated.completed ? now : null,
    });

    setSections((prev) => {
      const list = [...prev[sectionId]];
      list[index] = updated;
      return { ...prev, [sectionId]: sortTasks(list) };
    });

    if (!task.completed) {
      const completedToday = Object.values(sections).flat().filter((t) => t.completed).length + 1;
      const milestones = [1, 3, 5, 10];
      const reached = milestones.find((m) => m === completedToday);
      if (reached && !celebratedMilestones.current.has(reached)) {
        celebratedMilestones.current.add(reached);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        toast.success(getRandomMessage(reached), {
          duration: 2500,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#111827",
            fontSize: "14px",
            padding: "10px 16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          },
        });
      }
    }
  };

  const handleRemoveTask = async (sectionId, index) => {
    const task = sections[sectionId][index];
    await deleteDoc(doc(db, "tasks", task.id));
    setSections((prev) => {
      const list = [...prev[sectionId]];
      list.splice(index, 1);
      return { ...prev, [sectionId]: list };
    });
  };

  const handleEditTask = async (taskId, newText, newPriority) => {
    const sectionKey = Object.keys(sections).find((k) =>
      sections[k].some((t) => t.id === taskId)
    );
    if (!sectionKey) return;
    const idx = sections[sectionKey].findIndex((t) => t.id === taskId);
    await updateDoc(doc(db, "tasks", taskId), {
      text: newText,
      priority: newPriority,
    });
    setSections((prev) => {
      const copy = { ...prev };
      copy[sectionKey][idx] = { ...copy[sectionKey][idx], text: newText, priority: newPriority };
      copy[sectionKey] = sortTasks(copy[sectionKey]);
      return copy;
    });
  };

  const handleMoveTask = async (sourceId, destId, task) => {
    await updateDoc(doc(db, "tasks", task.id), { section: destId });
    setSections((prev) => {
      const sList = prev[sourceId].filter((t) => t.id !== task.id);
      const dList = sortTasks([...prev[destId], { ...task, section: destId }]);
      return { ...prev, [sourceId]: sList, [destId]: dList };
    });
  };

  return {
    sections,
    setSections,
    handleAddTask,
    handleToggleTask,
    handleRemoveTask,
    handleEditTask,
    handleMoveTask,
  };
}