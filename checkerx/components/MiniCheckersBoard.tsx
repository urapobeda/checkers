const pieces: Record<string, "dark" | "light" | "king"> = {
  "0-1": "dark",
  "0-3": "dark",
  "0-5": "dark",
  "1-0": "dark",
  "1-2": "dark",
  "1-6": "dark",
  "2-3": "dark",
  "3-2": "king",
  "4-5": "light",
  "5-0": "light",
  "5-4": "light",
  "6-1": "light",
  "6-5": "light",
  "7-0": "light",
  "7-4": "light",
};

export function MiniCheckersBoard() {
  return (
    <div className="mx-auto w-full max-w-[520px] rounded-xl border border-white/10 bg-slate-950/70 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
      <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-lg border border-black/40">
        {Array.from({ length: 64 }).map((_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const playable = (row + col) % 2 === 1;
          const key = `${row}-${col}`;
          const piece = pieces[key];
          const isHint = ["3-2", "4-3", "5-4"].includes(key);

          return (
            <div key={key} className={`relative grid place-items-center ${playable ? "bg-[var(--board-dark)]" : "bg-[var(--board-light)]"}`}>
              {isHint ? <span className="absolute inset-1 rounded-md border border-[var(--cyan)]/55 bg-[var(--cyan)]/10" /> : null}
              {piece ? (
                <span className={`relative grid h-[66%] w-[66%] place-items-center rounded-full border shadow-[0_8px_16px_rgba(0,0,0,0.36)] ${piece === "light" ? "border-white/70 bg-[linear-gradient(145deg,#f8fbff,#b7d8ef)]" : piece === "king" ? "border-[var(--amber)] bg-[linear-gradient(145deg,#292f43,#121827)]" : "border-slate-700 bg-[linear-gradient(145deg,#313846,#090d15)]"}`}>
                  {piece === "king" ? <span className="h-5 w-5 rounded-full border-2 border-[var(--amber)]" /> : <span className="h-[46%] w-[46%] rounded-full border border-black/20 bg-white/16" />}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
