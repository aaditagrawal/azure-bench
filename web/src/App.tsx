import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  ThroughputChart,
  colorFor,
  providerName,
} from "@/components/throughput-chart";
import {
  AGGREGATION_OPTIONS,
  METRIC_OPTIONS,
  METRICS,
  compareAgainstOpenAI,
  formatRatio,
  type Aggregation,
  type Metric,
  type MetricKey,
  type ProviderComparison,
} from "@/lib/metrics";
import type { BenchmarkRecord, BenchmarkRun, DashboardResults } from "@/types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: DashboardResults }
  | { status: "error"; message: string };

type ProviderLatest = {
  provider: string;
  color: string;
  latest: BenchmarkRecord;
};

type DeploymentCallout = {
  provider: string;
  model: string;
  reasoningEffort: string;
  region?: string;
};

type ProviderAggregate = {
  provider: string;
  record: BenchmarkRecord;
};

type ProviderComparisons = Record<Aggregation, ProviderComparison | null>;
type ChartRange = "24h" | "4h" | "custom";
type CustomChartRange = {
  start: string;
  end: string;
};

type RunRow = {
  id: string;
  createdAt: string;
  provider: string;
  deployment: string;
  run: BenchmarkRun;
  prompt?: string;
  status: "ok";
};

type FailureRow = {
  id: string;
  createdAt: string;
  provider: string;
  deployment: string;
  failure: NonNullable<BenchmarkRecord["failures"]>[number];
  prompt: string;
  status: "failed";
};

type DebugRow = RunRow | FailureRow;

const DEFAULT_METRIC_KEY: MetricKey = "endToEndTps";
const DEFAULT_AGGREGATION: Aggregation = "p90";
const DEFAULT_CHART_RANGE: ChartRange = "4h";
const PRIORITY_PROVIDER = "Azure Priority";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const CHART_WINDOW_MS: Record<Exclude<ChartRange, "custom">, number> = {
  "24h": DAY_MS,
  "4h": 4 * HOUR_MS,
};

const isMetricKey = (value: string | null): value is MetricKey =>
  value !== null && value in METRICS;

const isAggregation = (value: string | null): value is Aggregation =>
  value === "mean" || value === "p90";

const isChartRange = (value: string | null): value is ChartRange =>
  value === "24h" || value === "4h" || value === "custom";

const selectedAggregationQueryParam = (): Aggregation => {
  const value = new URLSearchParams(window.location.search).get("aggregation");
  if (value === "p99") return "p90";
  return isAggregation(value) ? value : DEFAULT_AGGREGATION;
};

const selectedChartRangeQueryParam = (): ChartRange => {
  const value = new URLSearchParams(window.location.search).get("range");
  return isChartRange(value) ? value : DEFAULT_CHART_RANGE;
};

const selectedQueryParam = <T extends string>(
  key: string,
  isValid: (value: string | null) => value is T,
  fallback: T,
): T => {
  const value = new URLSearchParams(window.location.search).get(key);
  return isValid(value) ? value : fallback;
};

const priorityEnabledQueryParam = (): boolean => {
  const value = new URLSearchParams(window.location.search).get("priority");
  return value === "1" || value === "true";
};

const filterPriorityHistory = (
  history: BenchmarkRecord[],
  showPriority: boolean,
): BenchmarkRecord[] => {
  if (!showPriority) {
    return history.filter((record) => providerName(record) !== PRIORITY_PROVIDER);
  }

  const batchesWithPriority = new Set(
    history
      .filter((record) => providerName(record) === PRIORITY_PROVIDER)
      .map((record) => record.createdAt),
  );

  return history.filter((record) => batchesWithPriority.has(record.createdAt));
};

const filterChartRange = (
  history: BenchmarkRecord[],
  range: ChartRange,
  customRange: CustomChartRange,
): BenchmarkRecord[] => {
  if (history.length === 0) return history;

  if (range === "custom") {
    const startTime = parseDateTimeInput(customRange.start);
    const endTime = parseDateTimeInput(customRange.end);
    if (startTime === null && endTime === null) return history;

    return history.filter((record) => {
      const time = new Date(record.createdAt).getTime();
      if (!Number.isFinite(time)) return false;
      if (startTime !== null && time < startTime) return false;
      if (endTime !== null && time > endTime) return false;
      return true;
    });
  }

  const latestTime = history.reduce((latest, record) => {
    const time = new Date(record.createdAt).getTime();
    return Number.isFinite(time) ? Math.max(latest, time) : latest;
  }, Number.NEGATIVE_INFINITY);
  if (!Number.isFinite(latestTime)) return history;

  const cutoff = latestTime - CHART_WINDOW_MS[range];
  return history.filter((record) => new Date(record.createdAt).getTime() >= cutoff);
};

