import { useEffect, useMemo, useState } from "react";
import type { SymbolIdDTO, WinningLineDTO } from "@catspin/protocol";
import { SLOT_SYMBOL_IDS, SLOT_SYMBOL_VIEW } from "./slotSymbols";

type SlotMachineProps = {
  readonly grid: readonly (readonly SymbolIdDTO[])[];
  readonly isSpinning: boolean;
  readonly winningLines: readonly WinningLineDTO[];
};

function createRandomGrid(rows: number, cols: number): SymbolIdDTO[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      const index = Math.floor(Math.random() * SLOT_SYMBOL_IDS.length);
      return SLOT_SYMBOL_IDS[index];
    }),
  );
}

function getWinningCellSet(
  winningLines: readonly WinningLineDTO[],
): ReadonlySet<string> {
  const cells = new Set<string>();

  winningLines.forEach((line) => {
    const rowIndex = line.lineIndex;

    for (let colIndex = 0; colIndex < line.count; colIndex += 1) {
      cells.add(`${rowIndex}:${colIndex}`);
    }
  });

  return cells;
}

export function SlotMachine(props: SlotMachineProps) {
  const { grid, isSpinning, winningLines } = props;

  const rows = Math.max(grid.length, 3);
  const cols = Math.max(grid[0]?.length ?? 0, 5);

  const normalizedGrid = useMemo<SymbolIdDTO[][]>(() => {
    if (grid.length === 0) {
      return createRandomGrid(rows, cols);
    }

    return grid.map((row) => [...row]);
  }, [cols, grid, rows]);

  const winningCells = useMemo(() => {
    return getWinningCellSet(winningLines);
  }, [winningLines]);

  const [displayGrid, setDisplayGrid] =
    useState<SymbolIdDTO[][]>(normalizedGrid);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayGrid(normalizedGrid);
      return;
    }

    const intervalId = window.setInterval(() => {
      setDisplayGrid(createRandomGrid(rows, cols));
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cols, isSpinning, normalizedGrid, rows]);

  return (
    <div
      style={{
        display: "inline-grid",
        gap: 8,
        padding: 16,
        borderRadius: 16,
        border: "2px solid #333",
        background: "#161616",
      }}
    >
      {displayGrid.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${row.length}, 72px)`,
            gap: 8,
          }}
        >
          {row.map((symbol, colIndex) => {
            const isWinningCell =
              !isSpinning && winningCells.has(`${rowIndex}:${colIndex}`);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  borderRadius: 12,
                  background: isWinningCell ? "#3a2f12" : "#242424",
                  border: isWinningCell
                    ? "2px solid #f5c542"
                    : "1px solid #444",
                  boxShadow: isWinningCell
                    ? "0 0 12px rgba(245, 197, 66, 0.35)"
                    : "none",
                  userSelect: "none",
                }}
              >
                {SLOT_SYMBOL_VIEW[symbol]}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
