import dayjs from '@dayjs';
import { Dayjs } from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  selected?: Date | undefined;
  onChange?: (newDateTime: Date | undefined) => void;
  disabled?: boolean;
  allowFuture?: boolean;
  className?: string;
  asChild?: boolean;
  placeholder?: string;
  defaultTime?: string; // HH:mm:ss format
  side?: 'left' | 'right' | 'top' | 'bottom';
  allowPast?: boolean;
  second?: number;
  secondInput?: boolean;
}

export function DateTimePicker({
  selected,
  onChange,
  disabled,
  allowFuture,
  className,
  asChild,
  placeholder,
  defaultTime,
  side = 'left',
  allowPast = true,
  second = 59,
  secondInput = true,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Dayjs | undefined
  >(selected ? dayjs(selected) : undefined);

  React.useEffect(() => {
    setSelectedDateTime(selected ? dayjs(selected) : undefined);
  }, [selected]);

  function handleSelect(day: Date | undefined, _selected: Date | undefined) {
    const selectedDay = dayjs(_selected);

    let modifiedDay;
    if (defaultTime && !selectedDateTime) {
      // If defaultTime is provided and no time was previously selected,
      // use the default time including seconds
      const [hours, minutes, seconds] = defaultTime.split(':').map(Number);
      modifiedDay = selectedDay
        .hour(hours)
        .minute(minutes)
        .second(seconds || 0);
    } else {
      // Otherwise, use existing time or current time
      modifiedDay = selectedDateTime
        ? selectedDay
            .hour(dayjs(selectedDateTime).hour())
            .minute(dayjs(selectedDateTime).minute())
            .second(dayjs(selectedDateTime).second())
        : selectedDay
            .hour(dayjs().hour())
            .minute(dayjs().minute())
            .second(dayjs().second());
    }

    setSelectedDateTime(modifiedDay);

    if (onChange) {
      onChange(modifiedDay.toDate());
    }
  }

  function handleTimeChange(dateTime?: Date) {
    setSelectedDateTime(dayjs(dateTime));

    if (onChange) {
      onChange(dateTime);
    }
  }

  return asChild ? (
    <div>
      <Calendar
        mode="single"
        selected={selectedDateTime?.toDate()}
        onSelect={handleSelect}
        initialFocus
        disabled={(date) =>
          disabled ||
          (!allowFuture && date > new Date()) ||
          (!allowPast && date < dayjs().startOf('day').toDate()) ||
          date < new Date('1900-01-01')
        }
      />
      <TimePicker
        disabled={disabled}
        selected={
          selectedDateTime ? new Date(selectedDateTime.toDate()) : undefined
        }
        onSelect={handleTimeChange}
        defaultTime={defaultTime}
        second={second}
        secondInput={secondInput}
      />
    </div>
  ) : (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          className={cn(
            'w-fit justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            className && className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            dayjs(selectedDateTime).format('MMM D, YYYY h:mm:ss A')
          ) : (
            <span>{placeholder ? placeholder : 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" side={side}>
        <Calendar
          mode="single"
          selected={selectedDateTime?.toDate()}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) =>
            disabled ||
            (!allowFuture && date > new Date()) ||
            (!allowPast && date < dayjs().startOf('day').toDate()) ||
            date < new Date('1900-01-01')
          }
        />
        <TimePicker
          disabled={disabled}
          selected={
            selectedDateTime ? new Date(selectedDateTime.toDate()) : undefined
          }
          onSelect={handleTimeChange}
          defaultTime={defaultTime}
          second={second}
        />
      </PopoverContent>
    </Popover>
  );
}

const TimePicker = ({
  disabled,
  selected,
  onSelect,
  defaultTime,
  second = 59,
  secondInput,
}: {
  disabled?: boolean;
  selected?: Date;
  onSelect?: (newDateTime: Date | undefined) => void;
  defaultTime?: string;
  second?: number;
  secondInput?: boolean;
}) => {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Dayjs | undefined
  >(selected ? dayjs(selected) : undefined);

  React.useEffect(() => {
    setSelectedDateTime(selected ? dayjs(selected) : undefined);
  }, [selected]);

  React.useEffect(() => {
    // Set default time when component mounts and no time is selected
    if (!selected && defaultTime) {
      const [hours, minutes, seconds] = defaultTime.split(':').map(Number);
      const defaultDateTime = dayjs()
        .hour(hours)
        .minute(minutes)
        .second(seconds || 0);
      setSelectedDateTime(defaultDateTime);
      if (onSelect) {
        onSelect(defaultDateTime.toDate());
      }
    }
  }, [defaultTime, onSelect, selected]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    // Extract hours and minutes from the time input
    const [hours, minutes] = value.split(':').map(Number);

    // Preserve existing seconds or use default/current seconds
    const seconds = selectedDateTime
      ? selectedDateTime.second()
      : defaultTime
        ? Number(defaultTime.split(':')[2] || 0)
        : dayjs().second();

    const modifiedDay = selectedDateTime
      ? dayjs(selectedDateTime).hour(hours).minute(minutes).second(seconds)
      : dayjs().hour(hours).minute(minutes).second(seconds);

    setSelectedDateTime(() => modifiedDay);

    if (onSelect) {
      onSelect(modifiedDay.toDate());
    }
  }

  return (
    <div className="px-4 pt-0 pb-4">
      <div className="flex gap-2 items-center">
        <Input
          type="time"
          onChange={handleChange}
          value={
            selectedDateTime
              ? dayjs(selectedDateTime).format('HH:mm')
              : defaultTime?.substring(0, 5) || ''
          }
          disabled={disabled}
          className="flex-1"
        />
        {secondInput && (
          <Input
            type="number"
            min={0}
            max={second}
            onChange={(e) => {
              const seconds = Math.min(
                second,
                Math.max(0, parseInt(e.target.value) || 0)
              );
              const modifiedDay = selectedDateTime
                ? dayjs(selectedDateTime).second(seconds)
                : dayjs().second(seconds);

              setSelectedDateTime(modifiedDay);
              if (onSelect) {
                onSelect(modifiedDay.toDate());
              }
            }}
            value={
              selectedDateTime
                ? selectedDateTime.second()
                : defaultTime?.split(':')[2] || '0'
            }
            disabled={disabled}
            className="w-20"
          />
        )}
      </div>
      {!selected && !defaultTime && <p>Please pick a time.</p>}
    </div>
  );
};
