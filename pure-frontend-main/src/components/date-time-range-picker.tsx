import dayjs from '@dayjs';
import { Dayjs } from 'dayjs';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { APP_TIMEZONE } from '@/common/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface DateTimeRangePickerProps {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  onReset?: () => void;
  disabled?: boolean;
  allowFuture?: boolean;
  className?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  placeholder?: string;
  startDefaultTime?: string;
  endDefaultTime?: string;
  secondsAllowed?: boolean;
}

const useDateTimeRange = (options: {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  startDefaultTime?: string;
  endDefaultTime?: string;
}) => {
  const {
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startDefaultTime = '00:00:00',
    endDefaultTime = '23:59:59',
  } = options;

  const [startDateTime, setStartDateTime] = React.useState<Dayjs | undefined>(
    startDate ? dayjs(startDate).tz(APP_TIMEZONE) : undefined
  );
  const [endDateTime, setEndDateTime] = React.useState<Dayjs | undefined>(
    endDate ? dayjs(endDate).tz(APP_TIMEZONE) : undefined
  );
  const [date, setDate] = React.useState<DateRange | undefined>(
    startDate && endDate
      ? {
          from: startDate,
          to: endDate,
        }
      : undefined
  );

  React.useEffect(() => {
    setStartDateTime(startDate ? dayjs(startDate).tz(APP_TIMEZONE) : undefined);
    setEndDateTime(endDate ? dayjs(endDate).tz(APP_TIMEZONE) : undefined);
    setDate(
      startDate && endDate
        ? {
            from: startDate,
            to: endDate,
          }
        : undefined
    );
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);

    if (range?.from) {
      const fromDay = dayjs(range.from).tz(APP_TIMEZONE);
      let modifiedFrom;

      if (startDefaultTime && !startDateTime) {
        const [hours, minutes, seconds] = startDefaultTime
          .split(':')
          .map(Number);
        modifiedFrom = fromDay
          .hour(hours)
          .minute(minutes)
          .second(seconds || 0);
      } else {
        modifiedFrom = startDateTime
          ? fromDay
              .hour(startDateTime.hour())
              .minute(startDateTime.minute())
              .second(startDateTime.second())
          : fromDay.hour(0).minute(0).second(0);
      }

      setStartDateTime(modifiedFrom);

      if (onStartDateChange) {
        onStartDateChange(modifiedFrom.toDate());
      }
    }

    if (range?.to) {
      const toDay = dayjs(range.to).tz(APP_TIMEZONE);
      let modifiedTo;

      if (endDefaultTime && !endDateTime) {
        const [hours, minutes, seconds] = endDefaultTime.split(':').map(Number);
        modifiedTo = toDay
          .hour(hours)
          .minute(minutes)
          .second(seconds || 0);
      } else {
        modifiedTo = endDateTime
          ? toDay
              .hour(endDateTime.hour())
              .minute(endDateTime.minute())
              .second(endDateTime.second())
          : toDay.hour(23).minute(59).second(59);
      }

      setEndDateTime(modifiedTo);

      if (onEndDateChange) {
        onEndDateChange(modifiedTo.toDate());
      }
    }
  };

  return {
    startDateTime,
    endDateTime,
    date,
    setDate,
    handleSelect,
    setStartDateTime,
    setEndDateTime,
  };
};