const padDatePart = (value: number): string => value.toString().padStart(2, "0");

const toDateTimeInputValue = (time: number): string => {
  const date = new Date(time);
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-") + `T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
};

const parseDateTimeInput = (value: string): number | null => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
};

const selectedCustomChartRangeQueryParam = (): CustomChartRange => {
  const params = new URLSearchParams(window.location.search);
  const start = params.get("start");
  const end = params.get("end");
  return {
    start: start && parseDateTimeInput(start) !== null ? start : "",
    end: end && parseDateTimeInput(end) !== null ? end : "",
  };
};

const latestHistoryTime = (history: BenchmarkRecord[]): number | null => {
  const latestTime = history.reduce((latest, record) => {
    const time = new Date(record.createdAt).getTime();
    return Number.isFinite(time) ? Math.max(latest, time) : latest;
  }, Number.NEGATIVE_INFINITY);
  return Number.isFinite(latestTime) ? latestTime : null;
};

const defaultCustomRangeForHistory = (
  history: BenchmarkRecord[],
): CustomChartRange => {
  const latestTime = latestHistoryTime(history) ?? Date.now();
  return {
    start: toDateTimeInputValue(latestTime - CHART_WINDOW_MS["4h"]),
    end: toDateTimeInputValue(latestTime),
  };
};

const directionLabel = (metric: Metric): string =>
  metric.better === "higher" ? "↑ Higher is better" : "↓ Lower is better";

const formatOptionalNumber = (
  value: number | undefined,
  digits = 2,
): string =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";

const formatOptionalUnit = (
  value: number | undefined,
  unit: string,
  digits = 2,
): string => {
  const formatted = formatOptionalNumber(value, digits);
  return formatted === "—" ? formatted : `${formatted} ${unit}`;
};

const formatOptionalInteger = (value: number | undefined): string =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-US")
    : "—";

const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));

const flattenDebugRows = (history: BenchmarkRecord[]): DebugRow[] =>
  history
    .flatMap((record) => {
      const provider = providerName(record);
      const runRows: DebugRow[] = record.runs.map((run) => ({
        id: record.id,
        createdAt: record.createdAt,
        provider,
        deployment: record.deployment,
        run,
        prompt: run.prompt,
        status: "ok",
      }));
      const failureRows: DebugRow[] = (record.failures ?? []).map((failure) => ({
        id: record.id,
        createdAt: record.createdAt,
        provider,
        deployment: record.deployment,
        failure,
        prompt: failure.prompt,
        status: "failed",
      }));

      return [...runRows, ...failureRows];
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
        a.provider.localeCompare(b.provider),
    );

const summarizeLatest = (history: BenchmarkRecord[]): ProviderLatest[] => {
  const byProvider = new Map<string, BenchmarkRecord>();
  for (const record of history) {
    const provider = providerName(record);
    const existing = byProvider.get(provider);
    if (
      !existing ||
      new Date(record.createdAt).getTime() >
        new Date(existing.createdAt).getTime()
    ) {
      byProvider.set(provider, record);
    }
  }

  return [...byProvider.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, latest], index) => ({
      provider,
      color: colorFor(provider, index),
      latest,
    }));
};

const regionFromDeployment = (deployment: string): string | undefined => {
  const normalized = deployment.toLowerCase().replace(/[_\s]+/g, "-");
  if (normalized.includes("southcentral-us") || normalized.includes("southcentralus")) {
    return "southcentral";
  }
  if (normalized.includes("us-east2") || normalized.includes("us-east-2")) {
    return "us-east2";
  }
  if (normalized.includes("eastus2") || normalized.includes("east-us-2")) {
    return "East US 2";
  }
  if (normalized.includes("eastus") || normalized.includes("east-us")) {
    return "East US";
  }
  if (normalized.includes("westus3") || normalized.includes("west-us-3")) {
    return "West US 3";
  }
  if (normalized.includes("westus2") || normalized.includes("west-us-2")) {
    return "West US 2";
  }
  if (normalized.includes("westus") || normalized.includes("west-us")) {
    return "West US";
  }

  return undefined;
};

