export type SlotSymbolId =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "M1"
  | "M2"
  | "H1"
  | "H2";

export const SLOT_SYMBOL_VIEW: Readonly<Record<SlotSymbolId, string>> = {
  L1: "🐭",
  L2: "🧶",
  L3: "🥛",
  L4: "🐾",
  M1: "🐟",
  M2: "🐔",
  H1: "😼",
  H2: "🦁",
};

export const SLOT_SYMBOL_IDS: readonly SlotSymbolId[] = [
  "L1",
  "L2",
  "L3",
  "L4",
  "M1",
  "M2",
  "H1",
  "H2",
];
