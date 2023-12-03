import React from "react";
import { useSession } from "@/hooks/useSession";
import ProductReviewStars from "@/components/pages/product/ProductReviewStars";
import OutlinedButton from "@/components/shared/OutlinedButton";
import { usePathname, useRouter } from "next/navigation";
import { route } from "@/router";
import { ProductReview } from "@/__generated__/ssr";
import { Format } from "@/utils/format";
import Paging from "@/components/shared/Paging";
import * as Form from "@radix-ui/react-form";
import Button from "@/components/shared/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import {
  useAddNewReviewMutation,
  useUpdateReviewMutation,
} from "@/__generated__/client";
import { useSignal } from "@preact/signals-react";

type Props = {
  productId: string;
  avgRating: number;
  totalReviews: number;
  userReview: ProductReview | undefined | null;
  reviews: ProductReview[];
  page: number;
  totalPages: number;
  onPageChange(page: number): void;
  onReviewChanged(averageRating: number, totalReviews: number): void;
};

const reviewSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  comment: z.string().trim().min(1, "Required"),
  rating: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => !isNaN(parseFloat(val)), "Must be a number")
    .refine((val) => parseFloat(val ?? "0") >= 1, "Must be between 1 and 5")
    .refine((val) => parseFloat(val ?? "0") <= 5, "Must be between 1 and 5"),
});
type ReviewForm = z.infer<typeof reviewSchema>;

const ReviewSection: React.FC<Props> = ({
  userReview: initialUserReview,
  avgRating,
  totalReviews,
  reviews,
  totalPages,
  page,
  onPageChange,
  productId,
  onReviewChanged,
}) => {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const showEditor = useSignal(false);
  const userReview = useSignal(initialUserReview);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: userReview.value?.title,
      comment: userReview.value?.comment,
      rating: userReview.value?.rating.toString(),
    },
  });
  const [addReview, { data: newReviewData }] = useAddNewReviewMutation();
  const [updateReview, { data: updatedReviewData }] = useUpdateReviewMutation();

  async function createReview(review: ReviewForm) {
    let newTotalReviews = totalReviews;
    if (userReview.value) {
      const { data } = await updateReview({
        variables: {
          id: userReview.value.id,
          review: { ...review, rating: parseFloat(review.rating) },
        },
      });
      if (!data?.updateReview.updated) return;
      userReview.value = {
        __typename: userReview.value.__typename,
        averageRating: userReview.value.averageRating || 0,
        id: userReview.value.id,
        totalRatings: userReview.value.totalRatings,
        postDate: new Date().toString(),
        reviewerFullName: userReview.value.reviewerFullName,
        title: userReview.value.title,
        comment: userReview.value.comment,
        rating: userReview.value.rating,
      };
    } else {
      const { data } = await addReview({
        variables: {
          id: productId,
          review: { ...review, rating: parseFloat(review.rating) },
        },
      });
      const newReview = data?.addNewReview?.productReview;
      if (!newReview) return;
      totalReviews++;
      userReview.value = {
        __typename: "ProductReview",
        id: newReview.id,
        postDate: new Date().toString(),
        reviewerFullName: newReview.reviewerFullName,
        title: review.title,
        comment: review.comment,
        rating: parseFloat(review.rating),
        averageRating: 0,
        totalRatings: 0,
      };
    }

    const newAvgRating =
      (avgRating * totalReviews + parseFloat(review.rating)) / newTotalReviews;
    onReviewChanged(newAvgRating, newTotalReviews);
    showEditor.value = false;
  }

  function cancelReview() {
    reset({
      title: userReview.value?.title,
      comment: userReview.value?.comment,
      rating: userReview.value?.rating.toString(),
    });
    showEditor.value = false;
  }

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
          {!session ? (
            <OutlinedButton
              title="Login to add a review"
              className="bg-transparent text-black"
              onClick={() =>
                router.push(
                  route("login") +
                    `?callbackUrl=${encodeURIComponent(pathname)}`,
                )
              }
            />
          ) : (
            !showEditor.value && (
              <OutlinedButton
                title={userReview.value ? "Edit review" : "Add review"}
                className="bg-transparent text-black"
                onClick={() => (showEditor.value = true)}
              />
            )
          )}
        </div>

        {!!session && showEditor.value && (
          <Form.Root
            className="flex w-full flex-col gap-10"
            onSubmit={handleSubmit(createReview)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 empty:hidden">
                {newReviewData?.addNewReview?.errors?.map((error) => (
                  <p
                    key={error.message}
                    className="text-xl font-bold text-danger"
                  >
                    {error.message}
                  </p>
                ))}
                {updatedReviewData?.updateReview?.errors?.map((error) => (
                  <p
                    key={error.message}
                    className="text-xl font-bold text-danger"
                  >
                    {error.message}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <label
                    data-error={!!errors.rating?.message}
                    key={i}
                    className="h-12 w-12 cursor-pointer border border-dark-gray border-opacity-50 bg-transparent data-[error=true]:border-danger"
                  >
                    <input
                      className="peer "
                      value={i + 1}
                      type="radio"
                      hidden
                      {...register("rating")}
                    />
                    <span className="grid h-full w-full place-content-center text-xl peer-checked:bg-dark-gray peer-checked:text-white">
                      {i + 1}
                    </span>
                  </label>
                ))}
              </div>
              <Input
                label="Title"
                placeholder="Title"
                error={errors.title?.message}
                {...register("title")}
              />
              <TextArea
                label="Comment"
                placeholder="Comment"
                error={errors.comment?.message}
                {...register("comment")}
              />
            </div>
            <div className="flex items-center justify-end gap-6">
              <OutlinedButton
                title="Cancel review"
                type="button"
                onClick={cancelReview}
                className="bg-transparent"
              />
              <Form.Submit asChild>
                <Button
                  title="Save review"
                  type="submit"
                  loading={isSubmitting}
                />
              </Form.Submit>
            </div>
          </Form.Root>
        )}

        <div className="flex flex-col gap-10 empty:hidden">
          {!!userReview.value && !showEditor.value && (
            <div className="flex flex-col gap-4 bg-[#EADBC8]/50 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="max-w-2xl truncate text-2xl font-medium">
                    {userReview.value.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <ProductReviewStars
                      avgRating={userReview.value.rating}
                      starSize={24}
                    />
                    <p className="text-2xl">{userReview.value.rating}</p>
                  </div>
                </div>
                <p className="text-lg">{userReview.value.reviewerFullName}</p>
              </div>
              <div className="text-xl">{userReview.value.comment}</div>
              <p className="self-end first-letter:uppercase">
                {Format.relativeDate(userReview.value.postDate)}
              </p>
            </div>
          )}

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
              <p className="self-end first-letter:uppercase">
                {Format.relativeDate(review.postDate)}
              </p>
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
