import styles from './style.module.scss';
import Button from '../Button';
import Star from '../Star';
import Rating from '../../components/Rating';
import Modal from '../../components/Modal';
import actions from '../../redux/actions';
import { getError } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

const Reviews = ({ productId }) => {
  const [reviewItem, setReviewItem] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const alertDispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const fetchReviews = async () => {
    const { data } = await axios.get(`/api/reviews/${productId}`);
    const reviews = [...data].slice(0, 3);
    setReviews(reviews);
    setAllReviews(data);
  };
  useEffect(() => {
    if (user) {
      const review = allReviews.find((item) => item.userId === user._id);
      if (review && review._id) {
        setReviewed(true);
        setRating(review.rating);
        setText(review.text);
        setReviewItem(review);
      } else {
        setReviewed(false);
      }
    }
  }, [allReviews]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alertDispatch(actions.showAlert("Rating can't be zero", 'error'));
      return;
    }
    if (text.length > 120) {
      alertDispatch(actions.showAlert('Text is too long', 'error'));
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/reviews`,
        { productId, rating, text },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      alertDispatch(actions.showAlert(data.message, 'success'));
      setRating(0);
      setText('');
      fetchReviews();
    } catch (err) {
      alertDispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alertDispatch(actions.showAlert("Rating can't be zero", 'error'));
      return;
    }
    if (text.length > 120) {
      alertDispatch(actions.showAlert('Text is too long', 'error'));
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/reviews/u/${reviewItem._id}`,
        { rating, text },
        { headers: { authorization: `Bearer ${user.token}` } }
      );
      alertDispatch(actions.showAlert(data.message, 'success'));
      fetchReviews();
      setIsEditing(false);
    } catch (err) {
      alertDispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  const handleDelete = async () => {
    try {
      if (confirm('Are you sure?')) {
        const { data } = await axios.delete(
          `/api/reviews/u/${reviewItem._id}`,
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );

        alertDispatch(actions.showAlert(data.message, 'success'));
        setRating(0);
        setText('');
        fetchReviews();
      }
    } catch (err) {
      alertDispatch(actions.showAlert(getError(err), 'error'));
    }
  };
  const showAllReviewsHandler = () => {
    setShowAllReviews(!showAllReviews);
    if (showAllReviews) {
      setReviews(allReviews);
    } else {
      setReviews(allReviews.slice(0, 3));
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <div className={styles.container}>
      <Modal />
      <div className={styles.titleContainer}>Your Review</div>
      {/* review by the user */}
      {user ? (
        !reviewed ? (
          <form onSubmit={handleSubmit}>
            <label className={styles.reviewLabel}>Rate This Product</label>
            <div
              className={styles.starContainer}
              style={{ display: 'inline-block' }}
            >
              <label htmlFor="star1">
                <Star color={rating >= 1 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star1"
                  type="radio"
                  name="rating"
                  checked={rating === 1}
                  value={1}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star2">
                <Star color={rating >= 2 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star2"
                  type="radio"
                  name="rating"
                  checked={rating === 2}
                  value={2}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star3">
                <Star color={rating >= 3 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star3"
                  type="radio"
                  name="rating"
                  checked={rating === 3}
                  value={3}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star4">
                <Star color={rating >= 4 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star4"
                  type="radio"
                  name="rating"
                  checked={rating === 4}
                  value={4}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star5">
                <Star color={rating >= 5 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star5"
                  type="radio"
                  name="rating"
                  checked={rating === 5}
                  value={5}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
            </div>
            <label className={styles.reviewLabel}>Review This Product</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write Something"
            />
            <Button type="submit">Submit</Button>
          </form>
        ) : isEditing ? (
          <form onSubmit={handleEdit}>
            <label className={styles.reviewLabel}>Rate This Product</label>
            <div
              className={styles.starContainer}
              style={{ display: 'inline-block' }}
            >
              <label htmlFor="star1">
                <Star color={rating >= 1 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star1"
                  type="radio"
                  name="rating"
                  checked={rating === 1}
                  value={1}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star2">
                <Star color={rating >= 2 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star2"
                  type="radio"
                  name="rating"
                  checked={rating === 2}
                  value={2}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star3">
                <Star color={rating >= 3 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star3"
                  type="radio"
                  name="rating"
                  checked={rating === 3}
                  value={3}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star4">
                <Star color={rating >= 4 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star4"
                  type="radio"
                  name="rating"
                  checked={rating === 4}
                  value={4}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
              <label htmlFor="star5">
                <Star color={rating >= 5 ? '#f0c000' : '#a39f9f'} />
                <input
                  style={{ display: 'none' }}
                  id="star5"
                  type="radio"
                  name="rating"
                  checked={rating === 5}
                  value={5}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </label>
            </div>
            <label className={styles.reviewLabel}>Review This Product</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write Something"
            />
            <Button type="submit">Edit</Button>
          </form>
        ) : (
          <>
            {/* user review start */}
            <div className={styles.main}>
              <article className={styles.singleReview}>
                <div className={styles.profileImage}></div>
                <div className={styles.userName}>{reviewItem.userName}</div>
                <div className={styles.rating}>
                  <Rating rating={reviewItem.rating} />
                </div>
                <div className={styles.text}>{reviewItem.text}</div>
                {user && user._id === reviewItem.userId && (
                  <div>
                    <div
                      onClick={() => setShowMenu(true)}
                      className={styles.button}
                    >
                      <p>...</p>
                    </div>
                    {showMenu && (
                      <div className={styles.menuContainer}>
                        <div
                          onClick={() => setShowMenu(false)}
                          className={styles.bgDark}
                        ></div>
                        <div className={styles.menu}>
                          <div
                            onClick={() => {
                              setShowMenu(false);
                              handleDelete();
                            }}
                            className={styles.menuItem}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            </div>
            {/* user review end */}
            <div className={styles.editBtnContainer}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editBtn}
              >
                Edit Review
              </button>
            </div>
          </>
        )
      ) : (
        <div className={styles.loginToReview}>
          <NextLink href="/login">Login</NextLink> To Review
        </div>
      )}
      {/* start */}
      <div className={styles.titleContainer}>All Reviews</div>
      {allReviews.length > 3 && (
        <div className={styles.editBtnContainer}>
          <button onClick={showAllReviewsHandler} className={styles.editBtn}>
            {showAllReviews ? 'Show All' : 'Hide'}
          </button>
        </div>
      )}
      <div className={styles.main}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review._id} className={styles.review}>
              <div className={styles.profileImage}></div>
              <div className={styles.userName}>{review.userName}</div>
              <div className={styles.rating}>
                <Rating rating={review.rating} />
              </div>
              <div className={styles.text}>{review.text}</div>
            </article>
          ))
        ) : (
          <div className={styles.noReview}>No Review Yet</div>
        )}
      </div>
      {/* end */}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Reviews));
