import { auth } from "~/server/auth";
import { db } from "~/server/db";
import IncomeByMonth from "../_components/reports/IncomeByMonth";
import ExpenseByMonth from "../_components/reports/ExpenseByMonth";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Отчеты</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Вы не авторизованы.</p>
      </div>
    );
  }

  const userId = session.user.id;

  const transactions = await db.transaction.findMany({
    where: {
      userId: userId,
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Отчеты
      </h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-shadow hover:shadow-xl">
          <IncomeByMonth transactions={transactions} />
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-shadow hover:shadow-xl">
          <ExpenseByMonth transactions={transactions} />
        </div>
      </div>
    </div>
  );
}