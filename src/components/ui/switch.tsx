import { cn } from "@/lib/cn";
import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
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
      held: {
        true: "scale-x-[var(--scale-x)] scale-y-[var(--scale-y)] opacity-45 drop-shadow-xl focus:outline-none",
        false: "scale-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
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
  // start position of click and hold and moving the thumb with the pointer updates this
  const startXRef = useRef(0);

  // position of switch
  const [switchRect, setSwitchRect] = useState<DOMRect | null>(null);

  const paddingOffset = useRef<number | null>(null);

  const switchRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLButtonElement | null>(null);

  // if props not passed for checked, its uncontrolled by dev
  const isControlled = checked !== undefined;
  const derivedChecked = isControlled ? checked : isToggled;

  const getClamps = () => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return [0, 0];

    const paddingOffset = parseFloat(getComputedStyle(swichEl).paddingLeft);
    const minX = 0; // no translateX
    const maxX = swichEl.clientWidth - thumbEl.clientWidth - 2 * paddingOffset; // max left(edge of thumb) possible translateX
    return [minX, maxX];
  };

  const getThumbLeft = (domRect?: DOMRect) => {
    const thumbEl = thumbRef.current;
    const localSwitchRect = domRect ?? switchRect;
    if (!thumbEl || !localSwitchRect) return 0;
    return thumbEl.getBoundingClientRect().left - localSwitchRect.left;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return;

    setIsHeldDown(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const switchRect = swichEl.getBoundingClientRect();
    startXRef.current = e.clientX;
    setSwitchRect(switchRect);
    const newPaddingOffset = parseFloat(getComputedStyle(swichEl).paddingLeft);
    paddingOffset.current = newPaddingOffset;

    const thumbLeft = getThumbLeft(switchRect); // passing local because its not updated yet in state by the time switchRect is accesssed inside the func
    if (derivedChecked) {
      setDragPosX(thumbLeft - newPaddingOffset);
    } else {
      setDragPosX(thumbLeft);
    }
  };

  // posX is always w.r.t the container(switch) and not viewport
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const thumbEl = thumbRef.current;
    if (!thumbEl || !isHeldDown || !switchRect) return;

    const [min, max] = getClamps();

    const localX = e.clientX - switchRect.left - getThumbLeft(); // x position w.r.t to the switch(container)
    const clampedX = Math.max(min, Math.min(localX, max)); // either 0 or max or somewhere in between
    setDragPosX(clampedX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const swichEl = switchRef.current;
    const thumbEl = thumbRef.current;
    if (!swichEl || !thumbEl) return 0;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsHeldDown(false);
    const [min, max] = getClamps();

    const isClick = Math.abs(e.clientX - startXRef.current) < 3;

    if (!isClick) {
      if (!derivedChecked && dragPosX > max / 2) {
        isControlled
          ? onCheckedChange?.(!derivedChecked)
          : setIsToggled(!derivedChecked);
      } else if (derivedChecked && dragPosX < max / 2) {
        isControlled
          ? onCheckedChange?.(!derivedChecked)
          : setIsToggled(!derivedChecked);
      }
    } else {
      isControlled
        ? onCheckedChange?.(!derivedChecked)
        : setIsToggled(!derivedChecked);

      if (!derivedChecked) {
        setDragPosX(max);
      }
      if (derivedChecked) {
        setDragPosX(min);
      }
    }
  };

  // snap position to end or start when not held
  useEffect(() => {
    if (isHeldDown) return;
    const [min, max] = getClamps();

    if (dragPosX > max / 2) {
      setDragPosX(max);
    } else setDragPosX(min);
  }, [isHeldDown, derivedChecked]);

  return (
    <div
      ref={switchRef}
      role="button"
      onPointerDown={handlePointerDown} // click/touch
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp} // release click/touch
      onPointerCancel={handlePointerUp} // unexpected interruptions or cancellations
      id="thumb"
      className={cn(
        switchVariants({ variant, checked: derivedChecked }),
        className,
      )}
    >
      <button
        ref={thumbRef}
        className={cn(
          switchThumbVariants({
            variant,
            held: isHeldDown,
          }),
        )}
        style={{ transform: `translateX(${dragPosX}px)` }}
      />
    </div>
  );
};
