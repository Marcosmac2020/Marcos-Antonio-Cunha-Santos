import React, { useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui';
import { Button } from '../ui';
import { cn } from '../../utils/cn';
import EditableField from './EditableField';

export interface EditableCardItem {
  id: string;
  label: string;
  value: string | number;
  type?: 'text' | 'number' | 'textarea' | 'select';
  options?: Array<{ label: string; value: string | number }>;
  validation?: (value: string) => string | null;
}

export interface EditableCardProps {
  title: string;
  items: EditableCardItem[];
  onChange: (itemId: string, value: string | number) => void;
  onTitleChange?: (title: string) => void;
  onAddItem?: () => void;
  onDeleteItem?: (itemId: string) => void;
  draggable?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function EditableCard({
  title,
  items,
  onChange,
  onTitleChange,
  onAddItem,
  onDeleteItem,
  draggable = false,
  className,
  disabled = false,
}: EditableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    // Handle reordering logic here
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  return (
    <Card className={cn('relative', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {draggable && (
              <div className="cursor-move opacity-50 hover:opacity-100">
                <GripVertical size={20} />
              </div>
            )}
            {onTitleChange ? (
              <EditableField
                value={title}
                onChange={onTitleChange}
                type="text"
                className="flex-1"
                disabled={disabled}
              />
            ) : (
              <h3 className="ornate-title text-xl font-bold text-[#B8860B]">
                {title}
              </h3>
            )}
          </div>
          
          {onAddItem && !disabled && (
            <Button size="sm" variant="secondary" onClick={onAddItem}>
              <Plus size={16} className="mr-1" />
              Adicionar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border border-[#B8860B]/20',
              'hover:bg-[#F2E8D5]/30 transition-colors',
              draggedItem === item.id && 'opacity-50',
              isDragging && 'border-dashed'
            )}
            draggable={draggable && !disabled}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={handleDragEnd}
          >
            {draggable && (
              <div className="cursor-move opacity-50 hover:opacity-100 mt-1">
                <GripVertical size={16} />
              </div>
            )}

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-[#5C4D32]/70">
                {item.label}
              </label>
              
              <EditableField
                value={item.value}
                onChange={(value) => onChange(item.id, value)}
                type={item.type}
                options={item.options}
                validation={item.validation}
                disabled={disabled}
                placeholder={`Digite ${item.label.toLowerCase()}`}
              />
            </div>

            {onDeleteItem && !disabled && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-[#5C4D32]/50">
            <p>Nenhum item adicionado</p>
            {onAddItem && !disabled && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onAddItem}
                className="mt-2"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Primeiro Item
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
