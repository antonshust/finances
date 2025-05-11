import { db } from "~/server/db";
import { updateCategory, deleteCategory } from "~/app/api/action/category";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = await db.category.findUnique({ where: { id: params.id } });

  if (!category) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Категория не найдена
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            К сожалению, запрашиваемая категория не существует.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Редактировать категорию
        </h2>

        <form
          action={async (formData) => {
            "use server";
            await updateCategory(formData);
            redirect("/categories");
          }}
        >
          <div className="space-y-4">
            <input type="hidden" name="id" defaultValue={category.id ?? ""} />
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Название
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={category.name ?? ""}
                placeholder="продукты"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Описание
              </label>
              <input
                type="text"
                id="description"
                name="description"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={category.description ?? ""}
                placeholder="на месяц"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Тип
              </label>
              <select
                name="type"
                id="type"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={category.type ?? "INCOME"} // Устанавливаем значение по умолчанию на "INCOME" или значение из транзакции
              >
                <option value="INCOME">Доход</option>
                <option value="EXPENSE">Расход</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Обновить
              </button>
              <button
                type="button"
                onClick={async () => {
                  "use server";
                  await deleteCategory({ id: category.id });
                  redirect("/categories");
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Удалить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}