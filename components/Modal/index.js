import { useEffect } from 'react';
import styles from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/actions';

const Modal = () => {
  const dispatch = useDispatch();
  const { show, type, msg, time } = useSelector((state) => state.alertReducer);
  let classes = '';
  switch (type) {
    case 'success':
      classes = styles.success;
      break;
    case 'error':
      classes = styles.error;
      break;
    default:
      classes = '';
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(actions.removeAlert());
    }, time || 3000);
    return () => clearTimeout(timer);
  }, [msg, show]);
  if (!msg || !show) {
    return <div></div>;
  }
  return (
    <div aria-hidden="hidden" className={styles.modal}>
      <div className={classes}>
        <p onClick={() => dispatch(actions.removeAlert())}>X</p>&nbsp;{msg}
      </div>
    </div>
  );
};

export default Modal;
