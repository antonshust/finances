"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Пользователь не авторизован");
  }
  const userId = session.user.id;

  const fd = z
    .object({
      description: z.string().optional(),
      amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
      type: z.enum(["INCOME", "EXPENSE"]),
      categoryId: z.string(),
      date: z.string().optional(),
    })
    .parse({
      description: formData.get("description"),
      amount: formData.get("amount"),
      type: formData.get("type"),
      categoryId: formData.get("categoryId"),
      date: formData.get("date"),
    });

  // Находим категорию по ID
  const category = await db.category.findUnique({
    where: { id: fd.categoryId, userId: userId },
  });

  if (!category) {
    throw new Error("Категория не найдена");
  }

  const data = {
    userId: userId,
    amount: fd.amount,
    description: fd.description,
    type: fd.type,
    date: fd.date ? new Date(fd.date) : new Date(),
    categoryId: category.id,
  };

  await db.transaction.create({ data });

  revalidatePath("/transactions");
}

const deleteTransactionSchema = z.object({
  id: z.string(),
});

export async function deleteTransaction(data: { id: string }) {
  const fd = deleteTransactionSchema.parse(data);
  await db.transaction.delete({ where: { id: fd.id } });
  redirect("/transactions");
}

export async function updateTransaction(formData: FormData) {
  const fd = z
    .object({
      id: z.string(),
      description: z.string().optional(),
      amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
      type: z.enum(["INCOME", "EXPENSE"]),
      categoryId: z.string(),
      date: z.string().optional(),
    })
    .parse({
      id: formData.get("id"),
      description: formData.get("description"),
      amount: formData.get("amount"),
      type: formData.get("type"),
      categoryId: formData.get("categoryId"),
      date: formData.get("date"),
    });

  // Находим категорию по ID
  const category = await db.category.findUnique({
    where: { id: fd.categoryId },
  });

  if (!category) {
    throw new Error("Категория не найдена");
  }

  const updatedData = {
    id: fd.id,
    description: fd.description,
    amount: fd.amount,
    type: fd.type,
    ...(fd.date && { date: new Date(fd.date) }),
    categoryId: category.id,
  };

  await db.transaction.update({ where: { id: updatedData.id }, data: updatedData });
  revalidatePath("/transactions/" + updatedData.id);
}