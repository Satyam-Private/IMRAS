
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * Clean JS version of Calendar component
 * - removed versioned imports
 * - removed TS-only types
 * - provides sensible classNames mapping while preserving your layout intent
 * - keeps DayPicker props passthrough for full flexibility
 */
export function Calendar({
  className,
  classNames = {},
  showOutsideDays = true,
  ...props
}) {
  const mergedClassNames = {
    months: "flex flex-col sm:flex-row gap-2",
    month: "space-y-2",
    caption: "flex items-center justify-between",
    caption_label: "text-sm font-medium",
    nav: "flex items-center gap-2",
    nav_button: cn(
      buttonVariants({ variant: "outline" }),
      "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
    nav_button_previous: undefined,
    nav_button_next: undefined,
    table: "w-full border-collapse",
    head_row: "flex",
    head_cell: "w-12 text-center text-xs text-muted-foreground",
    row: "flex",
    cell:
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
    day: cn(buttonVariants({ variant: "ghost" }), "size-8 p-0 font-normal aria-selected:opacity-100"),
    day_range_start: undefined,
    day_range_end: undefined,
    day_selected: undefined,
    day_today: undefined,
    day_outside: undefined,
    day_disabled: undefined,
    day_range_middle: undefined,
    day_hidden: undefined,
    // allow consumer to override any of the above keys
    ...classNames,
  };

  const components = {
    IconLeft: ({ className: c, ...p }) => <ChevronLeft className={cn("size-4", c)} {...p} />,
    IconRight: ({ className: c, ...p }) => <ChevronRight className={cn("size-4", c)} {...p} />,
    ...(props.components || {}),
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={mergedClassNames}
      components={components}
      {...props}
    />
  );
}
