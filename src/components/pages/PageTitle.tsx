import React from "react";

interface IProps {
  title: string;
}

const PageTitle: React.FC<IProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-fit flex-col items-center gap-1">
        <div className="h-1 w-[80%] bg-black/50" />
        <h1 className="text-4xl">{title}</h1>
      </div>
    </div>
  );
};

export default PageTitle;
