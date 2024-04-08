"use server"
import { signupSchema, loginSchema, accountSettingsSchema } from "@/lib/schemas"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { isRedirectError } from "next/dist/client/components/redirect"
import { createUserJwtToken, getUser, setTokenCookie } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function login(values: any) {
    const result = loginSchema.safeParse(values)
    if (!result.success) return "Something went wrong"

    const { email, password } = result.data
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    })

    if (!user) return "Couldn't find the user."

    const isCorrect = await bcrypt.compare(password, user.password)
    if (!isCorrect) return "Invalid email/password"

    const token = await createUserJwtToken({ id: user.id })
    setTokenCookie(token)
    redirect("/")
}

export async function signup(values: any) {
    const result = signupSchema.safeParse(values)
    if (!result.success) return "Something went wrong"

    const { email, name, password } = result.data
    const exists = await prisma.user.findFirst({
        where: {
            email,
        },
    })

    if (exists) return "This email exists in our database"

    try {
        const hashed = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashed,
            },
        })

        const token = await createUserJwtToken({ id: user.id })
        setTokenCookie(token)
        redirect("/")
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return "Something went wrong"
    }
}

export async function wishlistProduct(value: any) {
    const user = await getUser()
    if (!user) return "Unauthorized"

    const result = z.string().min(2).max(100).safeParse(value)
    if (!result.success) return "Couldn't find the product"

    const product = await prisma.product.findFirst({
        where: {
            id: result.data,
        },
    })
    if (!product) return "Couldn't find the product"

    const has = user.wishlist.includes(product.id)
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            wishlist: {
                set: has ? [...user.wishlist].filter(d => d !== product.id) : [...user.wishlist, product.id],
            }
        }
    })

    revalidatePath("/product/*")
    return !has
}

export async function accountSettings(values: any) {
    const result = accountSettingsSchema.safeParse(values)
    if (!result.success) return "Something went wrong"

    const user = await getUser({ password: true })
    if (!user) return "Unauthorized"

    let newPassword: undefined | string = undefined
    const { name, email, oldPassword, password, confirmPassword } = result.data
    if (email !== user.email) {
        const exists = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (exists) return "This email exists in our database"
    }

    if (oldPassword) {
        const isCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isCorrect) return "Invalid old password"
        if (password !== confirmPassword) return "The passwords did not match"
        newPassword = await bcrypt.hash(password, 12)
    }

    if (name === user.name && email === user.email && !newPassword)
        return "No changes made"

    await prisma.user.update({
        data: {
            name,
            email,
            password: newPassword,
        },
        where: {
            id: user.id,
        },
    })
    revalidatePath("/profile")
}
