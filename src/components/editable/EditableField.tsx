import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../utils/cn';

export interface EditableFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  multiline?: boolean;
  validation?: (value: string) => string | null;
  onSave?: (value: string | number) => void;
}

export default function EditableField({
  value,
  onChange,
  type = 'text',
  placeholder = 'Clique para editar',
  className,
  disabled = false,
  options = [],
  multiline = false,
  validation,
  onSave,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setTempValue(String(value));
    setError(null);
  };

  const handleSave = () => {
    if (validation) {
      const validationError = validation(tempValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    const finalValue = type === 'number' ? Number(tempValue) : tempValue;
    onChange(finalValue);
    onSave?.(finalValue);
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setTempValue(String(value));
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderInput = () => {
    const inputClasses = cn(
      'w-full px-3 py-2 border border-[#B8860B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-transparent',
      error && 'border-red-500 focus:ring-red-500',
      'bg-white text-[#5C4D32]'
    );

    switch (type) {
      case 'textarea':
      case 'text':
        return multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(inputClasses, 'min-h-[100px] resize-y')}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClasses}
          />
        );

      case 'number':
        return (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={inputClasses}
          />
        );

      case 'select':
        return (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          >
            {options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  if (isEditing) {
    return (
      <div className={cn('space-y-2', className)}>
        {renderInput()}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check size={16} className="mr-1" />
            Salvar
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCancel}>
            <X size={16} className="mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative cursor-pointer transition-all duration-200',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      onClick={handleEdit}
    >
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F2E8D5]/50 transition-colors">
        <span className="text-[#5C4D32]">
          {value || (
            <span className="text-[#5C4D32]/40 italic">{placeholder}</span>
          )}
        </span>
        {!disabled && (
          <Edit2
            size={16}
            className="text-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
    </div>
  );
}
