import React from "react";
import { Store } from "@/__generated__/client";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import StoreDetailsNavigation from "@/components/pages/store/StoreDetailsNavigation";

interface CommonProps {
  children?: React.ReactNode | React.ReactNode[];
}

interface OnlyNavigationProps {
  onlyNavigation: true;
  store?: never;
  hideDetails?: never;
}

interface StoreProps {
  hideDetails?: boolean;
  store: Store;
  onlyNavigation?: never;
}

type Props = (StoreProps | OnlyNavigationProps) & CommonProps;

const StoreDetailsContainer: React.FC<Props> = ({
  onlyNavigation,
  store,
  hideDetails,
  children,
}) => {
  return (
    <div className="flex flex-col gap-10">
      {!onlyNavigation && (
        <div className="remove-page-right-padding remove-page-left-padding -mt-10">
          <OptimizedImage
            src={asset(store.image)}
            alt=""
            className="h-20 w-full object-cover object-center xs:h-40 md:h-auto"
          />
        </div>
      )}
      <StoreDetailsNavigation />
      {!onlyNavigation && !hideDetails && (
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
