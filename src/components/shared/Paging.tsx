import React from "react";
import ReactPaginate from "react-paginate";
import ChevronIcon from "@/components/icons/ChevronIcon";

interface IProps {
  initialPage: number;
  totalPages: number;
  onPageChange(page: number): void;
}

const Paging: React.FC<IProps> = ({
  initialPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      className="flex w-fit border border-dark-gray border-opacity-20 child:p-2"
      pageClassName="text-lg"
      activeClassName="border-b border-dark-gray"
      nextLabel={<ChevronIcon />}
      previousLabel={<ChevronIcon className="rotate-180" />}
      previousClassName="border-r border-dark-gray border-opacity-20 w-11 grid place-content-center mr-6"
      nextClassName="border-l border-dark-gray border-opacity-20 w-11 grid place-content-center ml-6"
      nextLinkClassName="w-fit block"
      previousLinkClassName="w-fit block"
      initialPage={initialPage - 1}
      pageCount={totalPages}
      pageRangeDisplayed={1}
      renderOnZeroPageCount={null}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
    />
  );
};

export default Paging;
