import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { useState } from "react";
export type SIZE_VARIANTS = "sm" | "md" | "lg" | "default";

const switchContainerVariants = cva(
  "flex items-center rounded-2xl transition-colors",
  {
    variants: {
      variant: {
        sm: "h-4.5 w-10 px-0.25",
        md: "h-9 w-20",
        lg: "h-12 w-32",
        default: "h-7 w-16 px-0.5",
      },
      checked: {
        true: "bg-green-400",
        false: "bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const switchThumbVariants = cva(
  "rounded-full bg-white transition-all ease-out focus-visible:border-none focus-visible:outline-1",
  {
    variants: {
      variant: {
        sm: "h-4 w-6",
        md: "",
        lg: "",
        default: "h-6 w-9",
      },
      checked: {
        true: "translate-x-[calc(4rem-2.25rem-2*0.125rem)]",
        false: "translate-x-0",
      },
      held: {
        true: "scale-x-150 scale-y-170 border-[0.125px] border-gray-200 opacity-45 drop-shadow-xl focus:outline-none",
        false: "scale-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
    compoundVariants: [
      {
        variant: "default",
        held: true,
        checked: true,
        className: "translate-x-[calc(4rem-2rem-4*0.125rem)]",
      },
      {
        variant: "default",
        held: true,
        checked: false,
        className: "translate-x-0.125",
      },
    ],
  },
);

interface SwitchProps {
  variant?: SIZE_VARIANTS;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked?: boolean) => void;
}

export const Switch = ({
  variant = "default",
  defaultChecked,
  checked,
  onCheckedChange,
}: SwitchProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(defaultChecked || false);
  const [isHeldDown, setIsHeldDown] = useState(false);

  const isControlled = checked !== undefined;
  const derivedChecked = isControlled ? checked : isToggled;

  const handleCheckedChange = () => {
    isControlled
      ? onCheckedChange?.(!derivedChecked)
      : setIsToggled(!derivedChecked);
  };

  const resetHeld = () => {
    setIsHeldDown(false);
  };

  return (
    <div
      role="button"
      onMouseLeave={resetHeld}
      onMouseDown={() => setIsHeldDown(true)}
      onMouseUp={resetHeld}
      onClick={handleCheckedChange}
      className={cn(
        switchContainerVariants({ variant, checked: derivedChecked }),
      )}
    >
      <button
        id="thumb"
        onClick={handleCheckedChange}
        className={cn(
          switchThumbVariants({
            variant,
            checked: derivedChecked,
            held: isHeldDown,
          }),
        )}
      />
    </div>
  );
};
