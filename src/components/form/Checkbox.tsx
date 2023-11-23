import React, { forwardRef } from "react";
import * as Form from "@radix-ui/react-form";
import CheckIcon from "@/components/icons/CheckIcon";
import { useSignal } from "@preact/signals-react";

interface IProps {
  label: string;
  name: string;
  error?: string;
  defaultChecked?: boolean;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlur?(e: React.FocusEvent<HTMLInputElement>): void;
  onCheck?(value: boolean): void;
}

const Checkbox = forwardRef<HTMLInputElement, IProps>(
  ({ label, error, name, defaultChecked, onBlur, onChange, onCheck }, ref) => {
    const checked = useSignal(defaultChecked);

    return (
      <Form.Field className="flex flex-col gap-1" name={name}>
        <div className="flex items-center gap-4">
          <Form.Control asChild>
            <input
              ref={ref}
              name={name}
              type="checkbox"
              defaultChecked={defaultChecked}
              hidden
              onChange={(e) => {
                checked.value = e.target.checked;
                onChange?.(e);
                onCheck?.(e.target.checked);
              }}
              onBlur={onBlur}
            />
          </Form.Control>
          <div className="grid h-6 w-6 place-content-center border border-dark-gray border-opacity-50 bg-transparent p-2">
            {checked.value && <CheckIcon />}
          </div>
          <Form.Label className="text-xl first-letter:uppercase">
            {label}
          </Form.Label>
        </div>
        {!!error && (
          <Form.Message className="font-bold text-red-600">
            {error}
          </Form.Message>
        )}
      </Form.Field>
    );
  },
);

Checkbox.displayName = "Input";
export default Checkbox;
