import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchCommentsByPostId } from '../../redux/slices/commentsSlice';
import { toggleLike, toggleDislike, toggleFavorite, Post } from '../../redux/slices/postsSlice';
import { addComment } from '../../redux/slices/commentsSlice';
import { AiFillDislike, AiFillLike } from "react-icons/ai"
import { FaStar } from "react-icons/fa";

import './index.scss';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === Number(postId))
  );
  const comments = useSelector((state: RootState) =>
    state.comments.comments[Number(postId)] || []
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsByPostId(Number(postId)));
    }
  }, [dispatch, postId]);

  const handleLike = (post: Post) => {
    if (!post.liked) {
      dispatch(toggleLike(post.id));
      if (post.disliked) {
        dispatch(toggleDislike(post.id)); // Убираем дизлайк, если был нажат
      }
    } else {
      dispatch(toggleLike(post.id)); // Снимаем лайк
    }
  };

  const handleDislike = (post: Post) => {
    if (!post.disliked) {
      dispatch(toggleDislike(post.id));
      if (post.liked) {
        dispatch(toggleLike(post.id)); // Убираем лайк, если был нажат
      }
    } else {
      dispatch(toggleDislike(post.id)); // Снимаем дизлайк
    }
  };

  const handleAddComment = (commentBody: string) => {
    dispatch(addComment({ postId: Number(postId), body: commentBody }));
  };

  console.log(post);


  if (!post) {
    return <div>Post not found</div>;
  }


  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      {/* Кнопки лайков, дизлайков и добавления в избранное */}


      {/* <button onClick={() => dispatch(toggleLike(post.id))}>
        {post.liked ? 'Unlike' : 'Like'}
      </button>
      <button onClick={() => dispatch(toggleDislike(post.id))}>
        {post.disliked ? 'Remove Dislike' : 'Dislike'}
      </button> */}
      {/* //---------------------------------------------------------------------------- */}
      {/* <button onClick={() => handleLike(post)}>
        {post.liked ? 'Unlike' : 'Like'}
      </button>
      <button onClick={() => handleDislike(post)}>
        {post.disliked ? 'Remove Dislike' : 'Dislike'}
      </button> */}

      <div
        className="like-btn"
        onClick={() => handleLike(post)}
      >
        <AiFillLike size={30} color={post.liked ? "f0768b" : "#ccc"} />
      </div>
      <div
        className="dislike-btn"
        onClick={() => handleDislike(post)}
      >
        <AiFillDislike size={30} color={post.disliked ? "f0768b" : "#ccc"} />
      </div>

      <div className="favorites-btn" onClick={() => dispatch(toggleFavorite(post.id))}>
        <FaStar size={30} color={post.favorite ? "#ffd700" : "#ccc"} />
      </div>

      {/* Комментарии */}
      <div className="comments-section">
        <h2>Comments</h2>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.body}</li>
          ))}
        </ul>

        {/* Форма для добавления комментария */}
        <AddCommentForm onAddComment={handleAddComment} />
      </div>
    </div>
  );
};

// Компонент формы для добавления комментария
export const AddCommentForm: React.FC<{ onAddComment: (commentBody: string) => void }> = ({ onAddComment }) => {
  const [comment, setComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='add-comment-form'>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostDetail;