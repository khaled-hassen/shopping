import React from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import { useSignal } from "@preact/signals-react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { clsx } from "clsx";
import Checkbox from "@/components/form/Checkbox";

interface IProps {
  label: string;
  error?: string;
  defaultValues?: Image[];
  onUpload(file: Image[]): void;
}

export interface Image {
  file: File | null;
  preview: string;
  cover: boolean;
}

const ProductImagesUpload: React.FC<IProps> = ({
  label,
  error,
  defaultValues,
  onUpload,
}) => {
  const images = useSignal<Image[]>(defaultValues || []);
  const selectedImage = useSignal<Image | null>(null);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const newImages: Image[] = Array.from(files).map((image, i) => ({
      file: image,
      preview: URL.createObjectURL(image),
      cover: i === 0,
    }));
    const uploadedImages = [...images.value, ...newImages];
    images.value = uploadedImages;
    selectedImage.value = uploadedImages[0];
    onUpload(uploadedImages);
  }

  function removeImage(index: number) {
    if (images.value[index].cover) {
      if (images.value[0]) images.value[0].cover = true;
    }

    const newImages = images.value.filter((_, i) => i !== index);
    images.value = newImages;
    selectedImage.value = null;
    onUpload(newImages);
  }

  function changeCoverImage(isCover: boolean) {
    if (!selectedImage.value) return;
    const newImages = images.value.map((image) => ({
      ...image,
      cover: image.preview === selectedImage.value?.preview ? isCover : false,
    }));
    images.value = newImages;
    onUpload(newImages);
  }

  return (
    <div className="flex flex-col gap-4 @container">
      <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
        <p className="text-xl font-bold">{label}</p>
        {!!error && <p className="text-danger font-bold">{error}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {images.value.map((image, index) => (
          <div
            key={index}
            className="relative"
            onClick={() => (selectedImage.value = image)}
          >
            {image.cover && (
              <p className="absolute left-3 top-3 bg-dark-gray px-3 py-0.5 text-sm text-primary">
                cover
              </p>
            )}
            {selectedImage.value?.preview === image.preview && (
              <button
                className="text-danger absolute right-3 top-3 bg-primary px-3 py-0.5 text-sm font-medium"
                onClick={() => removeImage(index)}
              >
                Delete
              </button>
            )}
            <OptimizedImage
              src={image.preview}
              alt=""
              className={clsx("aspect-auto h-60 w-auto object-contain", {
                "outline outline-4 outline-dark-gray":
                  selectedImage.value?.preview === image.preview,
              })}
            />
          </div>
        ))}
        <label className="grid h-60 w-60 place-content-center border border-dark-gray border-opacity-50 bg-transparent p-6 text-xl focus:outline-0">
          <span className="flex items-center gap-4 opacity-50">
            <UploadIcon />
            <span className="">Add new image</span>
          </span>

          <input
            type="file"
            accept="image/png,image/jpeg"
            hidden
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>
      {images.value.length > 0 && (
        <Checkbox
          key={selectedImage.value?.preview}
          label="Cover image"
          name="cover"
          defaultChecked={selectedImage.value?.cover}
          onCheck={changeCoverImage}
        />
      )}
    </div>
  );
};

export default ProductImagesUpload;
