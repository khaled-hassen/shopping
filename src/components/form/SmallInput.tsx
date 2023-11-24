import React, { forwardRef } from "react";
import * as Form from "@radix-ui/react-form";
import { twMerge } from "tailwind-merge";

interface IProps {
  label: string;
  placeholder: number | string;
  name: string;
  error?: string;
  unit?: string;
  type?: "text" | "number";
  maxValue?: number;
  disabled?: boolean;
  inputClassName?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlur?(e: React.FocusEvent<HTMLInputElement>): void;
}

const SmallInput = forwardRef<HTMLInputElement, IProps>(
  (
    {
      label,
      placeholder,
      error,
      name,
      disabled,
      maxValue,
      unit,
      type = "text",
      inputClassName,
      onBlur,
      onChange,
    },
    ref,
  ) => {
    return (
      <Form.Field
        className="flex min-w-fit max-w-full flex-col gap-1"
        name={name}
      >
        <div className="flex items-center gap-2 border border-dark-gray border-opacity-50 bg-transparent px-4 py-1 text-lg">
          <Form.Label className="whitespace-nowrap font-medium first-letter:capitalize">
            {label}:
          </Form.Label>
          <Form.Control asChild>
            <input
              min={0}
              max={type === "number" ? maxValue : undefined}
              type={type}
              disabled={disabled}
              ref={ref}
              name={name}
              placeholder={placeholder.toString()}
              className={twMerge(
                "w-20 bg-transparent text-xl focus:outline-0",
                inputClassName,
              )}
              onChange={(e) => {
                if (type === "number") {
                  e.target.value = Math.max(
                    0,
                    e.target.valueAsNumber,
                  ).toString();
                  if (maxValue !== undefined)
                    e.target.value = Math.min(
                      maxValue,
                      e.target.valueAsNumber,
                    ).toString();
                }
                onChange?.(e);
              }}
              onBlur={onBlur}
            />
          </Form.Control>
          {!!unit && <span className="uppercase">{unit}</span>}
        </div>
        {!!error && (
          <Form.Message className="text-danger font-bold">{error}</Form.Message>
        )}
      </Form.Field>
    );
  },
);

SmallInput.displayName = "SmallInput";
export default SmallInput;
