import React from "react";
import Dropdown, { ClassNamesConfig } from "react-select";

export interface SelectOption {
  label: string;
  value: string;
}

interface IProps {
  label: string;
  defaultValue?: SelectOption;
  placeholder?: string;
  error?: string;
  options?: SelectOption[];
  disabled?: boolean;
  onSelect?(val: SelectOption): void;
}

const classNames: ClassNamesConfig = {
  control: ({ isFocused, isDisabled }) =>
    `!border !border-dark-gray ${
      isFocused ? "" : "!border-opacity-50"
    } !rounded-none ${
      isDisabled ? "!bg-dark-gray/10 !opacity-60" : "!bg-transparent"
    } !shadow-none`,
  menu: ({}) => "!bg-primary !rounded-none",
  option: ({ isFocused, isSelected }) =>
    `${
      isSelected ? "!bg-dark-gray" : isFocused ? "!bg-dark-gray/10" : ""
    } !capitalize !text-lg`,
  singleValue: ({}) => "!capitalize !text-lg",
};

const Select: React.FC<IProps> = ({
  defaultValue,
  label,
  placeholder,
  disabled,
  options,
  error,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-4 @container">
      <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
        <p className="text-xl font-bold">{label}</p>
        {!!error && <p className="text-danger font-bold">{error}</p>}
      </div>
      <Dropdown
        defaultValue={defaultValue}
        menuPortalTarget={
          typeof document === "undefined" ? undefined : document.body
        }
        isDisabled={disabled}
        options={options}
        placeholder={placeholder}
        classNames={classNames}
        onChange={onSelect as any}
      />
    </div>
  );
};

export default Select;
