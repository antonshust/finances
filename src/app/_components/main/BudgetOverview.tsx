"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TransactionWithCategory } from "../transactions/table";

interface BudgetSummaryProps {
  transactions: TransactionWithCategory[];
}

export default function BudgetSummary({ transactions }: BudgetSummaryProps) {
  const router = useRouter();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const incomeThisMonth = transactions.filter((transaction) => {
    if (transaction.type !== "INCOME") return false;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    );
  });

  const expenseThisMonth = transactions.filter((transaction) => {
    if (transaction.type !== "EXPENSE") return false;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    );
  });

  const totalIncome = incomeThisMonth.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const totalExpense = expenseThisMonth.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  return (
    <div className="max-w-2xl mx-auto p-4 bg-purple-100 dark:bg-purple-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-900 mb-4 text-center">
        Текущий месяц
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-purple-50 dark:bg-purple-300 rounded-lg shadow-inner flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-900 mb-2">
            Доходы
          </h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-800">
            {totalIncome.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-300 rounded-lg shadow-inner flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-900 mb-2">
            Расходы
          </h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-800">
            {totalExpense.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
          </p>
        </div>
      </div>
      <div className="text-center">
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={() => router.push("/reports")}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
}