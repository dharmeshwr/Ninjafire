import React, { useState } from "react";
import { ChevronDown, ChevronUp, Settings, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface ControlPanelProps {
  children: React.ReactNode;
  name: string;
  className?: string;
  collapsed?: number;
}

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Readonly<Option[]>;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ControlPanel = ({ children, name, collapsed = 0 }: ControlPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  return (
    <div
      className={`fixed right-4 top-4 z-[9999] rounded border border-gray-700 bg-gray-800 font-mono ${isCollapsed == 2 ? "w-[1.55rem]" : "w-96"}`}
    >
      <div
        className="flex select-none items-center justify-between border-b border-gray-700 bg-gray-700 p-1"
        onClick={() => setIsCollapsed((prev) => (prev === 1 ? 0 : 1))}
      >
        {isCollapsed <= 1 && (
          <span>
            {isCollapsed === 1 ? (
              <ChevronDown className="size-4 text-gray-400" />
            ) : (
              <ChevronUp className="size-4 text-gray-400" />
            )}
          </span>
        )}
        {isCollapsed <= 1 && (
          <div className="flex w-full items-center justify-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              {name} - config
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed((prev) => (prev === 1 ? 2 : 1));
          }}
        >
          {isCollapsed <= 1 ? (
            <X className="size-4 text-gray-400" />
          ) : (
            <Settings className="size-4 text-gray-400" />
          )}
        </button>
      </div>
      {isCollapsed === 0 && (
        <div className="hide-scrollbar space-y-4 overflow-y-auto px-1 py-2 transition-all duration-300 ease-in-out">
          {children}
        </div>
      )}
    </div>
  );
};

const Input = ({ text, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="w-1/3 text-sm font-medium text-gray-300">Text</label>
      <input
        type="text"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-gray-300 focus:border-gray-500/0 focus:outline-none focus:ring-0"
      />
    </div>
  );
};

const RangeSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: RangeSliderProps) => (
  <div className="flex items-center justify-between gap-3">
    <label className="w-1/3 text-sm font-medium text-gray-300">{label}</label>
    <div className="inline-flex w-2/3 items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider h-1 w-2/3 cursor-pointer appearance-none rounded-lg bg-gray-700"
      />
      <input
        type="number"
        dir="rtl"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-1/3 rounded border-none bg-gray-700 pr-2 text-right text-sm text-gray-300 focus:border-gray-500/0 focus:outline-none focus:ring-0"
      />
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange }: ToggleProps) => (
  <div className={`flex items-center justify-between gap-3`}>
    <label className="w-1/3 text-sm font-medium text-gray-300">{label}</label>
    <div className="w-2/3">
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded transition-colors ${
          checked ? "bg-gray-600" : "bg-gray-700"
        }`}
      >
        <span
          className={`inline-block size-4 rounded transition-transform ${
            checked ? "translate-x-6 bg-gray-300" : "translate-x-1 bg-gray-400"
          }`}
        />
      </button>
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }: SelectProps) => (
  <div className="inline-flex w-full">
    <label className="w-1/3 text-sm font-medium text-gray-300">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-2/3 rounded border border-gray-600 bg-gray-700 px-1 text-sm text-gray-300 focus:border-gray-500/0 focus:outline-none focus:ring-0 focus:ring-gray-500/0"
    >
      {options.map((option: Option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-gray-700 text-gray-300"
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div className="flex items-center gap-0">
    <span className="w-1/3 text-sm font-medium text-gray-300">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-5 w-2/3 flex-1 rounded border border-gray-600 bg-gray-700 px-1 text-sm text-gray-300 focus:border-gray-500/0 focus:outline-none focus:ring-0"
    />
  </div>
);

export { ColorPicker, Select, RangeSlider, ControlPanel, Toggle, Input };
export default ControlPanel;
