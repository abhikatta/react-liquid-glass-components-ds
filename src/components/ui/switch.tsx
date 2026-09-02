import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { useState } from "react";
export type SIZE_VARIANTS = "sm" | "md" | "lg" | "default";

const switchVariants = cva("flex items-center rounded-2xl transition-colors", {
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
});

const switchThumbVariants = cva(
  "rounded-full bg-white transition-all ease-out focus-visible:border-none focus-visible:outline-1",
  {
    variants: {
      variant: {
        sm: "h-4 w-6 [--padding:0.0625rem] [--switch-width:2.5rem] [--thumb-width:1.5rem]",
        md: "",
        lg: "",
        default:
          "h-6 w-9 [--padding:0.25rem] [--switch-width:4rem] [--thumb-width:2rem]",
      },
      checked: {
        true: "translate-x-[calc(var(--switch-width)-var(--thumb-width)-2*var(--padding))]",
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
        held: true,
        checked: true,
        className:
          "translate-x-[calc(var(--switch-width)-var(--thumb-width)-4*var(--padding))]",
      },
      {
        held: true,
        checked: false,
        className: "translate-x-[var(--padding)]",
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
      className={cn(switchVariants({ variant, checked: derivedChecked }))}
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
