"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function createBudget(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Пользователь не авторизован");
    }
    const userId = session.user.id;

    const fd = z
      .object({
        categoryId: z.string(),
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .parse({
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
      });

      const category = await db.category.findUnique({
        where: { id: fd.categoryId, userId: userId }, // Убедимся, что категория принадлежит пользователю
      });
    
      if (!category) {
        throw new Error("Категория не найдена");
      }

    const data = {
        userId: userId,
        categoryId: category.id,
        amount: fd.amount,
        startDate: fd.startDate ? new Date(fd.startDate) : new Date(),
        endDate: fd.endDate ? new Date(fd.endDate) : new Date(),
    };

    await db.budget.create({ data });
    revalidatePath("/budgets");
}

const deleteBudgetSchema = z.object({
    id: z.string(),
});

export async function deleteBudget(data: { id: string }) {
    const fd = deleteBudgetSchema.parse(data);
    await db.budget.delete({ where: { id: fd.id } });
    redirect("/budgets");
}

export async function updateBudget(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),   
        categoryId: z.string(),
        amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .parse({
        id: formData.get("id"), 
        categoryId: formData.get("categoryId"),
        amount: formData.get("amount"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
      });

      const category = await db.category.findUnique({
        where: { id: fd.categoryId },
      });
    
      if (!category) {
        throw new Error("Категория не найдена");
      }

      const updatedData = {
        id: fd.id,
        categoryId: category.id,
        amount: fd.amount,
        ...(fd.startDate && { startDate: new Date(fd.startDate) }),
        ...(fd.endDate && { endDate: new Date(fd.endDate) }),
      };

    await db.budget.update({ where: { id: updatedData.id }, data: updatedData });
    revalidatePath("/budgets/" + updatedData.id);
}