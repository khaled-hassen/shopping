import React from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import { useSignal } from "@preact/signals-react";
import { clsx } from "clsx";
import OptimizedImage from "@/components/shared/OptimizedImage";

interface IProps {
  label: string;
  error?: string;
  defaultValue?: string;
  onUpload(file: File | null): void;
}

const Input: React.FC<IProps> = ({ label, error, defaultValue, onUpload }) => {
  const previewUrl = useSignal<string>(defaultValue || "");

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files;
    if (!image) return onUpload(null);
    previewUrl.value = URL.createObjectURL(image[0]);
    onUpload(image[0]);
  }

  return (
    <div className="flex flex-col gap-4 @container">
      <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
        <p className="text-xl font-bold">{label}</p>
        {!!error && <p className="font-bold text-red-600">{error}</p>}
      </div>

      <label
        className={clsx(
          "grid place-content-center border border-dark-gray border-opacity-50 bg-transparent p-6 text-xl focus:outline-0",
          { "h-40": !previewUrl.value },
        )}
      >
        {previewUrl.value ? (
          <OptimizedImage
            src={previewUrl.value}
            alt=""
            className="aspect-auto h-auto w-full object-contain"
          />
        ) : (
          <span className="flex items-center gap-4 opacity-50">
            <UploadIcon />
            <span className="">Click here to upload image</span>
          </span>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          hidden
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};

export default Input;
