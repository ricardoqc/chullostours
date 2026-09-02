import React from "react";
import { ShieldCheck, Star, CheckCircle2, Headphones, CreditCard, Award, Sparkles } from "lucide-react";
import { getTrustBarConfig } from "@/lib/site-config";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck,
  Star,
  CheckCircle2,
  Headphones,
  CreditCard,
  Award,
  Sparkles,
};

export const TrustBar: React.FC = () => {
  const config = getTrustBarConfig();

  if (!config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full bg-slate-900 text-white border-y border-slate-800/80 py-2 px-4 shadow-inner relative z-30 select-none"
      aria-label="Garantías y Certificaciones Oficiales"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {config.items.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
                item.highlight
                  ? "bg-[#6b0014] text-[#ffc000] border border-[#ffc000]/30 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <IconComponent
                className={`w-3.5 h-3.5 shrink-0 ${
                  item.highlight ? "text-[#ffc000]" : "text-[#ffc000]/90"
                }`}
              />
              <span className="whitespace-nowrap tracking-wide">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