const regionForRecord = (record: BenchmarkRecord): string => {
  const provider = providerName(record);
  if (provider === "OpenAI") return "OpenAI default";
  if (provider === "Azure") return regionFromDeployment(record.deployment) ?? "us-east2";
  if (provider === PRIORITY_PROVIDER) {
    return regionFromDeployment(record.deployment) ?? "southcentral";
  }
  return regionFromDeployment(record.deployment) ?? "unknown region";
};

const summarizeDeploymentCallouts = (
  latestByProvider: ProviderLatest[],
): DeploymentCallout[] =>
  latestByProvider.map(({ provider, latest }) => ({
    provider,
    model: latest.deployment,
    reasoningEffort: latest.reasoningEffort,
    region: provider === "OpenAI" ? undefined : regionForRecord(latest),
  }));

const formatDeploymentCallout = (item: DeploymentCallout): string =>
  [
    `${item.provider}: ${item.model}`,
    `${item.reasoningEffort} reasoning`,
    item.region,
  ]
    .filter(Boolean)
    .join(", ");

const summarizeByProvider = (history: BenchmarkRecord[]): ProviderAggregate[] => {
  const byProvider = new Map<string, BenchmarkRecord>();
  for (const record of history) {
    const provider = providerName(record);
    const existing = byProvider.get(provider);
    byProvider.set(provider, {
      ...record,
      provider,
      runs: [...(existing?.runs ?? []), ...record.runs],
      failures: [...(existing?.failures ?? []), ...(record.failures ?? [])],
      prompts: (existing?.prompts ?? 0) + record.prompts,
    });
  }

  return [...byProvider.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, record]) => ({ provider, record }));
};

const compareProviders = (
  metric: Metric,
  azureRecord?: BenchmarkRecord,
  openAIRecord?: BenchmarkRecord,
): ProviderComparisons | null => {
  if (!azureRecord || !openAIRecord) return null;
  const azureStats = metric.stats(azureRecord);
  const openAIStats = metric.stats(openAIRecord);
  return {
    mean: compareAgainstOpenAI(metric, azureStats?.mean, openAIStats?.mean),
    p90: compareAgainstOpenAI(metric, azureStats?.p90, openAIStats?.p90),
  };
};

function SeverityBlock({
  label,
  comparison,
}: {
  label: string;
  comparison: ProviderComparison;
}) {
  const isSlower = comparison.outcome === "slower";
  const value =
    comparison.outcome === "same"
      ? "Same"
      : `${formatRatio(comparison.ratio)}×`;
  const description =
    comparison.outcome === "same"
      ? "within 10% of OpenAI"
      : `${comparison.outcome} than OpenAI`;

  return (
    <div {...stylex.props(styles.comparison)}>
      <div
        {...stylex.props([styles.comparisonLabel, (isSlower ? styles.errorText : styles.muted)])}
      >
        {label}
      </div>
      <div
        {...stylex.props([styles.comparisonValue, (isSlower ? styles.errorValue : styles.foreground)])}
      >
        {value}
      </div>
      <div {...stylex.props([styles.smallText, (isSlower ? styles.errorDescription : styles.muted)])}>
        {description}
      </div>
    </div>
  );
}

function ExpandableDebugText({
  expanded,
  id,
  onToggle,
  text,
  tone = "muted",
}: {
  expanded: boolean;
  id: string;
  onToggle: (id: string) => void;
  text: string | undefined;
  tone?: "muted" | "error";
}) {
  if (!text) {
    return <span {...stylex.props(styles.muted)}>—</span>;
  }

  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={() => onToggle(id)}
      title={expanded ? "Click to collapse" : text}
      {...stylex.props([styles.expandableText, (expanded ? styles.expandedText : styles.collapsedText), (tone === "error" ? styles.errorText : styles.muted)])}
    >
      {text}
    </button>
  );
}

