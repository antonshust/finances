import { db } from "~/server/db";
import { updateBudget, deleteBudget } from "~/app/api/action/budget";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const budget = await db.budget.findUnique({ where: { id: params.id } });
  const categories = await db.category.findMany({ where: { type: 'EXPENSE' } });

  const startDate = budget?.startDate ? budget.startDate.toISOString().split('T')[0] : "";
  const endDate = budget?.endDate ? budget.endDate.toISOString().split('T')[0] : "";

  if (!budget) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Бюджет не найден
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            К сожалению, запрашиваемый бюджет не существует.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Редактировать бюджет
        </h2>

        <form
          action={async (formData) => {
            "use server";
            await updateBudget(formData);
            redirect("/budgets");
          }}
        >
          <div className="space-y-4">
            <input type="hidden" name="id" defaultValue={budget.id ?? ""} />

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Категория
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={budget.categoryId ?? ""}
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Бюджет
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={budget.amount ?? ""}
                placeholder="Бюджет"
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Дата начала
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={startDate}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Дата окончания
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={endDate}
              />
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
                  await deleteBudget({ id: budget.id });
                  redirect("/budgets");
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