import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { useRef, useState } from "react";
import type { SIZE_VARIANTS } from "./constants";

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
  "rounded-full bg-white transition-all duration-300 ease-out focus-visible:border-none focus-visible:outline-1",
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
        true: "",
        false: "",
      },
      held: {
        true: "scale-x-[var(--scale-x)] scale-y-[var(--scale-y)] opacity-45 drop-shadow-xl focus:outline-none",
        false: "scale-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
    // compoundVariants: [
    //   {
    //     held: true,
    //     checked: true,
    //     className:
    //       "translate-x-[calc(var(--switch-width)-var(--thumb-width)-3*var(--padding))]",
    //   },
    //   {
    //     held: true,
    //     checked: false,
    //     className: "translate-x-[var(--padding)]",
    //   },
    // ],
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
  // final state of the switch's thumb. false means its on left, true is right (respecting padding)
  const [isToggled, setIsToggled] = useState<boolean>(defaultChecked || false);
  // click and hold means true, release means false
  const [isHeldDown, setIsHeldDown] = useState(false);
  // click and hold and moving the thumb with the pointer updates this
  const [dragPosX, setDragPosX] = useState(0);
  // where the click and hold and move of thumb started from
  const [dragStartPosX, setDragStartPosX] = useState(0);
  // position of switch
  const [switchRect, setSwitchRect] = useState<DOMRect | null>(null);

  const paddingOffset = useRef<number | null>(null);

  // refs of the container(switch) and button(thumb)
  const switchRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLButtonElement | null>(null);

  // if props not passed for checked, its uncontrolled by dev
  const isControlled = checked !== undefined;
  const derivedChecked = isControlled ? checked : isToggled;

  const handleCheckedChange = () => {
    if (isControlled) {
      onCheckedChange?.(!derivedChecked);
    }
    const [min, _, max] = getClamps();
    if (derivedChecked) {
      setDragPosX(min);
    } else {
      setDragPosX(max);
    }
    setIsToggled(!derivedChecked);
  };

  //   this is done and working as expected
  const getClamps = () => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return [0, 0];
    const paddingOffset = parseFloat(getComputedStyle(swichEl).paddingLeft);
    const minX = 0;
    const midX = swichEl.clientWidth / 2;
    const maxX = swichEl.clientWidth - thumbEl.clientWidth - 2 * paddingOffset;
    return [minX, midX, maxX];
  };

  const getThumbLeft = () => {
    const thumbEl = thumbRef.current;
    if (!thumbEl || !switchRect) return 0;
    return thumbEl.getBoundingClientRect().left - switchRect.left;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return;
    setIsHeldDown(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const switchRect = swichEl.getBoundingClientRect();
    setSwitchRect(switchRect);
    const newPaddingOffset = parseFloat(getComputedStyle(swichEl).paddingLeft);
    paddingOffset.current = newPaddingOffset;
    setDragStartPosX(e.clientX - switchRect.left);
    if (derivedChecked) {
      setDragPosX(getThumbLeft() - newPaddingOffset);
    } else {
      setDragPosX(getThumbLeft());
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const thumbEl = thumbRef.current;
    if (!thumbEl || !isHeldDown || !switchRect) return;
    const [min, _, max] = getClamps();
    console.log(min, _, max);
    const localX = e.clientX - switchRect.left - getThumbLeft();
    const clampedX = Math.max(min, Math.min(localX, max));
    console.log("prev dragPosX: ", dragPosX);
    setDragPosX(clampedX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return 0;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsHeldDown(false);
  };

  return (
    <>
      <div
        ref={switchRef}
        role="button"
        onClick={handleCheckedChange}
        className={cn(
          switchVariants({ variant, checked: derivedChecked }),
          className,
        )}
      >
        <button
          ref={thumbRef}
          onPointerDown={handlePointerDown} // click/touch
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp} // release click/touch
          onPointerCancel={handlePointerUp} // unexpected interruptions or cancellations
          id="thumb"
          className={cn(
            switchThumbVariants({
              variant,
              checked: derivedChecked,
              held: isHeldDown,
            }),
          )}

          style={{ transform: `translateX(${dragPosX}px)` }}
        />
      </div>
    </>
  );
};
