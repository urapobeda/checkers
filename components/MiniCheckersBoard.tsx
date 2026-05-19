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

export function MiniCheckersBoard({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[560px] rounded-2xl border border-black/35 bg-[#1d1a16] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.34)] ${className}`}>
      <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-xl border border-black/45">
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
                <span className={`relative grid aspect-square w-[66%] place-items-center rounded-full border shadow-[0_9px_18px_rgba(0,0,0,0.38)] ${piece === "light" ? "border-white/70 bg-[linear-gradient(145deg,#fff6dd,#d7bd86)]" : piece === "king" ? "border-[var(--amber)] bg-[linear-gradient(145deg,#4a4238,#14120f)]" : "border-stone-700 bg-[linear-gradient(145deg,#47423b,#15130f)]"}`}>
                  <span className={`aspect-square w-[46%] rounded-full border ${piece === "light" ? "border-[#b08a4c] bg-white/20" : "border-white/15 bg-white/15"}`} />
                  {piece === "king" ? <span className="absolute top-[17%] h-1.5 w-[38%] rounded-full bg-[var(--amber)] shadow-[0_0_0_1px_rgba(0,0,0,0.22)]" /> : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
