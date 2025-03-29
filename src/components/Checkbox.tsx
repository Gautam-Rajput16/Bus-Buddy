import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
  disabled = false,
}) => {
  return (
    <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-5 h-5 border-2 rounded transition-colors ${
            checked 
              ? 'bg-[#06D6A0] border-[#06D6A0]' 
              : 'bg-white border-gray-300'
          }`}
        >
          {checked && (
            <Check 
              className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
              strokeWidth={3}
            />
          )}
        </div>
      </div>
      {label && (
        <span className={`ml-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;