import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OldTasksSection({ tasks = [], onToggle }) {
  const [open, setOpen] = useState(false);
  if (tasks.length === 0) return null;

  const daysOld = (t) =>
    Math.floor((Date.now() - t.createdAt) / (1000 * 60 * 60 * 24));

  return (
    <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          ⏳ Tasks Pending Too Long ({tasks.length})
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
          >
            {tasks.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 py-2 border-b last:border-0 border-gray-50 dark:border-gray-700"
              >
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  ⚠️ {t.text}
                  <span className="ml-2 text-xs text-gray-400">
                    ({daysOld(t)} days old)
                  </span>
                </div>
                <button
                  onClick={() => onToggle(t.section, i)}
                  className="text-xs px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Mark Done
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}