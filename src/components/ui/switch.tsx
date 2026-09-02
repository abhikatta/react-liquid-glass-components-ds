import { cn } from "@/lib/cn";
import { useState } from "react";

const variants = {
  sm: "",
  md: "",
  lg: "",
  default: "",
};

interface SwitchProps {
  variant: keyof typeof variants;
}

export const Switch = ({ variant = "default" }: SwitchProps) => {
  const [isToggled, setIsToggled] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  const resetIsHeld = () => {
    setIsHeld(false);
  };

  return (
    <div
      role="button"
      aria-checked={isToggled}
      onMouseLeave={resetIsHeld}
      onMouseDown={() => setIsHeld(true)}
      onMouseUp={resetIsHeld}
      onClick={() => setIsToggled(!isToggled)}
      className={cn(
        "w-16 h-6 bg-gray-200 rounded-2xl flex items-center px-0.5",
      )}>
      <div
        role="button"
        onClick={() => setIsToggled(!isToggled)}
        className={cn(
          "w-8 h-5 rounded-full transition-all ease-out",
          isToggled
            ? "bg-purple-500 translate-x-[calc(4rem-2rem-2*0.125rem)]"
            : "bg-gray-300 translate-x-0",
          isHeld
            ? [
                "scale-180 drop-shadow-md backdrop-blur-[1000px] opacity-45",
                isToggled
                  ? "translate-x-[calc(4rem-2rem-4*0.125rem)]"
                  : "translate-x-1",
              ]
            : "scale-100",
        )}
      />
    </div>
  );
};
