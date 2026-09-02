import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { useState } from "react";
export type SIZE_VARIANTS = "sm" | "md" | "lg" | "default";

const switchVariants = cva("flex items-center rounded-full transition-colors", {
  variants: {
    variant: {
      sm: "h-5 w-11 px-0.5",
      md: "h-9 w-20 px-0.5",
      lg: "h-12 w-28 px-0.75",
      default: "h-7 w-15 px-0.5",
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
        sm: "h-4 w-6 [--padding:0.125rem] [--scale-x:160%] [--scale-y:170%] [--switch-width:2.75rem] [--thumb-width:1.5rem]",
        md: "h-8 w-12 [--padding:0.125rem] [--scale-x:150%] [--scale-y:170%] [--switch-width:5rem] [--thumb-width:3rem]",
        lg: "h-10.5 w-17 [--padding:0.1875rem] [--scale-x:150%] [--scale-y:170%] [--switch-width:7rem] [--thumb-width:4.25rem]",
        default:
          "h-6 w-9 [--padding:0.125rem] [--scale-x:150%] [--scale-y:160%] [--switch-width:3.75rem] [--thumb-width:2.25rem]",
      },
      checked: {
        true: "translate-x-[calc(var(--switch-width)-var(--thumb-width)-2*var(--padding))]",
        false: "translate-x-0",
      },
      held: {
        true: "scale-x-[var(--scale-x)] scale-y-[var(--scale-y)] border-[0.125px] border-gray-200 opacity-45 drop-shadow-xl focus:outline-none",
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
          "translate-x-[calc(var(--switch-width)-var(--thumb-width)-3*var(--padding))]",
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
  className?: string;
  onCheckedChange?: (checked?: boolean) => void;
}

export const Switch = ({
  variant = "default",
  defaultChecked,
  className,
  checked,
  onCheckedChange,
}: SwitchProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(defaultChecked || false);
  const [isHeldDown, setIsHeldDown] = useState(false);

  const switchRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLButtonElement | null>(null);

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
      ref={switchRef}
      role="button"
      onPointerLeave={resetHeld}
      onPointerDown={() => setIsHeldDown(true)}
      onPointerUp={resetHeld}
      onClick={handleCheckedChange}
      className={cn(
        switchVariants({ variant, checked: derivedChecked }),
        className,
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
