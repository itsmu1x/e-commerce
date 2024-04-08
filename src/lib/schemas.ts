import { z } from "zod"

export const loginSchema = z.strictObject({
    email: z.string().email("Invalid email").max(128),
    password: z.string().min(4).max(32),
})

export const signupSchema = z
    .strictObject({
        email: z.string().email("Invalid email").max(128),
        password: z.string().min(4).max(32),
        confirmPassword: z.string().min(4).max(32),
        name: z.string().min(2).max(32),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "The passwords did not match",
        path: ["confirmPassword"],
    })

export const accountSettingsSchema = z
    .strictObject({
        name: z.string().min(2).max(32),
        email: z.string().email("Invalid email").max(128),
        oldPassword: z.string().min(4).max(32).or(z.literal("")),
        password: z.string().min(4).max(32).or(z.literal("")),
        confirmPassword: z.string().min(4).max(32).or(z.literal("")),
    })
    .refine(
        (data) => !data.oldPassword || data.password === data.confirmPassword,
        {
            message: "The passwords did not match",
            path: ["confirmPassword"],
        }
    )
    .refine(
        (data) => !data.oldPassword || (data.password && data.confirmPassword),
        {
            message: "You must provide both a password and confirm password",
            path: ["password", "confirmPassword"],
        }
    )

export const createCategorySchema = z.strictObject({
    name: z.string().min(2).max(32),
    image: z.instanceof(File).refine((file) => file.size > 0),
})

export const createProductSchema = z.object({
    product: z.string().min(2).max(64),
    price: z.number().int().min(100),
    colors: z.array(z.string().toUpperCase()).min(1).max(6),
    sizes: z.array(z.string().min(1).max(3)).min(1).max(6),
    images: z
        .array(z.instanceof(File).refine((file) => file.size > 0, "No files"))
        .max(6)
        .min(1),
})
