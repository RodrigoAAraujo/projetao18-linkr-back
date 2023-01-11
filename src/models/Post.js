import joi from "joi";

export const PostInsertionSchema = joi.object({
    link: joi.string().uri().required(),
    commentary: joi.string().required()
});