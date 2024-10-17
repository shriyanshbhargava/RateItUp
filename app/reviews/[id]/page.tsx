"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../../server/client";
import { useParams } from "next/navigation";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, Input, Rate, message } from "antd";

interface Review {
  id: number;
  comments: string;
  rating: number;
  reviewer?: string | null;
}

const MovieReviews = () => {
  const { id } = useParams();
  const [movieId, movieName] = id.toLocaleString()?.split("-");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [newComments, setNewComments] = useState("");
  const [newRating, setNewRating] = useState(0);

  const reviewsQuery = trpc.reviews.getReviewsByMovieId.useQuery({
    movieId: Number(movieId),
  });

  const deleteReviewMutation = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      message.success("Review deleted successfully");
      reviewsQuery.refetch();
    },
    onError: () => {
      message.error("Failed to delete review");
    },
  });

  const editReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      message.success("Review updated successfully");
      setIsEditModalVisible(false);
      reviewsQuery.refetch();
    },
    onError: () => {
      message.error("Failed to update review");
    },
  });

  if (reviewsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (reviewsQuery.isError) {
    return <div>Error loading reviews</div>;
  }

  const reviews: Review[] = reviewsQuery.data || [];
  const length = reviews.length;
  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / length;

  const showEditModal = (review: Review) => {
    setSelectedReview(review);
    setNewComments(review.comments);
    setNewRating(review.rating);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    if (selectedReview) {
      editReviewMutation.mutate({
        movieId: Number(movieId),
        comments: newComments,
        rating: newRating,
      });
    }
  };

  const showDeleteModal = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = () => {
    if (selectedReview && selectedReview.id !== null) {
      deleteReviewMutation.mutate({ id: selectedReview.id });
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{`Reviews for Movie ${movieName}`}</h1>
        <div className="text-purple-500 text-2xl">
          {avgRating > 0 ? `${avgRating} / 10` : "N/A"}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p>No reviews for this movie yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded-md shadow-md">
              <p className="text-lg mb-2">
                <strong>Comments:</strong> {review.comments}
              </p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm italic text-gray-600">
                  <strong>Reviewer:</strong> {review.reviewer || "Anonymous"}
                </p>
                <div className="flex space-x-2">
                  <EditOutlined
                    className="text-gray-500 cursor-pointer hover:text-blue-500"
                    onClick={() => showEditModal(review)}
                  />
                  <DeleteOutlined
                    className="text-gray-500 cursor-pointer hover:text-red-500"
                    onClick={() => showDeleteModal(review)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        title="Edit Review"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Input
          placeholder="Comments"
          value={newComments}
          onChange={(e) => setNewComments(e.target.value)}
        />
        <Rate className="mt-4" value={newRating} onChange={setNewRating} />
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this review?</p>
      </Modal>
    </div>
  );
};

export default MovieReviews;
