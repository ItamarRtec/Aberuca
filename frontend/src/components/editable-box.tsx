"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type BoxLayout = {
  height: number | null;
  width: number | null;
  x: number;
  y: number;
};

type EditableBoxProps = {
  children: ReactNode;
  className?: string;
  draggable?: boolean;
  id: string;
  lockAspect?: boolean;
  minHeight?: number;
  minWidth?: number;
  resizable?: boolean;
};

const DEFAULT_LAYOUT: BoxLayout = {
  height: null,
  width: null,
  x: 0,
  y: 0,
};

const storageKey = (id: string) => `aberuca-layout-${id}`;

function readLayout(id: string): BoxLayout {
  try {
    const saved = window.localStorage.getItem(storageKey(id));
    return saved ? { ...DEFAULT_LAYOUT, ...JSON.parse(saved) } : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function EditableBox({
  children,
  className = "",
  draggable = false,
  id,
  lockAspect = false,
  minHeight = 48,
  minWidth = 160,
  resizable = false,
}: EditableBoxProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [layout, setLayout] = useState<BoxLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLayout(readLayout(id));
      setEditing(
        document.documentElement.dataset.layoutEditing === "true",
      );
    });

    const onMode = () => {
      setEditing(
        document.documentElement.dataset.layoutEditing === "true",
      );
    };

    const onReset = () => {
      window.localStorage.removeItem(storageKey(id));
      setLayout(DEFAULT_LAYOUT);
    };

    window.addEventListener("aberuca-layout-mode", onMode);
    window.addEventListener("aberuca-layout-reset", onReset);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("aberuca-layout-mode", onMode);
      window.removeEventListener("aberuca-layout-reset", onReset);
    };
  }, [id]);

  const save = (next: BoxLayout) => {
    setLayout(next);
    window.localStorage.setItem(storageKey(id), JSON.stringify(next));
  };

  const beginMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!editing && !draggable) return;
    if ((event.target as HTMLElement).closest("a, button, input, select")) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = layout;

    const move = (pointerEvent: PointerEvent) => {
      setLayout({
        ...origin,
        x: origin.x + pointerEvent.clientX - startX,
        y: origin.y + pointerEvent.clientY - startY,
      });
    };

    const end = (pointerEvent: PointerEvent) => {
      const next = {
        ...origin,
        x: origin.x + pointerEvent.clientX - startX,
        y: origin.y + pointerEvent.clientY - startY,
      };
      save(next);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end, { once: true });
  };

  const beginResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const element = elementRef.current;
    if (!element) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = element.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = layout;

    const resize = (pointerEvent: PointerEvent) => {
      const width = Math.max(
        minWidth,
        bounds.width + pointerEvent.clientX - startX,
      );
      const height = lockAspect
        ? width
        : Math.max(minHeight, bounds.height + pointerEvent.clientY - startY);

      setLayout({
        ...origin,
        width,
        height,
      });
    };

    const end = (pointerEvent: PointerEvent) => {
      const width = Math.max(
        minWidth,
        bounds.width + pointerEvent.clientX - startX,
      );
      const height = lockAspect
        ? width
        : Math.max(minHeight, bounds.height + pointerEvent.clientY - startY);
      const next = {
        ...origin,
        width,
        height,
      };
      save(next);
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", end);
    };

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", end, { once: true });
  };

  return (
    <div
      ref={elementRef}
      className={`editable-box${editing ? " is-editing" : ""}${draggable ? " is-draggable" : ""}${resizable ? " is-resizable" : ""} ${className}`}
      data-editable-label={id}
      onPointerDown={beginMove}
      style={{
        height: layout.height ?? undefined,
        transform: `translate3d(${layout.x}px, ${layout.y}px, 0)`,
        width: layout.width ?? undefined,
      }}
    >
      {children}
      {editing || resizable ? (
        <button
          className="editable-box__resize"
          type="button"
          aria-label={`Cambiar tamaño de ${id}`}
          onPointerDown={beginResize}
        />
      ) : null}
    </div>
  );
}
