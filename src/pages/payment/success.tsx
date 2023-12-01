import React from "react";
import LinkButton from "@/components/shared/LinkButton";
import { route } from "@/router";

interface IProps {}

const PaymentSuccess: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-col items-center gap-6 pt-32">
      <h1 className="text-center text-5xl font-bold opacity-70">
        Payment was successful
      </h1>
      <h2 className="text-center text-4xl">
        Thank you for your purchase. <br /> You will receive an email with your
        order details shortly.
      </h2>
      <LinkButton title="View orders" href={route("orders")} />
    </div>
  );
};

export default PaymentSuccess;
