import { memo } from "react";

export const RatingBadge = memo(function RatingBadge({
  value,
  size = 70,
}: {
  value: number;
  size?: number;
}) {
  const angle = Math.min(360, Math.max(0, Math.round((value / 100) * 360)));

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(#ffe000 ${angle}deg, rgba(255,255,255,0.1) ${angle}deg 360deg)`,
          borderRadius: "50%",
        }}
      >
        <div className="absolute inset-[4px] flex flex-col items-center justify-center rounded-full bg-[#121113]">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-[#ffe000]">{value}</span>
            <span className="text-[10px] font-semibold text-[#ffe000]">%</span>
          </div>
        </div>
      </div>
    </div>
  );
});
