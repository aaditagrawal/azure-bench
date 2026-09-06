import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles";

type ToggleGroupOption<T extends string> = {
  value: T;
  label: string;
  tooltip?: string;
};

type ToggleGroupProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: ToggleGroupOption<T>[];
  className?: string;
  ariaLabel?: string;
};

export function ToggleGroup<T extends string>({
  value,
  onValueChange,
  options,
  className,
  ariaLabel,
}: ToggleGroupProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[stylex.props(styles.toggleGroup).className, className].filter(Boolean).join(" ")}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(option.value)}
            title={option.tooltip ?? option.label}
            {...stylex.props(styles.toggle, (active ? styles.activeToggle : styles.inactiveToggle))}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
