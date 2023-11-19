import React from "react";
import { Store } from "@/__generated__/client";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import StoreDetailsNavigation from "@/components/pages/store/StoreDetailsNavigation";

interface IProps {
  hideDetails?: boolean;
  store: Store;
  children?: React.ReactNode | React.ReactNode[];
}

const StoreDetailsContainer: React.FC<IProps> = ({
  store,
  hideDetails,
  children,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="remove-page-right-padding remove-page-left-padding">
        <OptimizedImage
          src={asset(store.image)}
          alt=""
          className="h-20 w-full object-cover object-center xs:h-40 md:h-auto"
        />
      </div>
      <StoreDetailsNavigation />
      {!hideDetails && (
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold">{store.name}</h1>
          <p className="text-3xl">{store.description}</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default StoreDetailsContainer;
