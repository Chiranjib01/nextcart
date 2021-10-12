import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '10d' }
  );
};
export const signVerificationToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "token isn't valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "token isn't supplied" });
  }
};
export const isAdmin = (req, res, next) => {
  const { admin } = req.headers;
  if (admin) {
    if (admin === process.env.ADMIN_EMAIL) {
      req.admin = admin;
      next();
    } else {
      res.status(403).send({ message: 'access denied' });
    }
  } else {
    res.status(403).send({ message: "token isn't supplied" });
  }
};
