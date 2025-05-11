import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { updateUser } from "~/app/api/action/profile";
import { redirect } from "next/navigation";

export default async function Page(
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id } });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Пользователь не найден
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            К сожалению, запрашиваемый пользователь не существует.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Редактировать профиль
        </h2>

        <form
          action={async (formData) => {
            "use server";
            await updateUser(formData);
            redirect("/profile");
          }}
        >
          <div className="space-y-4">
            <div>
              <input type="hidden" name="id" defaultValue={user.id ?? ""} />
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={user.email ?? ""}
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Имя
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={user.firstName ?? ""}
                placeholder="Имя"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={user.lastName ?? ""}
                placeholder="Фамилия"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Обновить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}




