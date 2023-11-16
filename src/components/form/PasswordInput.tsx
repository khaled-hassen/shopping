import React, { forwardRef } from "react";
import * as Form from "@radix-ui/react-form";
import EyeIcon from "@/components/icons/EyeIcon";
import { useSignal } from "@preact/signals-react";
import EyeOffIcon from "@/components/icons/EyeOffIcon";

interface IProps {
  label: string;
  placeholder: string;
  name: string;
  error?: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlur(e: React.FocusEvent<HTMLInputElement>): void;
}

const PasswordInput = forwardRef<HTMLInputElement, IProps>(
  ({ label, placeholder, error, name, onBlur, onChange }, ref) => {
    const show = useSignal(false);

    return (
      <Form.Field className="flex flex-col gap-4" name={name}>
        <div className="flex items-center justify-between gap-4">
          <Form.Label className="text-xl font-bold">{label}</Form.Label>
          {!!error && (
            <Form.Message className="font-bold text-red-600">
              {error}
            </Form.Message>
          )}
        </div>
        <div className="border-dark-gray flex items-center gap-4 border border-opacity-50 bg-transparent px-4 py-3 text-xl">
          <Form.Control asChild className="flex-1">
            <input
              type={show.value ? "text" : "password"}
              ref={ref}
              name={name}
              className="flex-1 bg-transparent focus:outline-0"
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
            />
          </Form.Control>
          <button type="button" onClick={() => (show.value = !show.value)}>
            {show.value ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </Form.Field>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
