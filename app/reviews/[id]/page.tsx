"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../../server/client";
import { useParams } from "next/navigation";
import {
  DeleteOutlined,
  EditOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center md:text-left w-full md:w-auto">
            Reviews for {movieName}
          </h1>
          <div className="flex items-center bg-[#7f5b5b] rounded-full px-4 py-2">
            <StarFilled className="text-yellow-500 mr-2 text-lg md:text-xl" />
            <span className="text-xl md:text-2xl">
              {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No reviews for this movie yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#222222] p-4 md:p-6 rounded-lg shadow-lg flex flex-col md:flex-row"
              >
                <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                  <p className="text-base md:text-lg mb-4">{review.comments}</p>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400 mb-2">
                        Reviewer: {review.reviewer || "Anonymous"}
                      </p>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        className="text-yellow-500 mb-2 md:mb-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-start md:justify-center space-x-2 md:space-x-0 md:space-y-2">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showEditModal(review)}
                    className="flex-1 md:flex-none bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-white hover:text-teal-400 transition-all backdrop-blur-sm"
                  >
                    <span className="md:hidden">Edit</span>
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteModal(review)}
                    className="flex-1 md:flex-none bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-red-400 hover:text-teal-400 transition-all backdrop-blur-sm"
                  >
                    <span className="md:hidden">Delete</span>
                  </Button>
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
          <Rate
            value={newRating}
            onChange={setNewRating}
            className="text-yellow-500"
          />
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
