import { auth } from "~/server/auth";
import { db } from "~/server/db";
import BudgetOverview from "./_components/main/BudgetOverview";
import TotalBalance from "./_components/main/TotalBalance";
import ExpenseRingChart from "./_components/main/ExpenseRingChart";

export default async function Page(props: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Краткий финансовый обзор
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Вы не авторизованы.</p>
      </div>
    );
  }

  const userId = session.user.id;

  // Получаем транзакции текущего пользователя
  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Краткий финансовый обзор
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-xl duration-300">
          <BudgetOverview transactions={transactions} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-xl duration-300">
          <TotalBalance transactions={transactions} />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-md">
          <ExpenseRingChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}