import * as React from "react";
import { ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";

import { cn } from "./utils";

// small theme -> selector mapping (adjust to your CSS theme selectors)
const THEMES = {
  light: "",
  dark: '[data-theme="dark"]',
};

// Chart context to pass config to tooltip/legend children
const ChartContext = React.createContext(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return ctx;
}

/**
 * ChartContainer
 * Props:
 *  - id (optional)
 *  - config: object describing each series (colors, labels, icons, theme map)
 *  - children: should include recharts components inside a ResponsiveContainer
 */
export function ChartContainer({ id, className, children, config = {}, ...props }) {
  const uniqueId = React.useId ? React.useId() : String(Math.random()).slice(2);
  const chartId = `chart-${(id || uniqueId).replace(/[:#\s]/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // keep your original styling hooks
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * ChartStyle
 * Renders CSS variables for series colors per theme.
 * config format: { seriesKey: { color: '#hex' } } OR { seriesKey: { theme: { light: '#', dark:'#' } } }
 */
export function ChartStyle({ id, config = {} }) {
  // flatten config entries that have either color or theme
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => (cfg && (cfg.color || cfg.theme))
  );

  if (colorConfig.length === 0) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const body = colorConfig
        .map(([key, itemCfg]) => {
          const color = itemCfg.theme ? itemCfg.theme[theme] : itemCfg.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");
      if (!body) return null;
      // prefix may be empty for default/light
      return `${prefix} [data-chart=${id}] {\n${body}\n}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!css) return null;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* Simple Tooltip wrapper (re-exports the Recharts Tooltip for convenience) */
export const ChartTooltip = RechartsTooltip;

/**
 * ChartTooltipContent
 * A customizable tooltip renderer to be used as <Tooltip content={<ChartTooltipContent .../>} />
 *
 * Props supported:
 *  - active, payload (from Recharts)
 *  - indicator: "dot" | "line" | "dashed"
 *  - hideLabel, hideIndicator, labelFormatter, formatter, nameKey, labelKey
 */
export function ChartTooltipContent({
  active,
  payload = [],
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config = {} } = useChart();

  if (!active || !payload || payload.length === 0) return null;

  // helper to get label text for payload item
  const getItemConfig = (item, key) => getPayloadConfigFromPayload(config, item, key);

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {/* Label (top) */}
      {!hideLabel && label && (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          // Recharts payload shape: { dataKey, name, value, color, payload: { ... } }
          const key = nameKey || item.name || item.dataKey || "value";
          const itemConfig = getItemConfig(item, key);
          const indicatorColor = color || item.color || (item.payload && item.payload.fill) || itemConfig?.color;

          // formatted value rendering
          const formattedValue =
            typeof formatter === "function"
              ? formatter(item.value, item.name, item, index, item.payload)
              : item.value;

          return (
            <div
              key={item.dataKey != null ? item.dataKey : index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {/* indicator */}
              {!hideIndicator && (
                <div
                  className={cn("shrink-0 rounded-[2px]")}
                  style={{
                    width: indicator === "line" ? 8 : 10,
                    height: indicator === "dot" ? 10 : 6,
                    backgroundColor: indicatorColor || "transparent",
                    border: indicator === "dashed" ? `1.5px dashed ${indicatorColor || "currentColor"}` : "none",
                  }}
                />
              )}

              {/* label + value */}
              <div className="flex flex-1 justify-between leading-none items-center">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">{itemConfig?.label || item.name || item.dataKey}</span>
                </div>

                <div className="text-foreground font-mono font-medium tabular-nums">
                  {formattedValue == null ? "-" : (typeof formattedValue === "number" ? formattedValue.toLocaleString() : formattedValue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Legend re-export */
export const ChartLegend = RechartsLegend;

/**
 * ChartLegendContent
 * Use as content renderer for Recharts Legend (e.g. <Legend content={<ChartLegendContent .../>} />)
 *
 * Props:
 *  - payload: array from Recharts Legend
 *  - hideIcon: boolean
 *  - verticalAlign (top|bottom) only used for spacing classes here
 *  - nameKey: mapping key
 */
export function ChartLegendContent({ className, hideIcon = false, payload = [], verticalAlign = "bottom", nameKey }) {
  const { config = {} } = useChart();

  if (!payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, idx) => {
        const key = nameKey || item.dataKey || `value-${idx}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value != null ? String(item.value) : idx}
            className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}
          >
            {/* icon or color box */}
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color || itemConfig?.color || "transparent" }}
              />
            )}

            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Helper: find series config for a given payload item.
 * - config: the chart config object
 * - payload: element from Recharts payload (may have dataKey, name, payload...)
 * - key: labelKey/nameKey fallback
 *
 * Returns config entry or undefined
 */
function getPayloadConfigFromPayload(config = {}, payloadItem = {}, key = "value") {
  if (!payloadItem || typeof payloadItem !== "object") return undefined;

  // payloadItem.payload often contains the original data row
  const inner = payloadItem.payload && typeof payloadItem.payload === "object" ? payloadItem.payload : null;

  // prefer explicit name/dataKey mapping; fall back to provided key
  const possibleKeys = [payloadItem.dataKey, payloadItem.name, key].filter(Boolean);

  for (const k of possibleKeys) {
    if (k && k in config) {
      return config[k];
    }
  }

  // last resort: return config[key] if present
  return config[key];
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
