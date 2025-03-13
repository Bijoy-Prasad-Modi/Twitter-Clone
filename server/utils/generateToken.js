import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    //expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents client-side JS from accessing the token, prevent XSS attacks cross-site scripting attacks
    sameSite: isProduction ? "none" : "strict", // Allow cross-domain in production
    secure: isProduction, // Enables HTTPS-only in production
  });
};
