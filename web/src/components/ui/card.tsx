import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[stylex.props(styles.card).className, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
