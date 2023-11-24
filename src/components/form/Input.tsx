import React, { forwardRef } from "react";
import * as Form from "@radix-ui/react-form";

interface IProps {
  label: string;
  placeholder: string;
  name: string;
  error?: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(e: React.FocusEvent<HTMLInputElement>): void;
}

const Input = forwardRef<HTMLInputElement, IProps>(
  ({ label, placeholder, error, name, onBlur, onChange }, ref) => {
    return (
      <Form.Field className="flex flex-col gap-4 @container" name={name}>
        <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
          <Form.Label className="text-xl font-bold">{label}</Form.Label>
          {!!error && (
            <Form.Message className="text-danger font-bold">
              {error}
            </Form.Message>
          )}
        </div>
        <Form.Control asChild>
          <input
            ref={ref}
            name={name}
            className="border border-dark-gray border-opacity-50 bg-transparent px-4 py-3 text-xl focus:outline-0"
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Form.Control>
      </Form.Field>
    );
  },
);

Input.displayName = "Input";
export default Input;
