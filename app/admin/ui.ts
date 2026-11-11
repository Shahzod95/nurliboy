// Admin panelning umumiy luxury uslub klasslari

export const card = "rounded-2xl border border-line bg-paper";

export const eyebrow =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted";

export const statValue =
  "mt-3 font-display text-5xl font-semibold leading-none text-ink lining-nums tabular-nums";

export const field =
  "rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-stone transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15";

export const segmented = "flex rounded-full border border-line bg-paper p-1";

export function segment(active: boolean) {
  return `whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
    active ? "bg-ink text-gold-light" : "text-muted hover:text-ink"
  }`;
}

export const btnPrimary =
  "rounded-full bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-40";

export const btnOutline =
  "rounded-full border border-line bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-40";

export const pill =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]";

// Holat ranglari — bosiq, "qimmat" tuslar (har doim yozuv/belgi bilan birga)
export const TONES = {
  rust: "border-[#ecd2ca] bg-[#f8ebe7] text-[#8a2f22]",
  amber: "border-[#eadbb6] bg-[#f7efdc] text-[#7a5a1e]",
  sage: "border-[#cfdfd2] bg-[#e7efe8] text-[#2f5d3a]",
} as const;
