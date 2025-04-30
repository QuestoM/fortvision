'use client';

import { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

// Common date range presets
const DATE_PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 14 days', value: 'last_14_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last month', value: 'last_month' },
  { label: 'Last 3 months', value: 'last_90_days' },
  { label: 'Last 6 months', value: 'last_180_days' },
  { label: 'This year', value: 'this_year' },
  { label: 'Last year', value: 'last_year' },
  { label: 'Custom range', value: 'custom' }
];

interface DateRangeSelectorProps {
  onChange: (range: { preset: string; from?: Date; to?: Date }) => void;
  defaultPreset?: string;
}

export default function DateRangeSelector({ 
  onChange, 
  defaultPreset = 'last_30_days' 
}: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    
    if (value !== 'custom') {
      // Reset custom dates when choosing a preset
      setFromDate(undefined);
      setToDate(undefined);
      onChange({ preset: value });
    } else {
      setIsCalendarOpen(true);
    }
  };
  
  const handleDateChange = (date: Date | undefined, isFrom: boolean) => {
    if (isFrom) {
      setFromDate(date);
      
      // Automatically adjust 'to' if it's before 'from'
      if (date && toDate && date > toDate) {
        setToDate(date);
      }
    } else {
      setToDate(date);
    }
    
    // Only notify when both dates are selected
    if (isFrom && date && toDate) {
      onChange({ preset: 'custom', from: date, to: toDate });
    } else if (!isFrom && date && fromDate) {
      onChange({ preset: 'custom', from: fromDate, to: date });
    }
  };
  
  // Format dates for display
  const getDisplayValue = () => {
    if (selectedPreset === 'custom' && fromDate && toDate) {
      return `${format(fromDate, 'MMM d, yyyy')} - ${format(toDate, 'MMM d, yyyy')}`;
    }
    
    const preset = DATE_PRESETS.find(p => p.value === selectedPreset);
    return preset ? preset.label : '';
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {DATE_PRESETS.map(preset => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedPreset === 'custom' && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate && toDate 
                ? `${format(fromDate, 'MMM d, yyyy')} - ${format(toDate, 'MMM d, yyyy')}`
                : "Select dates"}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col p-0" align="start">
            <div className="flex flex-col sm:flex-row border-b p-3">
              <div className="mb-2 sm:mb-0 sm:mr-4">
                <p className="text-sm font-medium mb-1">From</p>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => handleDateChange(date, true)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">To</p>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => handleDateChange(date, false)}
                  disabled={(date) => date > new Date() || (fromDate ? date < fromDate : false)}
                  initialFocus
                />
              </div>
            </div>
            
            <div className="p-3 border-t flex justify-end">
              <Button 
                variant="default"
                size="sm"
                onClick={() => setIsCalendarOpen(false)}
                disabled={!fromDate || !toDate}
              >
                Apply Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
} 