import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

interface IProps {
  label: string;
  error?: string;
}

const RickTextEditor: React.FC<IProps> = ({ label, error }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
  });

  return (
    <div className="flex flex-col gap-4 @container">
      <div className="flex flex-col justify-between gap-4 @xs:flex-row @xs:items-center">
        <p className="text-xl font-bold">{label}</p>
        {!!error && <p className="font-bold text-red-600">{error}</p>}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RickTextEditor;
