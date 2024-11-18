import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUserProfile } from "../../redux/slices/usersSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchPostsByUserId, addPost, Post, deletePostById } from "../../redux/slices/postsSlice";
import { usersPasswords } from "../../constants/usersPasswords";

import "./index.scss";


const UserAccountPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const { posts, loading: postsLoading } = useSelector((state: RootState) => state.posts);

  const user = users.find((u) => u.id === Number(userId));
  const userPosts = posts.filter((post) => post.userId === Number(userId));

  const [editableUser, setEditableUser] = useState({ name: user?.name, email: user?.email });


  const [isEditing, setIsEditing] = useState(false);
  const [newPost, setNewPost] = useState<Omit<Post, "id" | "userId">>({
    title: "",
    body: "",
    liked: false,
    favorite: false,
  });

  const isLoading = postsLoading || usersLoading;

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (usersPasswords[Number(userId)] === password) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  useEffect(() => {
    if (userId) {
      if (!user) dispatch(fetchUserById(Number(userId)));
      dispatch(fetchPostsByUserId(Number(userId)));
    }
  }, [dispatch, userId, user]);

  useEffect(() => {
    if (user) {
      setEditableUser({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = () => {
    if (editableUser) {
      dispatch(
        updateUserProfile({
          name: editableUser.name ?? "", // ?? при  undefined или null задает значение по умолчанию
          email: editableUser.email ?? "",
        })
      );
      setIsEditing(false);
    }
  };

  const handleAddPost = () => {
    if (newPost.title && newPost.body && userId) {
      dispatch(
        addPost({
          userId: Number(userId),
          title: newPost.title,
          body: newPost.body,
          liked: false,
          favorite: false,
        })
      );
      setNewPost({ title: "", body: "", liked: false, favorite: false });
    }
  };

  const handleDeletePost = (postId: number) => {
    dispatch(deletePostById(postId));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="user-authentication">
        <h2>Enter password for {user.name}</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleLogin}>Submit</button>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <button className="back-button" onClick={() => navigate("/")}>
        Back
      </button>

      <h1>User Details</h1>
      {isEditing ? (
        <div className="user-edit-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editableUser?.name || ""}
              onChange={handleUserChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editableUser?.email || ""}
              onChange={handleUserChange}
            />
          </label>
          <button onClick={handleSaveUser}>Save</button>
        </div>
      ) : (
        <div className="user-info">
          <p><strong>Name:</strong> {editableUser?.name}</p>
          <p><strong>Email:</strong> {editableUser?.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}

      <h2>Posts</h2>
      <div className="post-list">
        {userPosts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>

      <h3>Add New Post</h3>
      <div className="new-post-form">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
        />
        <textarea
          placeholder="Body"
          value={newPost.body}
          onChange={(e) => setNewPost((prev) => ({ ...prev, body: e.target.value }))}
        />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
    </div>
  );
};

export default UserAccountPage;

