import { postSchema } from "../models/Post.js";

export function validatePost(req, res, next) {
  const body = req.body

  const { error } = postSchema.validate(body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send({ errors });
  }

  next()
}