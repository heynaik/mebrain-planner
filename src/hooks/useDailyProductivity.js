// src/hooks/useDailyProductivity.js
import { useEffect, useState, useMemo } from "react";

export default function useDailyProductivity(tasks = [], goal = 5) {
  const [dateKey, setDateKey] = useState(() =>
    new Date().toLocaleDateString("en-CA") // yyyy-mm-dd
  );
  const [completedToday, setCompletedToday] = useState(0);
  const [motivation, setMotivation] = useState("");

  // reset automatically at midnight (local)
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toLocaleDateString("en-CA");
      if (today !== dateKey) {
        setDateKey(today);
        setCompletedToday(0);
      }
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [dateKey]);

  // compute how many tasks were completed today
  useEffect(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const count = tasks.filter(
   (t) =>
     t.completed &&
     t.completedAt &&
     t.completedAt >= todayStart.getTime()
 ).length;
    setCompletedToday(count);
  }, [tasks]);

  const progress = useMemo(
    () => Math.min((completedToday / goal) * 100, 150), // allow over-100 %
    [completedToday, goal]
  );

  useEffect(() => {
    const messages = [
      "🚀 Great start!",
      "🔥 You're on fire!",
      "💪 Keep the momentum!",
      "🌟 Crushing your goals!",
      "🎯 Amazing focus today!",
    ];
    if (progress === 0) setMotivation("✨ Let's start the day strong!");
    else if (progress < 40) setMotivation(messages[0]);
    else if (progress < 80) setMotivation(messages[1]);
    else if (progress < 100) setMotivation(messages[2]);
    else if (progress === 100) setMotivation(messages[3]);
    else setMotivation(messages[4]);
  }, [progress]);

  return { completedToday, progress, goal, motivation };
}