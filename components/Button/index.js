const Button = ({ type, onClick, children }) => {
  return (
    <button
      style={{
        backgroundColor: 'aqua',
        textTransform: 'capitalize',
        fontWeight: 600,
        border: '1px solid #08bea6',
        cursor: 'pointer',
        width: '100%',
        padding: '9px 10px',
        // boxShadow: '1px 2px 2px 2px #c6c3c3',
        boxShadow: '0 0 3px 2px rgba(0,0,0,0.3)',
        borderRadius: '4px',
        margin: '10px 0',
      }}
      type={type || 'button'}
      onClick={onClick && onClick}
    >
      {children}
    </button>
  );
};

export default Button;
