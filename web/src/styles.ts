import * as stylex from "@stylexjs/stylex";

// Existing utility groups translated in their original cascade order.
export const styles = stylex.create({
  comparison: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 2)",
  },
  comparisonLabel: {
    fontSize: "11px",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    "--tw-tracking": ".14em",
    letterSpacing: ".14em",
    textTransform: "uppercase",
  },
  errorText: {
    color: "var(--color-red-200)",
  },
  muted: {
    color: "var(--color-muted)",
  },
  comparisonValue: {
    fontFamily: "var(--font-mono)",
    fontSize: {
      default: "var(--text-4xl)",
      "@media (min-width:48rem)": "var(--text-5xl)",
    },
    lineHeight: {
      default: "1",
      "@media (min-width:48rem)": "var(--tw-leading,var(--text-5xl--line-height))",
    },
    "--tw-leading": "1",
    "--tw-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--tw-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
  },
  errorValue: {
    color: "var(--color-red-100)",
  },
  foreground: {
    color: "var(--color-foreground)",
  },
  smallText: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  errorDescription: {
    color: {
      default: "#ffcacacc",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-200) 80%,transparent)",
    },
  },
  expandableText: {
    display: "block",
    width: "100%",
    textAlign: "left",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
  },
  expandedText: {
    cursor: "zoom-out",
    "--tw-leading": "var(--leading-relaxed)",
    lineHeight: "var(--leading-relaxed)",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
  collapsedText: {
    cursor: "zoom-in",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  page: {
    minHeight: "100dvh",
    backgroundColor: "var(--color-background)",
  },
  runsContent: {
    marginInline: "auto",
    width: "100%",
    maxWidth: "1500px",
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 6)",
    },
    paddingBlock: "calc(var(--spacing) * 8)",
  },
  runsHeader: {
    marginBottom: "calc(var(--spacing) * 6)",
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width:48rem)": "row",
    },
    gap: "calc(var(--spacing) * 3)",
    borderBottomStyle: "var(--tw-border-style)",
    borderBottomWidth: "1px",
    borderColor: "var(--color-border)",
    paddingBottom: "calc(var(--spacing) * 5)",
    alignItems: {
      default: null,
      "@media (min-width:48rem)": "flex-end",
    },
    justifyContent: {
      default: null,
      "@media (min-width:48rem)": "space-between",
    },
  },
  eyebrow: {
    marginBottom: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    "--tw-tracking": "var(--tracking-wider)",
    letterSpacing: "var(--tracking-wider)",
    color: "var(--color-muted)",
    textTransform: "uppercase",
  },
  runsTitle: {
    fontSize: "var(--text-2xl)",
    lineHeight: "var(--tw-leading,var(--text-2xl--line-height))",
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    "--tw-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
  },
  runsDescription: {
    marginTop: "calc(var(--spacing) * 1)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--color-muted)",
  },
  runsActions: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
  },
  outlineLink: {
    borderRadius: ".25rem",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-border)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-neutral-600)",
      },
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    color: {
      default: "var(--color-muted)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  statusText: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--color-muted)",
  },
  errorPanel: {
    borderRadius: ".25rem",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "#fb2c364d",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 30%,transparent)",
    },
    backgroundColor: {
      default: "#fb2c361a",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 10%,transparent)",
    },
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 3)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--color-red-200)",
  },
  tableScroll: {
    overflowX: "auto",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
  },
  table: {
    width: "100%",
    minWidth: "1520px",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
  },
  tableHeader: {
    position: "sticky",
    top: "calc(var(--spacing) * 0)",
    backgroundColor: "var(--color-card)",
    fontSize: "11px",
    "--tw-tracking": "var(--tracking-wider)",
    letterSpacing: "var(--tracking-wider)",
    color: "var(--color-muted)",
    textTransform: "uppercase",
  },
  numeric: {
    fontFamily: "var(--font-mono)",
    "--tw-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
  },
  emptyTable: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 6)",
    textAlign: "center",
    color: "var(--color-muted)",
  },
  tableRow: {
    borderBottomStyle: "var(--tw-border-style)",
    borderBottomWidth: "1px",
    borderColor: {
      default: "#1a1a1ab3",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-border) 70%,transparent)",
    },
    verticalAlign: "top",
  },
  failedRow: {
    backgroundColor: {
      default: "#fb2c360f",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 6%,transparent)",
    },
  },
  stripedRow: {
    backgroundColor: {
      default: null,
      ":nth-child(odd)": "#ffffff04",
      "@supports (color:color-mix(in lab,red,red))": {
        default: null,
        ":nth-child(odd)": "color-mix(in oklab,var(--color-white) 1.5%,transparent)",
      },
    },
  },
  timestampCell: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
    whiteSpace: "nowrap",
    color: "var(--color-muted)",
  },
  foregroundCell: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: "var(--color-foreground)",
  },
  mutedCell: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
    color: "var(--color-muted)",
  },
  cell: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  successText: {
    color: "var(--color-emerald-200)",
  },
  promptCell: {
    width: "360px",
    maxWidth: "360px",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontFamily: "var(--font-sans)",
  },
  reasoningCell: {
    width: "420px",
    maxWidth: "420px",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontFamily: "var(--font-sans)",
  },
  slowerHeadline: {
    position: "relative",
    borderBottomStyle: "var(--tw-border-style)",
    borderBottomWidth: "1px",
    borderColor: {
      default: "#fb2c3640",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 25%,transparent)",
    },
    "--tw-gradient-position": "to bottom in oklab",
    backgroundImage: "linear-gradient(var(--tw-gradient-stops))",
    "--tw-gradient-from": {
      default: "#fb2c3621",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab, var(--color-red-500) 13%, transparent)",
    },
    "--tw-gradient-stops":
      "var(--tw-gradient-via-stops,var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
    "--tw-gradient-to": {
      default: "#fb2c360f",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab, var(--color-red-500) 6%, transparent)",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 6)",
    },
    paddingBlock: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 6)",
    },
  },
  headline: {
    position: "relative",
    borderBottomStyle: "var(--tw-border-style)",
    borderBottomWidth: "1px",
    borderColor: "var(--color-border)",
    backgroundColor: {
      default: "#0a0a0a80",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-neutral-950) 50%,transparent)",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 6)",
    },
    paddingBlock: {
      default: "calc(var(--spacing) * 5)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 6)",
    },
  },
  dashboardContent: {
    marginInline: "auto",
    width: "100%",
    maxWidth: "var(--container-5xl)",
    paddingInline: "calc(var(--spacing) * 6)",
    paddingBlock: {
      default: "calc(var(--spacing) * 12)",
      "@media (min-width:48rem)": "calc(var(--spacing) * 20)",
    },
  },
  dashboardHeader: {
    marginBottom: "calc(var(--spacing) * 10)",
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 1.5)",
  },
  dashboardTitle: {
    fontSize: {
      default: "var(--text-2xl)",
      "@media (min-width:48rem)": "var(--text-3xl)",
    },
    lineHeight: {
      default: "var(--tw-leading,var(--text-2xl--line-height))",
      "@media (min-width:48rem)": "var(--tw-leading,var(--text-3xl--line-height))",
    },
    "--tw-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    "--tw-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
  },
  introduction: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width:40rem)": "row",
    },
    gap: "calc(var(--spacing) * 2)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--color-muted)",
    alignItems: {
      default: null,
      "@media (min-width:40rem)": "center",
    },
    justifyContent: {
      default: null,
      "@media (min-width:40rem)": "space-between",
    },
  },
  sourceLink: {
    textDecorationLine: "underline",
    textDecorationColor: {
      default: "#73737399",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-muted) 60%,transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
    WebkitTextDecorationColor: {
      default: null,
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-muted) 60%,transparent)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
    textUnderlineOffset: "4px",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    color: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
  },
  clip: {
    overflow: "hidden",
  },
  comparisonGrid: {
    display: "grid",
    columnGap: "calc(var(--spacing) * 10)",
    rowGap: "calc(var(--spacing) * 6)",
  },
  twoComparisons: {
    gridTemplateColumns: {
      default: "repeat(1,minmax(0,1fr))",
      "@media (min-width:40rem)": "repeat(2,minmax(0,1fr))",
    },
  },
  oneComparison: {
    gridTemplateColumns: "repeat(1,minmax(0,1fr))",
  },
  toolbar: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width:40rem)": "row",
    },
    gap: "calc(var(--spacing) * 3)",
    borderBottomStyle: "var(--tw-border-style)",
    borderBottomWidth: "1px",
    borderColor: "var(--color-border)",
    paddingInline: "calc(var(--spacing) * 5)",
    paddingBlock: "calc(var(--spacing) * 4)",
    alignItems: {
      default: null,
      "@media (min-width:40rem)": "center",
    },
    justifyContent: {
      default: null,
      "@media (min-width:40rem)": "space-between",
    },
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  dateRange: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-card)",
    padding: "calc(var(--spacing) * 1)",
  },
  dateLabel: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
  },
  dateCaption: {
    paddingInline: "calc(var(--spacing) * 1)",
    fontSize: "11px",
    color: "var(--color-muted)",
  },
  dateInput: {
    height: "calc(var(--spacing) * 7)",
    borderRadius: ".25rem",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: {
      default: "var(--color-border)",
      ":focus": "var(--color-neutral-500)",
    },
    backgroundColor: "var(--color-background)",
    paddingInline: "calc(var(--spacing) * 2)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    color: "var(--color-foreground)",
    colorScheme: "dark",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    "--tw-outline-style": "none",
    outlineStyle: "none",
  },
  legendArea: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: {
      default: "space-between",
      "@media (min-width:40rem)": "flex-end",
    },
    columnGap: "calc(var(--spacing) * 5)",
    rowGap: "calc(var(--spacing) * 2)",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: "calc(var(--spacing) * 3)",
    rowGap: "calc(var(--spacing) * 2)",
  },
  caption: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    color: "var(--color-muted)",
  },
  providerButton: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: ".25rem",
    paddingInline: "calc(var(--spacing) * 1.5)",
    paddingBlock: "calc(var(--spacing) * .5)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    color: "var(--color-foreground)",
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
    backgroundColor: {
      default: null,
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-neutral-900)",
      },
    },
  },
  dimmedProvider: {
    opacity: ".4",
  },
  visibleProvider: {
    opacity: "1",
  },
  providerDot: {
    display: "inline-block",
    height: "calc(var(--spacing) * 1.5)",
    width: "calc(var(--spacing) * 1.5)",
    borderRadius: "3.40282e38px",
  },
  chartPadding: {
    paddingInline: "calc(var(--spacing) * 2)",
    paddingTop: "calc(var(--spacing) * 2)",
    paddingBottom: "calc(var(--spacing) * 3)",
  },
  deploymentCaption: {
    marginTop: "calc(var(--spacing) * 3)",
    textAlign: "center",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--leading-relaxed)",
    "--tw-leading": "var(--leading-relaxed)",
    color: "var(--color-muted)",
  },
  slowerTooltip: {
    borderColor: {
      default: "#fb2c3633",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 20%,transparent)",
    },
    backgroundColor: {
      default: "#fb2c361a",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-red-500) 10%,transparent)",
    },
    color: "var(--color-red-300)",
  },
  fasterTooltip: {
    borderColor: {
      default: "#00bb7f33",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-emerald-500) 20%,transparent)",
    },
    backgroundColor: {
      default: "#00bb7f1a",
      "@supports (color:color-mix(in lab,red,red))":
        "color-mix(in oklab,var(--color-emerald-500) 10%,transparent)",
    },
    color: "var(--color-emerald-300)",
  },
  tooltip: {
    minWidth: "200px",
    overflow: "hidden",
    borderRadius: "var(--radius-md)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-card)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    "--tw-shadow":
      "0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a)",
    boxShadow:
      "var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)",
  },
  tooltipDate: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingTop: "calc(var(--spacing) * 2)",
    paddingBottom: "calc(var(--spacing) * 1.5)",
    color: "var(--color-muted)",
  },
  tooltipStack: {
    "--stack-space": "calc(var(--spacing) * 1)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBottom: "calc(var(--spacing) * 2)",
  },
  tooltipRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 6)",
  },
  tooltipProvider: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    color: "var(--color-foreground)",
  },
  tooltipValue: {
    fontFamily: "var(--font-mono)",
    color: "var(--color-foreground)",
    "--tw-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
  },
  tooltipUnit: {
    marginLeft: "calc(var(--spacing) * 1)",
    color: "var(--color-muted)",
  },
  tooltipComparison: {
    marginLeft: "calc(var(--spacing) * 2)",
    color: "var(--color-muted)",
  },
  tooltipFooter: {
    borderTopStyle: "var(--tw-border-style)",
    borderTopWidth: "1px",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
  },
  emptyChart: {
    display: "flex",
    height: "420px",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--tw-leading,var(--text-sm--line-height))",
    color: "var(--color-muted)",
  },
  chart: {
    position: "relative",
    height: "420px",
    width: "100%",
  },
  card: {
    borderRadius: "var(--radius-lg)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-card)",
  },
  toggleGroup: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * .5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "var(--tw-border-style)",
    borderWidth: "1px",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-card)",
    padding: "calc(var(--spacing) * .5)",
  },
  toggle: {
    borderRadius: ".25rem",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--tw-leading,var(--text-xs--line-height))",
    whiteSpace: "nowrap",
    transitionProperty:
      "color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to",
    transitionTimingFunction: "var(--tw-ease,var(--default-transition-timing-function))",
    transitionDuration: "var(--tw-duration,var(--default-transition-duration))",
  },
  activeToggle: {
    backgroundColor: "var(--color-neutral-800)",
    color: "var(--color-foreground)",
  },
  inactiveToggle: {
    color: {
      default: "var(--color-muted)",
      "@media (hover:hover)": {
        default: null,
        ":hover": "var(--color-foreground)",
      },
    },
  },
});