const TimePicker = ({
  disabled,
  selected,
  onSelect,
  defaultTime,
  secondsAllowed = true,
}: {
  disabled?: boolean;
  selected?: Date;
  onSelect?: (newDateTime: Date | undefined) => void;
  defaultTime?: string;
  secondsAllowed: boolean;
}) => {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Dayjs | undefined
  >(selected ? dayjs(selected).tz(APP_TIMEZONE) : undefined);

  React.useEffect(() => {
    setSelectedDateTime(
      selected ? dayjs(selected).tz(APP_TIMEZONE) : undefined
    );
  }, [selected]);

  React.useEffect(() => {
    if (!selected && defaultTime) {
      const [hours, minutes, seconds] = defaultTime.split(':').map(Number);
      const defaultDateTime = dayjs()
        .tz(APP_TIMEZONE)
        .hour(hours)
        .minute(minutes)
        .second(seconds || 0);
      setSelectedDateTime(defaultDateTime);
      if (onSelect) {
        onSelect(defaultDateTime.toDate());
      }
    }
  }, [defaultTime, onSelect, selected]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const [hours, minutes] = value.split(':').map(Number);
    const seconds = selectedDateTime
      ? selectedDateTime.second()
      : defaultTime
        ? Number(defaultTime.split(':')[2] || 0)
        : dayjs().tz(APP_TIMEZONE).second();

    const baseDate = selected
      ? dayjs(selected).tz(APP_TIMEZONE)
      : selectedDateTime
        ? dayjs(selectedDateTime)
        : dayjs().tz(APP_TIMEZONE);

    const modifiedDay = baseDate.hour(hours).minute(minutes).second(seconds);

    setSelectedDateTime(modifiedDay);

    if (onSelect) {
      onSelect(modifiedDay.toDate());
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));

    const baseDate = selected
      ? dayjs(selected).tz(APP_TIMEZONE)
      : selectedDateTime
        ? dayjs(selectedDateTime)
        : dayjs().tz(APP_TIMEZONE);

    const modifiedDay = baseDate.second(seconds);

    setSelectedDateTime(modifiedDay);
    if (onSelect) {
      onSelect(modifiedDay.toDate());
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="time"
        onChange={handleTimeChange}
        value={
          selectedDateTime
            ? dayjs(selectedDateTime).format('HH:mm')
            : defaultTime?.substring(0, 5) || ''
        }
        disabled={disabled}
        className="flex-1"
      />
      {secondsAllowed && (
        <Input
          type="number"
          min={0}
          max={59}
          onChange={handleSecondsChange}
          value={
            selectedDateTime
              ? selectedDateTime.second()
              : defaultTime?.split(':')[2] || '0'
          }
          disabled={disabled}
          className="w-16"
          title="Seconds"
        />
      )}
    </div>
  );
};

export function DateTimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
  disabled,
  className,
  startPlaceholder = 'Start date & time',
  endPlaceholder = 'End date & time',
  placeholder = 'Select date range with time',
  startDefaultTime = '00:00:00',
  endDefaultTime = '23:59:59',
  secondsAllowed = true,
}: DateTimeRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const {
    startDateTime,
    endDateTime,
    date,
    setDate,
    handleSelect,
    setStartDateTime,
    setEndDateTime,
  } = useDateTimeRange({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startDefaultTime,
    endDefaultTime,
  });

  const handleReset = () => {
    setDate(undefined);
    setStartDateTime(undefined);
    setEndDateTime(undefined);

    if (onStartDateChange) {
      onStartDateChange(undefined);
    }

    if (onEndDateChange) {
      onEndDateChange(undefined);
    }

    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal p-3',
              !date && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            {date?.from || date?.to ? (
              <>
                {date.from && startDateTime
                  ? dayjs(startDateTime).format('MMM D, YYYY h:mm A')
                  : startPlaceholder}{' '}
                -{' '}
                {date.to && endDateTime
                  ? dayjs(endDateTime).format('MMM D, YYYY h:mm A')
                  : endPlaceholder}
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="left" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            numberOfMonths={2}
            defaultMonth={date?.from}
          />
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2 text-sm">Start Time</div>
                <TimePicker
                  disabled={disabled || !date?.from}
                  selected={startDateTime?.toDate()}
                  onSelect={(newDateTime) => {
                    setStartDateTime(
                      newDateTime
                        ? dayjs(newDateTime).tz(APP_TIMEZONE)
                        : undefined
                    );
                    if (onStartDateChange) {
                      onStartDateChange(newDateTime);
                    }
                  }}
                  defaultTime={startDefaultTime}
                  secondsAllowed={secondsAllowed}
                />
              </div>
              <div>
                <div className="font-medium mb-2 text-sm">End Time</div>
                <TimePicker
                  disabled={disabled || !date?.to}
                  selected={endDateTime?.toDate()}
                  onSelect={(newDateTime) => {
                    setEndDateTime(
                      newDateTime
                        ? dayjs(newDateTime).tz(APP_TIMEZONE)
                        : undefined
                    );
                    if (onEndDateChange) {
                      onEndDateChange(newDateTime);
                    }
                  }}
                  defaultTime={endDefaultTime}
                  secondsAllowed={secondsAllowed}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {(date?.from || date?.to) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <X
                className="h-5 w-5 p-1 flex items-center justify-center absolute right-1 top-2 cursor-pointer aspect-square rounded-full text-red-500 bg-red-200"
                onClick={handleReset}
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Reset date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
