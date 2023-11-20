import React from "react";
import * as Form from "@radix-ui/react-form";
import Button from "@/components/shared/Button";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import RickTextEditor from "@/components/form/RickTextEditor";

interface IProps {}

interface Image {
  file: File;
  preview: string;
  cover: boolean;
}

const NewProduct: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold">Create a new product</h1>
      <Form.Root className="flex flex-col gap-10">
        <Input label="Produt name" placeholder="Product name" />
        <Input
          label="Product brief description"
          placeholder="Short description"
        />
        <RickTextEditor label="Product description" />
        <Form.Submit asChild className="self-end">
          <Button title="Create product" type="submit" loading />
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default NewProduct;
