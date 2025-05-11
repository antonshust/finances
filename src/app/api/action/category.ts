"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function createCategory(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Пользователь не авторизован");
    }
    const userId = session.user.id;

    const fd = z
      .object({
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(["INCOME", "EXPENSE"]),
      })
      .parse({
        name: formData.get("name"),
        description: formData.get("description"),
        type: formData.get("type"),
      });

    const data = {
        userId: userId,
        name: fd.name,
        description: fd.description,
        type: fd.type,
    };

    await db.category.create({ data });
    revalidatePath("/categories");
}

export async function getCategories() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Пользователь не авторизован");
    }
    const userId = session.user.id;

    const categories = await db.category.findMany({
        where: { userId: userId },
    });

    return categories; 
}

const deleteCategorySchema = z.object({
    id: z.string(),
});

export async function deleteCategory(data: { id: string }) {
    const fd = deleteCategorySchema.parse(data);
    await db.category.delete({ where: { id: fd.id } });
    redirect("/categories");
}

export async function updateCategory(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),   
        name: z.string(),   
        description: z.string().optional(),
        type: z.enum(["INCOME", "EXPENSE"]),
      })
      .parse({
        id: formData.get("id"), 
        name: formData.get("name"),     
        description: formData.get("description"),
        type: formData.get("type"),
      });
    await db.category.update({ where: { id: fd.id }, data: fd });
    revalidatePath("/categories/" + fd.id);
}