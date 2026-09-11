"use client";

import { Plus, Trash2 } from "lucide-react";

type StringListFieldProps = {
  id: string;
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
};

export function StringListField({
  id,
  label,
  hint,
  values,
  onChange,
  placeholder,
  multiline = false,
}: StringListFieldProps) {
  const updateAt = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold text-slate-800">{label}</legend>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${id}-${index}`} className="flex gap-2">
            {multiline ? (
              <textarea
                id={`${id}-${index}`}
                name={`${id}[${index}]`}
                value={value}
                onChange={(event) => updateAt(index, event.target.value)}
                rows={3}
                className="admin-input flex-1"
              />
            ) : (
              <input
                id={`${id}-${index}`}
                name={`${id}[${index}]`}
                type="text"
                value={value}
                onChange={(event) => updateAt(index, event.target.value)}
                placeholder={placeholder}
                className="admin-input flex-1"
              />
            )}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
              aria-label={`Quitar elemento ${index + 1} de ${label}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0014] hover:underline"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Agregar
      </button>
    </fieldset>
  );
}
