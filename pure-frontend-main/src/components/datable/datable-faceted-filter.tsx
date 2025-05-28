import type { Column } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Check, PlusCircle } from 'lucide-react';

import type { Option } from '@/common/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { DateTimePicker } from '../date-time-picker';

interface DatableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  disabled?: boolean;
  datePicker?: boolean;
}

export function DatableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  disabled,
  datePicker = false,
}: DatableFacetedFilterProps<TData, TValue>) {
  const unknownValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(unknownValue) ? unknownValue : []
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          disabled={disabled}
        >
          <PlusCircle className="mr-2 size-4" />
          {title}
          {datePicker && selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  key={selectedValues.keys().next().value}
                  className="rounded-sm px-1 font-normal"
                >
                  {dayjs(selectedValues.values().next().value).format(
                    'DD/MM/YYYY HH:mm'
                  )}
                </Badge>
              </div>
            </>
          )}
          {!datePicker && selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      {datePicker ? (
        <PopoverContent className="w-auto p-0" align="start">
          <DateTimePicker
            selected={
              unknownValue ? new Date(unknownValue as string) : new Date()
            }
            onChange={(newDateTime) => {
              selectedValues.clear();
              selectedValues.add(newDateTime?.toISOString());

              const filterValues = Array.from(selectedValues);
              column?.setFilterValue(
                filterValues.length ? filterValues : undefined
              );
            }}
            disabled={disabled}
            allowFuture={true}
            className="w-full"
            asChild={true}
          />
        </PopoverContent>
      ) : (
        <PopoverContent className="w-[12.5rem] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList className="max-h-full">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className="size-4" aria-hidden="true" />
                      </div>
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
