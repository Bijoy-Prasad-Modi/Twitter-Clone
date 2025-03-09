import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents client-side JS from accessing the token, prevent XSS attacks cross-site scripting attacks
    sameSite: "None", // Protects against CSRF (cross-site request forgery) attacks
    secure: process.env.NODE_ENV !== "development", // Enables HTTPS-only in production
  });
};
