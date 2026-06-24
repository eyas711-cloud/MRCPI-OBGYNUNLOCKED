import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CreditLevel = "full" | "partial" | "none";

interface CriterionRow {
  criterion: string;
  descriptor: string;
  credit?: CreditLevel;
  marks?: number;
}

interface MarkSchemeGridProps {
  title?: string;
  rows: CriterionRow[];
  showCredit?: boolean;
  className?: string;
}

const creditConfig: Record<CreditLevel, { icon: React.ReactNode; label: string; color: string }> = {
  full: {
    icon: <Check size={14} strokeWidth={2.5} />,
    label: "Achieved",
    color: "var(--teal-bright)",
  },
  partial: {
    icon: <Minus size={14} strokeWidth={2.5} />,
    label: "Partial",
    color: "var(--gold)",
  },
  none: {
    icon: <X size={14} strokeWidth={2.5} />,
    label: "Not achieved",
    color: "#E05C40",
  },
};

export default function MarkSchemeGrid({
  title,
  rows,
  showCredit = false,
  className,
}: MarkSchemeGridProps) {
  return (
    <div className={cn("rounded-lg border overflow-hidden", className)} style={{ borderColor: "rgba(15,76,92,0.2)" }}>
      {title && (
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--navy)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <span className="font-mono-data text-xs tracking-widest text-white/60 uppercase">
            Assessment Criteria
          </span>
          <span className="font-mono-data text-xs tracking-widest text-white/60 uppercase">
            {title}
          </span>
        </div>
      )}

      <table className="w-full" style={{ backgroundColor: "rgba(247,245,240,0.6)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(15,76,92,0.12)" }}>
            <th
              className="text-left px-5 py-2.5 font-mono-data text-xs tracking-widest uppercase"
              style={{ color: "var(--teal)", width: "40%" }}
            >
              Criterion
            </th>
            <th
              className="text-left px-5 py-2.5 font-mono-data text-xs tracking-widest uppercase"
              style={{ color: "var(--teal)" }}
            >
              Descriptor
            </th>
            {showCredit && (
              <>
                <th
                  className="text-center px-4 py-2.5 font-mono-data text-xs tracking-widest uppercase"
                  style={{ color: "var(--teal)", width: "100px" }}
                >
                  Status
                </th>
                <th
                  className="text-center px-4 py-2.5 font-mono-data text-xs tracking-widest uppercase"
                  style={{ color: "var(--teal)", width: "60px" }}
                >
                  Marks
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const credit = row.credit;
            const cfg = credit ? creditConfig[credit] : null;
            return (
              <tr
                key={i}
                className="group"
                style={{
                  borderBottom:
                    i < rows.length - 1
                      ? "1px solid rgba(15,76,92,0.08)"
                      : undefined,
                  backgroundColor:
                    credit === "full"
                      ? "rgba(21,176,151,0.04)"
                      : credit === "partial"
                      ? "rgba(201,162,39,0.04)"
                      : undefined,
                }}
              >
                <td className="px-5 py-3.5 align-top">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--navy)" }}
                  >
                    {row.criterion}
                  </span>
                </td>
                <td className="px-5 py-3.5 align-top">
                  <span className="text-sm" style={{ color: "rgba(26,26,26,0.7)" }}>
                    {row.descriptor}
                  </span>
                </td>
                {showCredit && cfg && (
                  <>
                    <td className="px-4 py-3.5 text-center align-top">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-mono-data"
                        style={{ color: cfg.color }}
                      >
                        {cfg.icon}
                        <span className="hidden sm:inline">{cfg.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center align-top">
                      <span
                        className="font-mono-data text-sm font-medium"
                        style={{ color: "var(--navy)" }}
                      >
                        {row.marks ?? "—"}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
