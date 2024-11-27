"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../../server/client";
import { useParams } from "next/navigation";
import { DeleteOutlined, EditOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import { Modal, Input, Rate, message, Button, Switch } from "antd";

interface Review {
  id: number;
  comments: string;
  rating: number;
  reviewer?: string | null;
}

const MovieReviews = () => {
  const { id } = useParams();
  const [movieId, encodedMovieName] = id.toLocaleString()?.split("-");
  const movieName = decodeURIComponent(encodedMovieName);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [newComments, setNewComments] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newReviewer, setNewReviewer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

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
    return <div className="text-white">Loading...</div>;
  }

  if (reviewsQuery.isError) {
    return <div className="text-red-500">Error loading reviews</div>;
  }

  const reviews: Review[] = reviewsQuery.data || [];
  const length = reviews.length;
  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / length;

  const showEditModal = (review: Review) => {
    setSelectedReview(review);
    setNewComments(review.comments);
    setNewRating(review.rating);
    setNewReviewer(review.reviewer || "");
    setIsAnonymous(!review.reviewer);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    if (selectedReview) {
      editReviewMutation.mutate({
        movieId: Number(movieId),
        comments: newComments,
        rating: newRating,
        reviewer: isAnonymous ? undefined : newReviewer,
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
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reviews for {movieName}</h1>
          <div className="flex items-center bg-[#7f5b5b] rounded-full px-4 py-2">
            <StarFilled className="text-yellow-500 mr-2" />
            <span className="text-2xl">
              {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No reviews for this movie yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-[#222222] p-6 rounded-lg shadow-lg">
                <p className="text-lg mb-4">{review.comments}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      Reviewer: {review.reviewer || "Anonymous"}
                    </p>
                    <Rate disabled defaultValue={review.rating} className="text-yellow-500" />
                  </div>
                  <div className="space-x-2">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(review)}
                      className="bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-white hover:text-teal-400 transition-all backdrop-blur-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteModal(review)}
                      className="bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-red-400 hover:text-teal-400 transition-all backdrop-blur-sm"
                    >
                      Delete
                    </Button>
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
          okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
        >
          <div className="mb-4">
            <Switch
              checked={!isAnonymous}
              onChange={(checked) => setIsAnonymous(!checked)}
              checkedChildren="Named"
              unCheckedChildren="Anonymous"
              className="mb-2"
            />
            {!isAnonymous && (
              <Input
                placeholder="Your Name"
                value={newReviewer}
                onChange={(e) => setNewReviewer(e.target.value)}
                prefix={<UserOutlined className="text-gray-400" />}
                className="mb-2"
              />
            )}
          </div>
          <Input.TextArea
            placeholder="Comments"
            value={newComments}
            onChange={(e) => setNewComments(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Rate value={newRating} onChange={setNewRating} className="text-yellow-500" />
        </Modal>

        <Modal
          title="Confirm Delete"
          visible={isDeleteModalVisible}
          onOk={handleDeleteOk}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
        >
          <p>Are you sure you want to delete this review?</p>
        </Modal>
      </div>
    </div>
  );
};

export default MovieReviews;

