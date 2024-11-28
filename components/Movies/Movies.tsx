"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  Card,
  Select,
  Switch,
  Rate,
  message,
} from "antd";
import Link from "next/link";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  ClockCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { trpc } from "@/server/client";

interface MovieReview {
  id: string | number;
  name: string;
  releaseDate: string;
  avgRating: number | null;
}

const formatReleaseDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export default function MovieCritic() {
  const moviesQuery = trpc.movies.getAll.useQuery();
  const addMovie = trpc.movies.create.useMutation();
  const updateMovie = trpc.movies.update.useMutation();
  const deleteMovie = trpc.movies.delete.useMutation();
  const addReviewMutation = trpc.reviews.create.useMutation();
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddMovieModalVisible, setIsAddMovieModalVisible] =
    useState<boolean>(false);
  const [isAddReviewModalVisible, setIsAddReviewModalVisible] =
    useState<boolean>(false);
  const [isEditMovieModalVisible, setIsEditMovieModalVisible] =
    useState<boolean>(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [movieId, setMovieId] = useState<string>("");
  const [reviewer, setReviewer] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comments, setComments] = useState<string>("");
  const [editMovieId, setEditMovieId] = useState<string | number | undefined>(
    undefined
  );
  const [editName, setEditName] = useState<string>("");
  const [editReleaseDate, setEditReleaseDate] = useState<string>("");

  const handleAddMovie = () => {
    if (name && releaseDate) {
      addMovie.mutate(
        { name, releaseDate },
        {
          onSuccess: () => {
            setIsAddMovieModalVisible(false);
            setName("");
            setReleaseDate("");
            moviesQuery.refetch();
            message.success("Movie added successfully");
          },
        }
      );
    }
  };

  const handleAddReview = () => {
    if (movieId && rating !== undefined && comments) {
      addReviewMutation.mutate(
        {
          movieId: Number(movieId),
          reviewer: isAnonymous ? undefined : reviewer,
          rating,
          comments,
        },
        {
          onSettled: () => {
            setIsAddReviewModalVisible(false);
            setMovieId("");
            setReviewer("");
            setRating(undefined);
            setComments("");
            setIsAnonymous(false);
            moviesQuery.refetch();
            message.success("Review Added successfully");
          },
        }
      );
    }
  };

  const handleEditMovie = () => {
    if (editMovieId && editName && editReleaseDate) {
      updateMovie.mutate(
        {
          id: Number(editMovieId),
          name: editName,
          releaseDate: editReleaseDate,
        },
        {
          onSuccess: () => {
            setIsEditMovieModalVisible(false);
            setEditMovieId(undefined);
            setEditName("");
            setEditReleaseDate("");
            moviesQuery.refetch();
            message.success("Movie Edited successfully");
          },
        }
      );
    }
  };

  const handleDeleteMovie = () => {
    if (editMovieId) {
      deleteMovie.mutate(
        { id: Number(editMovieId) },
        {
          onSuccess: () => {
            setIsDeleteConfirmationVisible(false);
            setEditMovieId(undefined);
            moviesQuery.refetch();
            message.success("Movie Deleted successfully");
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center h-12 w-[35rem] bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-lg">
          <span className="flex items-center justify-center px-3 text-gray-300">
            <SearchOutlined className="text-gray-300 text-lg" />
          </span>
          <input
            type="text"
            placeholder="Search for your favourite movie"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-300 focus:text-white outline-none"
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-24 px-4 sm:px-0">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsAddMovieModalVisible(true)}
            className="bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-white hover:text-teal-400 
            h-10 sm:h-12 px-4 sm:px-6 text-base sm:text-lg transition-all backdrop-blur-sm w-full sm:w-auto"
          >
            Add New Movie
          </Button>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => setIsAddReviewModalVisible(true)}
            className="bg-[#1a1a1a] border border-purple-900/20 hover:border-teal-500/30 text-white hover:text-teal-400 
            h-10 sm:h-12 px-4 sm:px-6 text-base sm:text-lg transition-all backdrop-blur-sm w-full sm:w-auto"
          >
            Add New Review
          </Button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {moviesQuery.data
            ?.filter((movie) =>
              movie.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((movie: MovieReview) => (
              <Card
                key={movie.id}
                className="bg-[#1a1a1a] border-purple-900/20 hover:border-teal-500/30 transition-all backdrop-blur-sm"
                title={
                  <Link
                    href={`/reviews/${movie.id}-${movie.name}`}
                    className="text-white hover:text-teal-400 transition-colors"
                  >
                    {movie.name}
                  </Link>
                }
                extra={
                  <span className="flex items-center text-teal-400">
                    <StarFilled className="mr-1" />
                    {movie.avgRating !== null
                      ? movie.avgRating.toFixed(1)
                      : "N/A"}
                  </span>
                }
              >
                <div className="space-y-4">
                  <p className="text-zinc-400">
                    Release Date: {formatReleaseDate(movie.releaseDate)}
                  </p>
                  <hr className="border-purple-900/20" />
                  <div className="flex">
                    <div className="flex-1 flex justify-center items-center cursor-pointer">
                      <EditOutlined
                        className="text-zinc-300 hover:text-teal-400 transition-colors"
                        onClick={() => {
                          setEditMovieId(movie.id);
                          setEditName(movie.name);
                          setEditReleaseDate(movie.releaseDate);
                          setIsEditMovieModalVisible(true);
                        }}
                      />
                    </div>

                    <div className="text-purple-900/30 flex items-center">
                      |
                    </div>

                    <div className="flex-1 flex justify-center items-center cursor-pointer">
                      <DeleteOutlined
                        className="text-zinc-300 hover:text-red-400 transition-colors"
                        onClick={() => {
                          setEditMovieId(movie.id);
                          setIsDeleteConfirmationVisible(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        title={<span className="text-lg">Add Movie</span>}
        open={isAddMovieModalVisible}
        onOk={handleAddMovie}
        onCancel={() => setIsAddMovieModalVisible(false)}
        okText="Submit"
        okButtonProps={{
          className:
            "bg-[#1a1a1a] hover:bg-teal-500/30 border border-purple-900/20 hover:border-teal-500/30 text-white hover:text-teal-400 transition-all backdrop-blur-sm",
        }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-400 mb-2">Name:</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <p className="text-gray-400 mb-2">Release Date:</p>
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={<span className="text-lg">Add Review</span>}
        open={isAddReviewModalVisible}
        onOk={handleAddReview}
        onCancel={() => setIsAddReviewModalVisible(false)}
        okText="OK"
        okButtonProps={{
          className:
            "bg-blue-500 text-white hover:bg-blue-600 rounded px-4 py-2",
        }}
        cancelButtonProps={{
          className: "text-gray-500 hover:text-gray-700",
        }}
      >
        <div className="flex flex-col gap-4 ">
          {/* Movie Selection */}
          <div>
            <p className="text-black mb-2">Select Movie:</p>
            <Select
              placeholder="Select a movie"
              value={movieId}
              onChange={(value) => setMovieId(value)}
              className="w-full rounded"
            >
              {moviesQuery.data?.map((movie: MovieReview) => (
                <Select.Option key={movie.id} value={movie.id.toString()}>
                  {movie.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Anonymous/Named Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-black">Reviewer Type:</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  !isAnonymous ? "text-blue-600" : "text-black"
                }`}
              >
                Named
              </span>
              <Switch
                checked={isAnonymous}
                onChange={(checked) => setIsAnonymous(checked)}
              />
              <span
                className={`text-sm ${
                  isAnonymous ? "text-blue-600" : "text-black"
                }`}
              >
                Anonymous
              </span>
            </div>
          </div>

          {/* Reviewer Name Input */}
          {!isAnonymous && (
            <div>
              <p className="text-black mb-2">Reviewer Name:</p>
              <Input
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                placeholder="Enter your name"
                className="rounded"
              />
            </div>
          )}

          {/* Comments Input */}
          <div>
            <p className="text-black mb-2">Comments:</p>
            <Input.TextArea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Write your review here"
              className="rounded"
            />
          </div>

          {/* Star Rating */}
          <div>
            <p className="text-black mb-2">Rating:</p>
            <Rate
              value={rating}
              onChange={setRating}
              className="text-yellow-500 "
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={<span className="text-lg">Edit Movie</span>}
        open={isEditMovieModalVisible}
        onOk={handleEditMovie}
        onCancel={() => setIsEditMovieModalVisible(false)}
        okText="Update"
        okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-400 mb-2">Name:</p>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div>
            <p className="text-gray-400 mb-2">Release Date:</p>
            <Input
              type="date"
              value={editReleaseDate}
              onChange={(e) => setEditReleaseDate(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={<span className="text-lg">Confirm Deletion</span>}
        open={isDeleteConfirmationVisible}
        onOk={handleDeleteMovie}
        onCancel={() => setIsDeleteConfirmationVisible(false)}
        okText="Delete"
        okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
        cancelText="Cancel"
      >
        <p className="text-gray-400">
          Are you sure you want to delete this movie?
        </p>
      </Modal>
    </div>
  );
}
