import React from "react";
import { useSession } from "@/hooks/useSession";
import ProductReviewStars from "@/components/pages/product/ProductReviewStars";
import OutlinedButton from "@/components/shared/OutlinedButton";
import { usePathname, useRouter } from "next/navigation";
import { route } from "@/router";
import { ProductReview } from "@/__generated__/ssr";
import { Format } from "@/utils/format";
import Paging from "@/components/shared/Paging";

type Props = {
  avgRating: number;
  totalReviews: number;
  reviews: ProductReview[];
  page: number;
  totalPages: number;
  onPageChange(page: number): void;
};

const ReviewSection: React.FC<Props> = ({
  avgRating,
  totalReviews,
  reviews,
  totalPages,
  page,
  onPageChange,
}) => {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="remove-page-right-padding remove-page-left-padding page-right-padding page-left-padding -mb-20 bg-[#EADBC8]/30 pb-40 pt-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex items-start justify-between gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold">Reviews</p>
            <div className="flex items-center gap-6">
              <ProductReviewStars avgRating={avgRating} />
              <p className="text-3xl">
                {Format.rating(avgRating, totalReviews)}
              </p>
            </div>
          </div>
          {!session && (
            <OutlinedButton
              title="Login to add a review"
              className="bg-transparent"
              onClick={() =>
                router.push(
                  route("login") +
                    `?callbackUrl=${encodeURIComponent(pathname)}`,
                )
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-10 empty:hidden">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="max-w-2xl truncate text-2xl font-medium">
                    {review.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <ProductReviewStars
                      avgRating={review.rating}
                      starSize={24}
                    />
                    <p className="text-2xl">{review.rating}</p>
                  </div>
                </div>
                <p className="text-lg">{review.reviewerFullName}</p>
              </div>
              <div className="text-xl">{review.comment}</div>
              <div className="flex items-end justify-between gap-10">
                <p className="first-letter:uppercase">
                  {Format.relativeDate(review.postDate)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Paging
            initialPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
