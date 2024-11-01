import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/solid";

const Header = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          className="w-6 h-6 text-yellow-500"
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <MoonIcon
          className="w-6 h-6 text-gray-900"
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };

  return (
    <header className="flex w-full p-5 py-3 justify-between text-sm text-gray-800 border-b border-zinc-200 dark:border-zinc-800">
      {/* left section */}
      <div className="flex space-x-4 items-center">
        {renderThemeChanger()}
      </div>

      {/* right section */}
      <div className="flex space-x-4 items-center select-none">
        <span className="font-bold font-sansSerif dark:text-gray-100">
          妈妈的助理
        </span>
      </div>
    </header>
  );
};

export default Header;
