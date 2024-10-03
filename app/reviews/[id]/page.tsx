"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../../server/client";
import { useParams } from "next/navigation";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const MovieReviews = () => {
  const { id } = useParams();
  console.log(id);

  const [movieId, movieName] = id.toLocaleString()?.split("-");
  console.log(movieName);

  const reviewsQuery = trpc.reviews.getReviewsByMovieId.useQuery({
    movieId: Number(movieId),
  });

  if (reviewsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (reviewsQuery.isError) {
    return <div>Error loading reviews</div>;
  }

  const reviews = reviewsQuery.data;
  const length = (reviews || [])?.length;
  const avgRating =
    (reviews || [])?.reduce((acc, review) => acc + review.rating, 0) / length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{`Reviews for Movie ${id}`}</h1>
        <div className="text-purple-500 text-2xl">
          {avgRating > 0 ? `${avgRating} / 10` : "N/A"}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews?.length === 0 ? (
          <p>No reviews for this movie yet.</p>
        ) : (
          reviews?.map((review) => (
            <div key={review.id} className="border p-4 rounded-md shadow-md">
              {/* Comments */}
              <p className="text-lg mb-2">
                <strong>Comments:</strong> {review.comments}
              </p>

              {/* Rating */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm italic text-gray-600">
                  <strong>Reviewer:</strong> {review.reviewer || "Anonymous"}
                </p>
                <div className="flex space-x-2">
                  <EditOutlined className="text-gray-500 cursor-pointer hover:text-blue-500" />
                  <DeleteOutlined className="text-gray-500 cursor-pointer hover:text-red-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieReviews;
