import React from "react";

interface IProps {}

const Error404: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-col items-center gap-6 pt-40">
      <h2 className="text-6xl font-bold opacity-70">404</h2>
      <h1 className="text-center text-5xl">Page not found</h1>
    </div>
  );
};

export default Error404;
