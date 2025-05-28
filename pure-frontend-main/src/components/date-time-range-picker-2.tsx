import dayjs from '@dayjs';
import { CalendarIcon } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { APP_TIMEZONE } from '@/common/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface DateTimeRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  defaultDateRange?: DateRange;
  defaultStartTime?: string; // Format: "HH:MM"
  defaultEndTime?: string; // Format: "HH:MM"
  placeholder?: string;
  triggerVariant?: Exclude<ButtonProps['variant'], 'destructive' | 'link'>;
  triggerSize?: Exclude<ButtonProps['size'], 'icon'>;
  triggerClassName?: string;
  shallow?: boolean;
  persistQuery?: boolean;
  onApply?: (from: Date | undefined, to: Date | undefined) => void;
  onReset?: () => void;
  dateResetAllowed?: boolean;
  showTimeSelect?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  disabled?: boolean;
  allowPast?: boolean;
  allowFuture?: boolean;
  seconds?: number;
}

export const DateTimeRangePickerTwo = React.forwardRef<
  { reset: () => void },
  DateTimeRangePickerProps
>(
  (
    {
      defaultDateRange,
      defaultStartTime = '00:00',
      defaultEndTime = '23:59',
      placeholder = 'Pick a date and time',
      triggerVariant = 'outline',
      triggerSize = 'default',
      triggerClassName,
      shallow = true,
      persistQuery = false,
      className,
      onApply,
      onReset,
      dateResetAllowed = true,
      showTimeSelect = true,
      side = 'left',
      disabled,
      allowPast = true,
      allowFuture = true,
      seconds = 59,
      ...props
    },
    ref
  ) => {
    // Extract initial state setup
    const {
      setDateParams,
      tempSelectedDate,
      setTempSelectedDate,
      startTime,
      setStartTime,
      endTime,
      setEndTime,
      isPopoverOpen,
      setIsPopoverOpen,
      activeTab,
      setActiveTab,
      appliedDateTime,
      setAppliedDateTime,
    } = useInitialState({
      defaultDateRange,
      defaultStartTime,
      defaultEndTime,
      shallow,
    });

    // Generate time options
    const { hoursOptions, minutesOptions } = generateTimeOptions();

    // Handle apply action
    const handleApply = () => {
      const { from, to } = calculateDateTimeRange(
        tempSelectedDate,
        startTime,
        endTime,
        seconds
      );

      setAppliedDateTime({
        dateRange: { from, to },
        startTime,
        endTime,
      });

      if (persistQuery) {
        void setDateParams({
          from: from ? from.toISOString() : '',
          to: to ? to.toISOString() : '',
          startTime,
          endTime,
        });
      }

      if (onApply) {
        onApply(from, to);
      }

      setIsPopoverOpen(false);
    };

    // Handle reset action
    const handleReset = () => {
      setTempSelectedDate(undefined);
      setStartTime(defaultStartTime);
      setEndTime(defaultEndTime);
      setAppliedDateTime({
        dateRange: undefined,
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      });

      if (persistQuery) {
        void setDateParams({
          from: '',
          to: '',
          startTime: defaultStartTime,
          endTime: defaultEndTime,
        });
      }

      if (onReset) {
        onReset();
      }
    };

    // Expose reset method via ref
    React.useImperativeHandle(ref, () => ({
      reset: handleReset,
    }));

    // Format time for display
    const formatTimeDisplay = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hourNum = parseInt(hours, 10);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;

      return `${hour12}:${minutes} ${period}`;
    };

    // Render trigger button content
    const renderTriggerContent = () => {
      if (!appliedDateTime.dateRange?.from) {
        return <span>{placeholder}</span>;
      }

      if (appliedDateTime.dateRange.to) {
        return (
          <>
            {dayjs
              .utc(appliedDateTime.dateRange.from)
              .tz(APP_TIMEZONE)
              .format('MMM D, YYYY')}{' '}
            {showTimeSelect && formatTimeDisplay(appliedDateTime.startTime)} -{' '}
            {dayjs
              .utc(appliedDateTime.dateRange.to)
              .tz(APP_TIMEZONE)
              .format('MMM D, YYYY')}{' '}
            {showTimeSelect && formatTimeDisplay(appliedDateTime.endTime)}
          </>
        );
      }

      return (
        <>
          {dayjs
            .utc(appliedDateTime.dateRange.from)
            .tz(APP_TIMEZONE)
            .format('MMM D, YYYY')}{' '}
          {showTimeSelect && (
            <>
              {formatTimeDisplay(appliedDateTime.startTime)} -{' '}
              {formatTimeDisplay(appliedDateTime.endTime)}
            </>
          )}
        </>
      );
    };

    // Render time selectors
    const renderTimeSelectors = () => (
      <div className="grid gap-4">
        <TimeSelector
          label="Start Time"
          time={startTime}
          onTimeChange={(hour, minute) => setStartTime(`${hour}:${minute}`)}
          hoursOptions={hoursOptions}
          minutesOptions={minutesOptions}
          idPrefix="start"
        />
        <TimeSelector
          label="End Time"
          time={endTime}
          onTimeChange={(hour, minute) => setEndTime(`${hour}:${minute}`)}
          hoursOptions={hoursOptions}
          minutesOptions={minutesOptions}
          idPrefix="end"
        />
      </div>
    );

    return (
      <div className="grid gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={triggerVariant}
              size={triggerSize}
              className={cn(
                'w-full justify-start gap-2 truncate text-left font-normal',
                !appliedDateTime.dateRange?.from && 'text-muted-foreground',
                triggerClassName
              )}
            >
              <CalendarIcon className="size-4" />
              {renderTriggerContent()}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn('w-auto p-0', className)}
            {...props}
            align="start"
            side={side}
          >
            {showTimeSelect ? (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="date">Date</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                </TabsList>
                <TabsContent value="date" className="p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={appliedDateTime.dateRange?.from}
                    selected={tempSelectedDate}
                    onSelect={setTempSelectedDate}
                    numberOfMonths={2}
                    disabled={(date) =>
                      disabled ||
                      (!allowFuture && date > new Date()) ||
                      (!allowPast && date < dayjs().startOf('day').toDate()) ||
                      date < new Date('1900-01-01')
                    }
                  />
                </TabsContent>
                <TabsContent value="time" className="p-4">
                  {renderTimeSelectors()}
                </TabsContent>
              </Tabs>
            ) : (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={appliedDateTime.dateRange?.from}
                selected={tempSelectedDate}
                onSelect={setTempSelectedDate}
                numberOfMonths={2}
                disabled={(date) =>
                  disabled ||
                  (!allowFuture && date > new Date()) ||
                  (!allowPast && date < dayjs().startOf('day').toDate()) ||
                  date < new Date('1900-01-01')
                }
              />
            )}
            <div className="flex justify-end space-x-2 p-2">
              {dateResetAllowed ? (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              ) : (
                <></>
              )}
              <Button variant="default" size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

// Helper functions and components
const useInitialState = ({
  defaultDateRange,
  defaultStartTime,
  defaultEndTime,
  shallow,
}: {
  defaultDateRange?: DateRange;
  defaultStartTime: string;
  defaultEndTime: string;
  shallow: boolean;
}) => {
  const defaultFromValue = defaultDateRange?.from
    ? defaultDateRange.from instanceof Date
      ? defaultDateRange.from.toISOString()
      : defaultDateRange.from
    : '';

  const defaultToValue = defaultDateRange?.to
    ? defaultDateRange.to instanceof Date
      ? defaultDateRange.to.toISOString()
      : defaultDateRange.to
    : '';

  const [dateParams, setDateParams] = useQueryStates(
    {
      from: parseAsString.withDefault(defaultFromValue),
      to: parseAsString.withDefault(defaultToValue),
      startTime: parseAsString.withDefault(defaultStartTime),
      endTime: parseAsString.withDefault(defaultEndTime),
    },
    {
      clearOnDefault: true,
      shallow,
    }
  );

  const [tempSelectedDate, setTempSelectedDate] = React.useState<
    DateRange | undefined
  >({
    from: dateParams.from ? new Date(dateParams.from) : defaultDateRange?.from,
    to: dateParams.to ? new Date(dateParams.to) : defaultDateRange?.to,
  });

  const [startTime, setStartTime] = React.useState(
    dateParams.startTime || defaultStartTime
  );
  const [endTime, setEndTime] = React.useState(
    dateParams.endTime || defaultEndTime
  );
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('date');

  const [appliedDateTime, setAppliedDateTime] = React.useState<{
    dateRange: DateRange | undefined;
    startTime: string;
    endTime: string;
  }>({
    dateRange: tempSelectedDate,
    startTime: startTime,
    endTime: endTime,
  });

  return {
    dateParams,
    setDateParams,
    tempSelectedDate,
    setTempSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isPopoverOpen,
    setIsPopoverOpen,
    activeTab,
    setActiveTab,
    appliedDateTime,
    setAppliedDateTime,
  };
};

const generateTimeOptions = () => {
  const hoursOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  return { hoursOptions, minutesOptions };
};

const calculateDateTimeRange = (
  tempSelectedDate: DateRange | undefined,
  startTime: string,
  endTime: string,
  seconds: number
) => {
  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);

  // Parse end time
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let from: Date | undefined;
  let to: Date | undefined;

  if (tempSelectedDate?.from) {
    from = dayjs(tempSelectedDate.from)
      .tz(APP_TIMEZONE)
      .hour(startHour)
      .minute(startMinute)
      .second(0)
      .toDate();
  }

  if (tempSelectedDate?.to) {
    to = dayjs(tempSelectedDate.to)
      .tz(APP_TIMEZONE)
      .hour(endHour)
      .minute(endMinute)
      .second(seconds)
      .toDate();
  } else if (from) {
    // If only from date is selected, set to as the same day with end time
    to = dayjs(from)
      .tz(APP_TIMEZONE)
      .hour(endHour)
      .minute(endMinute)
      .second(seconds)
      .toDate();
  }

  return { from, to };
};

// Time selector component
type TimeSelectorProps = {
  label: string;
  time: string;
  onTimeChange: (hour: string, minute: string) => void;
  hoursOptions: string[];
  minutesOptions: string[];
  idPrefix: string;
};

const TimeSelector: React.FC<TimeSelectorProps> = ({
  label,
  time,
  onTimeChange,
  hoursOptions,
  minutesOptions,
  idPrefix,
}) => {
  const [hour, minute] = time.split(':');

  return (
    <div className="grid gap-2">
      <Label htmlFor={`${idPrefix}-time`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Select
          value={hour}
          onValueChange={(value) => {
            onTimeChange(value, minute);
          }}
        >
          <SelectTrigger id={`${idPrefix}-hour`} className="w-20">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hoursOptions.map((h) => (
              <SelectItem key={`${idPrefix}-hour-${h}`} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select
          value={minute}
          onValueChange={(value) => {
            onTimeChange(hour, value);
          }}
        >
          <SelectTrigger id={`${idPrefix}-minute`} className="w-20">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minutesOptions.map((mnt) => (
              <SelectItem key={`${idPrefix}-minute-${mnt}`} value={mnt}>
                {mnt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

DateTimeRangePickerTwo.displayName = 'DateTimeRangePickerTwo';
