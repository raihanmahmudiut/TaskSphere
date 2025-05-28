import dayjs from '@dayjs';
import { Dayjs } from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { APP_TIMEZONE } from '@/common/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Calendar } from './calendar';
import { Button } from './ui/button';
import { FormControl } from './ui/form';

interface DatePickerProps {
  selected?: Date;
  initialDate?: Date | undefined;
  onChange?: (newDate: Date | undefined) => void;
  disabled?: boolean;
  allowFuture?: boolean;
  placeholder?: string;
  className?: string;
  dayAdjustment?: 'startOfDay' | 'endOfDay' | null;
  disablePastMonths?: number;
}

export function DatePicker({
  selected,
  initialDate,
  onChange,
  disabled,
  allowFuture,
  placeholder,
  className,
  dayAdjustment = 'startOfDay',
  disablePastMonths = 0,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(
    initialDate ? dayjs(initialDate).tz(APP_TIMEZONE) : undefined
  );

  // Calculate the date based on the disablePastMonths prop
  const disableDateFrom =
    disablePastMonths > 0
      ? dayjs()
          .tz(APP_TIMEZONE)
          .subtract(disablePastMonths, 'months')
          .startOf('day')
      : null;

  const handleSelect = (day: Date | undefined, _selected: Date | undefined) => {
    if (!_selected) {
      setSelectedDate(undefined);
      if (onChange) {
        onChange(undefined);
      }

      return;
    }

    let adjustedDate = dayjs(_selected).tz(APP_TIMEZONE);
    if (dayAdjustment === 'startOfDay') {
      adjustedDate = adjustedDate.startOf('day');
    } else if (dayAdjustment === 'endOfDay') {
      adjustedDate = adjustedDate.endOf('day');
    }

    setSelectedDate(adjustedDate);
    if (onChange) {
      onChange(adjustedDate.toDate());
    }
  };

  useEffect(() => {
    setSelectedDate(
      initialDate ? dayjs(initialDate).tz(APP_TIMEZONE) : undefined
    );
  }, [initialDate]);

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              className || 'w-[240px]',
              'pl-3 text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            {selectedDate ? (
              selectedDate.format('MMM D, YYYY')
            ) : (
              <span>{placeholder ? placeholder : 'Pick a date'}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          fromYear={1970}
          toYear={2070}
          selected={selected || selectedDate?.toDate()}
          onSelect={handleSelect}
          disabled={(date) => {
            if (disabled) return true;
            if (!allowFuture && date > dayjs().tz(APP_TIMEZONE).toDate())
              return true;
            if (disableDateFrom && date < disableDateFrom.toDate()) return true;

            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
