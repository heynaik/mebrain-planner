import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-6 sm:px-10 py-4 shadow-sm z-50">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        Me<span className="text-indigo-500">Brain</span>
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}