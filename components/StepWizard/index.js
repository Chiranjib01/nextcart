import styles from './style.module.scss';

const StepWizard = ({ activeStep }) => {
  return (
    <>
      <div className={styles.wizardContainer}>
        <div className={`${styles.step} ${activeStep > 1 && styles.completed}`}>
          <div className={styles.checkMark}></div>
        </div>
        <div className={styles.stepLine}></div>
        <div
          className={`${styles.step} ${activeStep === 2 && styles.active} ${
            activeStep > 2 && styles.completed
          }`}
        >
          {activeStep > 2 ? <div className={styles.checkMark}></div> : 2}
        </div>
        <div className={styles.stepLine}></div>
        <div
          className={`${styles.step} ${activeStep === 3 && styles.active} ${
            activeStep > 3 && styles.completed
          }`}
        >
          {activeStep > 3 ? <div className={styles.checkMark}></div> : 3}
        </div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.step} ${activeStep === 4 && styles.active}`}>
          {activeStep > 4 ? <div className={styles.checkMark}></div> : 4}
        </div>
      </div>
      <div className={styles.labelContainer}>
        <div className={styles.label}>Login</div>
        <div className={styles.grow}></div>
        <div className={styles.label}>Shipping</div>
        <div className={styles.grow}></div>
        <div className={styles.label}>Payment</div>
        <div className={styles.grow}></div>
        <div className={styles.label}>Order</div>
      </div>
    </>
  );
};

export default StepWizard;