function RunsDebugView({
  history,
  state,
}: {
  history: BenchmarkRecord[];
  state: LoadState;
}) {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(
    () => new Set(),
  );
  const rows = useMemo(
    () => (state.status === "ready" ? flattenDebugRows(history) : []),
    [history, state.status],
  );
  const toggleCell = (id: string): void => {
    setExpandedCells((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div {...stylex.props(styles.page)}>
      <main {...stylex.props(styles.runsContent)}>
        <header {...stylex.props(styles.runsHeader)}>
          <div>
            <div {...stylex.props(styles.eyebrow)}>
              Database View
            </div>
            <h1 {...stylex.props(styles.runsTitle)}>
              Benchmark Runs
            </h1>
            <p {...stylex.props(styles.runsDescription)}>
              One row per prompt attempt result, ordered newest first.
            </p>
          </div>
          <div {...stylex.props(styles.runsActions)}>
            <a
              {...stylex.props(styles.outlineLink)}
              href="/"
            >
              Dashboard
            </a>
            <a
              {...stylex.props(styles.outlineLink)}
              href="/results.json"
            >
              Raw JSON
            </a>
          </div>
        </header>

        {state.status === "loading" && (
          <div {...stylex.props(styles.statusText)}>Loading runs…</div>
        )}

        {state.status === "error" && (
          <div {...stylex.props(styles.errorPanel)}>
            Failed to load results: {state.message}
          </div>
        )}

        {state.status === "ready" && (
          <div {...stylex.props(styles.tableScroll)}>
            <table {...stylex.props(styles.table)}>
              <thead {...stylex.props(styles.tableHeader)}>
                <tr data-table-head="">
                  <th>Time</th>
                  <th>Provider</th>
                  <th>Deployment</th>
                  <th>Run</th>
                  <th>Status</th>
                  <th>Out</th>
                  <th>Reason</th>
                  <th>In</th>
                  <th>Total</th>
                  <th>TTFRS</th>
                  <th>TTFT</th>
                  <th>Stream</th>
                  <th>Total</th>
                  <th>Stream</th>
                  <th>E2E</th>
                  <th>Cost</th>
                  <th>Attempts</th>
                  <th>Prompt / Error</th>
                  <th>Reasoning Summary</th>
                </tr>
              </thead>
              <tbody {...stylex.props(styles.numeric)}>
                {rows.length === 0 ? (
                  <tr>
                    <td {...stylex.props(styles.emptyTable)} colSpan={19}>
                      No benchmark rows found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => {
                    const isFailure = row.status === "failed";
                    const rowIndex =
                      row.status === "failed" ? row.failure.index : row.run.index;
                    const promptCellId = `${row.id}-${row.provider}-${rowIndex}-${index}-prompt`;
                    const summaryCellId = `${row.id}-${row.provider}-${rowIndex}-${index}-summary`;
                    const promptText =
                      row.status === "failed"
                        ? `${row.failure.message}\n${row.failure.prompt}`
                        : row.prompt;
                    return (
                      <tr
                        key={`${row.id}-${row.provider}-${row.status}-${rowIndex}-${index}`}
                        {...stylex.props([styles.tableRow, (isFailure ? styles.failedRow : styles.stripedRow)])}
                      >
                        <td {...stylex.props(styles.timestampCell)}>
                          {formatDateTime(row.createdAt)}
                        </td>
                        <td {...stylex.props(styles.foregroundCell)}>
                          {row.provider}
                        </td>
                        <td {...stylex.props(styles.mutedCell)}>
                          {row.deployment}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "failed" ? row.failure.index : row.run.index}
                        </td>
                        <td
                          {...stylex.props([styles.cell, (isFailure ? styles.errorText : styles.successText)])}
                        >
                          {row.status}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalInteger(row.run.outputTokens)
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalInteger(row.run.reasoningTokens)
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalInteger(row.run.inputTokens)
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalInteger(row.run.totalTokens)
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(
                                row.run.timeToFirstReasoningSummarySeconds,
                                "s",
                              )
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(
                                row.run.timeToFirstTokenSeconds,
                                "s",
                              )
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(row.run.streamSeconds, "s")
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(row.run.totalSeconds, "s")
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(row.run.streamTps, "tps")
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? formatOptionalUnit(row.run.endToEndTps, "tps")
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "ok"
                            ? `$${row.run.costUsd.toFixed(6)}`
                            : "—"}
                        </td>
                        <td {...stylex.props(styles.cell)}>
                          {row.status === "failed"
                            ? row.failure.attempts
                            : (row.run.attempts ?? 1)}
                        </td>
                        <td {...stylex.props(styles.promptCell)}>
                          <ExpandableDebugText
                            expanded={expandedCells.has(promptCellId)}
                            id={promptCellId}
                            onToggle={toggleCell}
                            text={promptText}
                            tone={row.status === "failed" ? "error" : "muted"}
                          />
                        </td>
                        <td {...stylex.props(styles.reasoningCell)}>
                          <ExpandableDebugText
                            expanded={expandedCells.has(summaryCellId)}
                            id={summaryCellId}
                            onToggle={toggleCell}
                            text={
                              row.status === "ok"
                                ? row.run.reasoningSummary
                                : undefined
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [metricKey, setMetricKey] = useState<MetricKey>(() =>
    selectedQueryParam("metric", isMetricKey, DEFAULT_METRIC_KEY),
  );
  const [aggregation, setAggregation] = useState<Aggregation>(() =>
    selectedAggregationQueryParam(),
  );
  const [chartRange, setChartRange] = useState<ChartRange>(
    selectedChartRangeQueryParam,
  );
  const [customChartRange, setCustomChartRange] = useState<CustomChartRange>(
    selectedCustomChartRangeQueryParam,
  );
  const showPriority = useMemo(() => priorityEnabledQueryParam(), []);
  const hasUserSelectedOption = useRef(false);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const metric = METRICS[metricKey];
  const metricOptions = useMemo(
    () =>
      METRIC_OPTIONS.map((m) => ({
        value: m.key,
        label: m.shortLabel,
        tooltip: m.description,
      })),
    [],
  );
  const aggregationOptions = useMemo(
    () =>
      AGGREGATION_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        tooltip: option.description,
      })),
    [],
  );
  const chartRangeOptions = useMemo(
    () => [
      {
        value: "24h" as const,
        label: "1 day",
        tooltip: "Show the latest 24 hours of benchmark history.",
      },
      {
        value: "4h" as const,
        label: "4 hours",
        tooltip: "Show the latest 4 hours of benchmark history.",
      },
      {
        value: "custom" as const,
        label: "Custom",
        tooltip: "Show a custom benchmark time range.",
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/results.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        return (await response.json()) as DashboardResults;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Unknown";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasUserSelectedOption.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set("metric", metricKey);
    url.searchParams.set("aggregation", aggregation);
    url.searchParams.set("range", chartRange);
    if (chartRange === "custom") {
      if (customChartRange.start) {
        url.searchParams.set("start", customChartRange.start);
      } else {
        url.searchParams.delete("start");
      }
      if (customChartRange.end) {
        url.searchParams.set("end", customChartRange.end);
      } else {
        url.searchParams.delete("end");
      }
    } else {
      url.searchParams.delete("start");
      url.searchParams.delete("end");
    }
    window.history.replaceState(null, "", url);
  }, [metricKey, aggregation, chartRange, customChartRange]);

  const rawHistory =
    state.status === "ready" ? state.data.history : ([] as BenchmarkRecord[]);
  const history = useMemo(
    () => filterPriorityHistory(rawHistory, showPriority),
    [rawHistory, showPriority],
  );
  const chartHistory = useMemo(
    () => filterChartRange(history, chartRange, customChartRange),
    [history, chartRange, customChartRange],
  );
  const latestByProvider = useMemo(
    () => summarizeLatest(chartHistory),
    [chartHistory],
  );
  const deploymentCallout = useMemo(
    () =>
      summarizeDeploymentCallouts(latestByProvider)
        .map(formatDeploymentCallout)
        .join(" | "),
    [latestByProvider],
  );
  const headlineComparisons = useMemo(() => {
    const providerHistory = summarizeByProvider(chartHistory);
    const azure = providerHistory.find((entry) => entry.provider === "Azure");
    const openAI = providerHistory.find(
      (entry) => entry.provider === "OpenAI",
    );
    return compareProviders(metric, azure?.record, openAI?.record);
  }, [chartHistory, metric]);
  const headlineIsSlower =
    headlineComparisons?.mean?.outcome === "slower" ||
    headlineComparisons?.p90?.outcome === "slower";
  const headlineStyle = (headlineIsSlower ? styles.slowerHeadline : styles.headline);

  if (window.location.pathname === "/runs") {
    return <RunsDebugView history={history} state={state} />;
  }

  return (
    <div {...stylex.props(styles.page)}>
      <main {...stylex.props(styles.dashboardContent)}>
        <header {...stylex.props(styles.dashboardHeader)}>
          <h1 {...stylex.props(styles.dashboardTitle)}>
            Azure Sucked* (at hosting OpenAI models)
          </h1>
          <div {...stylex.props(styles.introduction)}>
            <p>
              * We{" "}
              <a
                {...stylex.props(styles.sourceLink)}
                href="https://x.com/theo/status/2014863266888233193"
                rel="noreferrer"
                target="_blank"
              >
                wanted to use Azure
              </a>{" "}
              for inference. This benchmark lit some fires and{" "}
              <a
                {...stylex.props(styles.sourceLink)}
                href="https://x.com/theo/status/2050305813894648289"
                rel="noreferrer"
                target="_blank"
              >
                now you can!
              </a>
            </p>
          </div>
        </header>

        <Card className={stylex.props(styles.clip).className}>
          {(headlineComparisons?.mean || headlineComparisons?.p90) && (
            <div {...stylex.props(headlineStyle)}>
              <div
                {...stylex.props([styles.comparisonGrid, (headlineComparisons.mean && headlineComparisons.p90 ? styles.twoComparisons : styles.oneComparison)])}
              >
                {headlineComparisons.mean && (
                  <SeverityBlock
                    label="On average"
                    comparison={headlineComparisons.mean}
                  />
                )}
                {headlineComparisons.p90 && (
                  <SeverityBlock
                    label="Worst 10% (P90)"
                    comparison={headlineComparisons.p90}
                  />
                )}
              </div>
            </div>
          )}
          <div {...stylex.props(styles.toolbar)}>
            <div {...stylex.props(styles.controls)}>
              <ToggleGroup
                ariaLabel="Metric"
                value={metricKey}
                onValueChange={(value) => {
                  hasUserSelectedOption.current = true;
                  setMetricKey(value);
                }}
                options={metricOptions}
              />
              <ToggleGroup
                ariaLabel="Aggregation"
                value={aggregation}
                onValueChange={(value) => {
                  hasUserSelectedOption.current = true;
                  setAggregation(value);
                }}
                options={aggregationOptions}
              />
              <ToggleGroup
                ariaLabel="Chart range"
                value={chartRange}
                onValueChange={(value) => {
                  hasUserSelectedOption.current = true;
                  if (
                    value === "custom" &&
                    !customChartRange.start &&
                    !customChartRange.end
                  ) {
                    setCustomChartRange(defaultCustomRangeForHistory(history));
                  }
                  setChartRange(value);
                }}
                options={chartRangeOptions}
              />
              {chartRange === "custom" && (
                <div {...stylex.props(styles.dateRange)}>
                  <label {...stylex.props(styles.dateLabel)}>
                    <span {...stylex.props(styles.dateCaption)}>From</span>
                    <input
                      type="datetime-local"
                      value={customChartRange.start}
                      onChange={(event) => {
                        hasUserSelectedOption.current = true;
                        setCustomChartRange((current) => ({
                          ...current,
                          start: event.target.value,
                        }));
                      }}
                      {...stylex.props(styles.dateInput)}
                    />
                  </label>
                  <label {...stylex.props(styles.dateLabel)}>
                    <span {...stylex.props(styles.dateCaption)}>To</span>
                    <input
                      type="datetime-local"
                      value={customChartRange.end}
                      onChange={(event) => {
                        hasUserSelectedOption.current = true;
                        setCustomChartRange((current) => ({
                          ...current,
                          end: event.target.value,
                        }));
                      }}
                      {...stylex.props(styles.dateInput)}
                    />
                  </label>
                </div>
              )}
            </div>
            <div {...stylex.props(styles.legendArea)}>
              <div {...stylex.props(styles.legend)}>
                {latestByProvider.length === 0 ? (
                  <span {...stylex.props(styles.caption)}>No providers yet</span>
                ) : (
                  latestByProvider.map((entry) => {
                    const dim =
                      hoveredProvider !== null &&
                      hoveredProvider !== entry.provider;
                    return (
                      <button
                        type="button"
                        key={entry.provider}
                        onMouseEnter={() =>
                          setHoveredProvider(entry.provider)
                        }
                        onMouseLeave={() => setHoveredProvider(null)}
                        onFocus={() => setHoveredProvider(entry.provider)}
                        onBlur={() => setHoveredProvider(null)}
                        {...stylex.props([styles.providerButton, (dim ? styles.dimmedProvider : styles.visibleProvider)])}
                      >
                        <span
                          {...stylex.props(styles.providerDot)}
                          style={{ background: entry.color }}
                        />
                        {entry.provider}
                      </button>
                    );
                  })
                )}
              </div>
              <span {...stylex.props(styles.caption)}>{directionLabel(metric)}</span>
            </div>
          </div>
          <div {...stylex.props(styles.chartPadding)}>
            <ThroughputChart
              records={chartHistory}
              metric={metric}
              aggregation={aggregation}
              hoveredProvider={hoveredProvider}
              onHoverChange={setHoveredProvider}
            />
          </div>
        </Card>

        {deploymentCallout && (
          <p {...stylex.props(styles.deploymentCaption)}>
            {deploymentCallout}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
