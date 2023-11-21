import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface IProps {
  label: string;
  error?: string;
}

const RickTextEditor: React.FC<IProps> = ({ label, error }) => {
  return (
    <div className="flex flex-col gap-4 @container">
      <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
        <p className="text-xl font-bold">{label}</p>
        {!!error && <p className="font-bold text-red-600">{error}</p>}
      </div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
        init={{
          content_style: "body { background-color: #F1EFEF; }",
          height: 500,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat",
        }}
      />
    </div>
  );
};

export default RickTextEditor;
