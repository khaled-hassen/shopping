import React from "react";
import LinkButton from "@/components/shared/LinkButton";
import { route } from "@/router";

interface IProps {}

const PaymentSuccess: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-col items-center gap-6 pt-32">
      <h1 className="text-center text-5xl font-bold opacity-70">
        Payment failed
      </h1>
      <h2 className="text-center text-4xl">
        Something went wrong with your payment. <br /> Please try again.
      </h2>
    </div>
  );
};

export default PaymentSuccess;
