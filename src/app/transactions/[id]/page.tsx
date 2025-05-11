import { db } from "~/server/db";
import { updateTransaction, deleteTransaction } from "~/app/api/action/transaction";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const transaction = await db.transaction.findUnique({ where: { id: params.id } });
  const categories = await db.category.findMany();
  const dateStr = transaction?.date.toISOString().split('T')[0];

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Транзакция не найдена
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            К сожалению, запрашиваемая транзакция не существует.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Редактировать транзакцию
        </h2>

        <form
          action={async (formData) => {
            "use server";
            await updateTransaction(formData);
            redirect("/transactions");
          }}
        >
          <div className="space-y-4">
            <input type="hidden" name="id" defaultValue={transaction.id ?? ""} />
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
                defaultValue={transaction.description ?? ""}
                placeholder="zarplata"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Сумма
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={transaction.amount ?? ""}
                placeholder="Сумма"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Дата
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                defaultValue={dateStr}
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
                defaultValue={transaction.type ?? "INCOME"} 
              >
                <option value="INCOME">Доход</option>
                <option value="EXPENSE">Расход</option>
              </select>
            </div>

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
                defaultValue={transaction.categoryId ?? ""} 
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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
                  await deleteTransaction({ id: transaction.id });
                  redirect("/transactions");
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