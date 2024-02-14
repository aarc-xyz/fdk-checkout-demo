import "./Tooltip.scss";
import cx from "classnames";
import { useCallback, useState, useRef, MouseEvent, ReactNode, useEffect } from "react";
import { IS_TOUCH } from "config/env";
import { computePosition, flip, size } from "@floating-ui/dom";
import { DEFAULT_TOOLTIP_POSITION } from "config/ui";
import { TOOLTIP_CLOSE_DELAY, TOOLTIP_OPEN_DELAY } from "config/ui";

export type TooltipPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

type Props = {
  handle: ReactNode;
  renderContent: () => ReactNode;
  position?: TooltipPosition;
  trigger?: string;
  className?: string;
  disableHandleStyle?: boolean;
  handleClassName?: string;
  isHandlerDisabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  maxAllowedWidth?: number;
};

export default function Tooltip({
  handle,
  renderContent,
  position = DEFAULT_TOOLTIP_POSITION,
  trigger = "hover",
  className,
  disableHandleStyle,
  handleClassName,
  isHandlerDisabled,
  openDelay = TOOLTIP_OPEN_DELAY,
  closeDelay = TOOLTIP_CLOSE_DELAY,
  maxAllowedWidth, // in px
}: Props) {
  const [visible, setVisible] = useState(false);
  const intervalCloseRef = useRef<ReturnType<typeof setTimeout> | null>();
  const intervalOpenRef = useRef<ReturnType<typeof setTimeout> | null>();
  const handlerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [computedPlacement, setComputedPlacement] = useState<TooltipPosition | undefined>(position);

  useEffect(() => {
    async function computeTooltipPlacement() {
      if (!handlerRef.current || !popupRef.current) return;

      const { placement } = await computePosition(handlerRef.current, popupRef.current, {
        middleware: [
          flip({ fallbackStrategy: "initialPlacement" }),
          maxAllowedWidth
            ? size({
                padding: 10,
                apply({ availableWidth, elements }) {
                  Object.assign(elements.floating.style, {
                    minWidth: `${Math.min(availableWidth, maxAllowedWidth)}px`,
                    maxWidth: `${maxAllowedWidth}px`,
                  });
                },
              })
            : undefined,
        ].filter(Boolean),
        placement: position,
      });
      setComputedPlacement(placement);
    }

    computeTooltipPlacement();
  }, [visible, position, maxAllowedWidth]);

  const onMouseEnter = useCallback(() => {
    if (trigger !== "hover" || IS_TOUCH) return;
    if (intervalCloseRef.current) {
      clearInterval(intervalCloseRef.current);
      intervalCloseRef.current = null;
    }
    if (!intervalOpenRef.current) {
      intervalOpenRef.current = setTimeout(() => {
        setVisible(true);
        intervalOpenRef.current = null;
      }, openDelay);
    }
  }, [setVisible, trigger, openDelay]);

  const onMouseClick = useCallback(() => {
    if (trigger !== "click" && !IS_TOUCH) return;
    if (intervalCloseRef.current) {
      clearInterval(intervalCloseRef.current);
      intervalCloseRef.current = null;
    }
    if (intervalOpenRef.current) {
      clearInterval(intervalOpenRef.current);
      intervalOpenRef.current = null;
    }

    setVisible(true);
  }, [setVisible, trigger]);

  const onMouseLeave = useCallback(() => {
    intervalCloseRef.current = setTimeout(() => {
      setVisible(false);
      intervalCloseRef.current = null;
    }, closeDelay);
    if (intervalOpenRef.current) {
      clearInterval(intervalOpenRef.current);
      intervalOpenRef.current = null;
    }
  }, [setVisible, closeDelay]);

  const onHandleClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  return (
    <span
      className={cx("Tooltip", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
    >
      <span
        ref={handlerRef}
        onClick={onHandleClick}
        className={cx({ "Tooltip-handle": !disableHandleStyle }, [handleClassName], { active: visible })}
      >
        {/* For onMouseLeave to work on disabled button https://github.com/react-component/tooltip/issues/18#issuecomment-411476678 */}
        {isHandlerDisabled ? <div className="Tooltip-disabled-wrapper">{handle}</div> : <>{handle}</>}
      </span>
      {visible && (
        <div ref={popupRef} className={cx(["Tooltip-popup", computedPlacement])}>
          {renderContent()}
        </div>
      )}
    </span>
  );
}
