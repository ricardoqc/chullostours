"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full px-4 sm:px-6 pt-4 pb-1">
      <div className="flex items-center justify-between gap-1">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-200 border-2 ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                      ? "bg-[#6b0014] border-[#6b0014] text-white shadow-md shadow-[#6b0014]/20"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? <FaCheck className="w-3.5 h-3.5" /> : <span>{stepNumber}</span>}
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wide text-center leading-tight ${
                    isActive ? "text-[#6b0014]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 -mt-5 mb-5 max-w-[40px] sm:max-w-none">
                  <div
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      stepNumber < currentStep ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
