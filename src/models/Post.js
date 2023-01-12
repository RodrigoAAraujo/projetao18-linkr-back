import joi from "joi";

export const postSchema = joi.object({
    link: joi.string().uri().required().min(1),
    commentary: joi.string().required()
});