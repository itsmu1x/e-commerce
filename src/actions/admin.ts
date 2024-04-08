"use server"

import { getUser } from "@/lib/auth"
import imagekit from "@/lib/imagekit"
import prisma from "@/lib/prisma"
import { createCategorySchema, createProductSchema } from "@/lib/schemas"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { z } from "zod"

export async function createCategory(formData: FormData) {
    const user = await getUser()
    if (!user || !user.isAdmin) return "Unauthorized"

    const result = createCategorySchema.safeParse({
        name: formData.get("name"),
        image: formData.get("image"),
    })
    if (!result.success) return result.error.issues[0].message

    const { name, image } = result.data
    const exists = await prisma.category.findFirst({
        where: {
            name,
        },
    })

    if (exists) return "This category already exists"
    const imageData = await imagekit.upload({
        file: Buffer.from(await image.arrayBuffer()),
        folder: "categories",
        fileName: name,
        transformation: {
            pre: "w-512,h-512",
        },
    })

    await prisma.category.create({
        data: {
            name,
            image: imageData.url,
        },
    })

    revalidatePath("/admin/categories")
    return null
}

export async function createProduct(formData: FormData) {
    const user = await getUser()
    if (!user || !user.isAdmin) return "Unauthorized"

    const result = createProductSchema.safeParse({
        product: formData.get("product"),
        price: parseInt(formData.get("price")?.toString() || "0"),
        colors: (formData.get("colors") as string).split(", "),
        sizes: (formData.get("sizes") as string).split(", "),
        images: formData.getAll("images"),
    })
    if (!result.success) return result.error.issues[0].message

    const {
        product: name,
        price: cents,
        colors: hexes,
        sizes,
        images,
    } = result.data
    const slug = slugify(name, { lower: true })
    const exists = await prisma.product.findFirst({
        where: {
            OR: [
                {
                    name,
                },
                { slug },
            ],
        },
    })

    if (exists) return "This product already exists"

    const urls = []
    const category = await prisma.category.findFirst({
        where: {
            id: parseInt(formData.get("category")?.toString() ?? "0"),
        },
    })
    if (!category) return "Cannot find category"

    for (const image of images) {
        try {
            const response = await imagekit.upload({
                file: Buffer.from(await image.arrayBuffer()),
                fileName: image.name,
                folder: "products",
                transformation: {
                    pre: "w-300,h-300",
                },
            })

            if (response.url) {
                urls.push(response.url)
            }
        } catch (error) {
            return "Error while uploading image"
        }
    }

    await prisma.product.create({
        data: {
            name,
            slug,
            cents,
            hexes,
            sizes,
            images: urls,
            categoryId: category.id,
        },
    })
    revalidatePath("/admin/products")
    return null
}

export async function deleteProducts(ids: string[]) {
    const user = await getUser()
    if (!user || !user.isAdmin) return "Unauthorized"

    const result = z.array(z.string().max(32)).safeParse(ids)
    if (!result.success) return result.error.issues[0].message
    if (!ids.length) return "No products selected"

    await prisma.product.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })
    revalidatePath("/admin/products")
    return null
}

export async function deleteCategories(ids: number[]) {
    const user = await getUser()
    if (!user || !user.isAdmin) return "Unauthorized"

    const result = z.array(z.number().int()).safeParse(ids)
    if (!result.success) return result.error.issues[0].message
    if (!ids.length) return "No categories selected"

    await prisma.category.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    })
    revalidatePath("/admin/categories")
    return null
}
