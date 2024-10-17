"use client";

import { useState } from "react";
import { Button, Input, Modal, Card, Select } from "antd";
import Link from "next/link";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
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
  const updateMovie = trpc.movies.update.useMutation({
    onSuccess: () => {
      console.log("Movie updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating movie:", error);
    },
  });
  const deleteMovie = trpc.movies.delete.useMutation({
    onSuccess: () => {
      console.log("Movie deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting movie:", error);
    },
  });
  const addReviewMutation = trpc.reviews.create.useMutation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddMovieModalVisible, setIsAddMovieModalVisible] =
    useState<boolean>(false);
  const [isAddReviewModalVisible, setIsAddReviewModalVisible] =
    useState<boolean>(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");

  const [movieId, setMovieId] = useState<string | undefined>(undefined);
  const [reviewer, setReviewer] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comments, setComments] = useState<string>("");

  const [isEditMovieModalVisible, setIsEditMovieModalVisible] =
    useState<boolean>(false);
  const [editMovieId, setEditMovieId] = useState<string | number | undefined>(
    undefined
  );
  const [editName, setEditName] = useState<string>("");
  const [editReleaseDate, setEditReleaseDate] = useState<string>("");

  const showAddMovieModal = () => {
    setIsAddMovieModalVisible(true);
  };

  const showAddReviewModal = () => {
    setIsAddReviewModalVisible(true);
  };

  const handleAddMovieOk = () => {
    if (name && releaseDate) {
      addMovie.mutate(
        { name, releaseDate },
        {
          onSuccess: () => {
            setIsAddMovieModalVisible(false);
            setName("");
            setReleaseDate("");
            moviesQuery.refetch();
          },
        }
      );
    }
  };

  const handleAddReviewOk = () => {
    if (movieId && reviewer && rating !== undefined && comments) {
      addReviewMutation.mutate(
        { movieId: Number(movieId), reviewer, rating, comments },
        {
          onSettled: () => {
            setIsAddReviewModalVisible(false);
            setMovieId(undefined);
            setReviewer("");
            setRating(undefined);
            setComments("");
            moviesQuery.refetch();
          },
        }
      );
    }
  };

  const handleEditClick = (movie: MovieReview) => {
    setEditMovieId(movie.id);
    setEditName(movie.name);
    setEditReleaseDate(movie.releaseDate);
    setIsEditMovieModalVisible(true);
  };

  const handleEditMovieOk = () => {
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
          },
        }
      );
    }
  };

  const handleDeleteClick = (movieId: string) => {
    setEditMovieId(movieId);
    setIsDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirmation = () => {
    if (editMovieId) {
      deleteMovie.mutate(
        { id: Number(editMovieId) },
        {
          onSuccess: () => {
            setIsDeleteConfirmationVisible(false);
            setEditMovieId(undefined);
            moviesQuery.refetch();
          },
          onError: (error) => {
            console.error("Error deleting movie:", error);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setIsAddMovieModalVisible(false);
    setIsAddReviewModalVisible(false);
    setIsEditMovieModalVisible(false);
    setIsDeleteConfirmationVisible(false);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8 bg-gray-100 p-4 rounded-lg">
        <h1 className="text-2xl font-bold">MOVIECRITIC</h1>
        <div className="space-x-2">
          <Button type="primary" onClick={showAddMovieModal}>
            Add new movie
          </Button>
          <Button onClick={showAddReviewModal}>Add new review</Button>
        </div>
      </header>

      <h2 className="text-3xl font-bold mb-6">The best movie reviews site!</h2>

      <div className="relative mb-8">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search for your favourite movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moviesQuery.data
          ?.filter((movie) =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((movie: MovieReview) => (
            <Card
            key={movie.id}
            title={
              <Link href={`/reviews/${movie.id}-${movie.name}`} passHref>
                {movie.name}
              </Link>
            }
            extra={
              <span>
                {movie.avgRating !== null ? movie.avgRating.toFixed(1) : "N/A"}
              </span>
            }
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => handleEditClick(movie)}
              />,
              <DeleteOutlined
                key="delete"
                onClick={() => handleDeleteClick(movie.id.toString())}
              />,
            ]}
          >
            <Link href={`/reviews/${movie.id}-${movie.name}`} passHref>
              <p>Release Date: {formatReleaseDate(movie.releaseDate)}</p>
            </Link>
          </Card>
          
          
          ))}
      </div>

      <Modal
        title="Add Movie"
        visible={isAddMovieModalVisible}
        onOk={handleAddMovieOk}
        onCancel={handleCancel}
        okText="Submit"
      >
        <div className="flex flex-col gap-3">
          <p>Name:</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <p>Release Date:</p>
          <Input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Add Review"
        visible={isAddReviewModalVisible}
        onOk={handleAddReviewOk}
        onCancel={handleCancel}
        okText="Submit"
      >
        <div className="flex flex-col gap-3">
          <Select
            placeholder="Select a movie"
            value={movieId}
            onChange={(value) => setMovieId(value)}
          >
            {moviesQuery.data?.map((movie: MovieReview) => (
              <Select.Option key={movie.id} value={movie.id}>
                {movie.name}
              </Select.Option>
            ))}
          </Select>
          <p>Reviewer Name:</p>
          <Input
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
          />
          <p>Rating:</p>
          <Input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
          />
          <p>Comments:</p>
          <Input.TextArea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Edit Movie"
        visible={isEditMovieModalVisible}
        onOk={handleEditMovieOk}
        onCancel={() => setIsEditMovieModalVisible(false)}
        okText="Update"
      >
        <div className="flex flex-col gap-3">
          <p>Name:</p>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <p>Release Date:</p>
          <Input
            type="date"
            value={editReleaseDate}
            onChange={(e) => setEditReleaseDate(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={isDeleteConfirmationVisible}
        onOk={handleDeleteConfirmation}
        onCancel={handleCancel}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this movie?</p>
      </Modal>
    </div>
  );
}
