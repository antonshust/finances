"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";

export async function createUser(formData: FormData) {
    const fd = z
      .object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .parse({
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      });
    await db.user.create({ data: fd });
    revalidatePath("/profile");
  }

  export async function deleteUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),
      })
      .parse({
        id: formData.get("id"),
      });
    await db.user.delete({ where: { id: fd.id } });
    redirect("/profile");
  }

  export async function updateUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),      
        firstName: z.string(),
        lastName: z.string(),
      })
      .parse({
        id: formData.get("id"),      
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      });
    await db.user.update({ where: { id: fd.id }, data: fd });
    revalidatePath("/profile/"+fd.id);
  }