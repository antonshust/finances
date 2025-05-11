"use client";

import React from "react";
import { TransactionWithCategory } from "../transactions/table";

interface BudgetSummaryProps {
  transactions: TransactionWithCategory[];
}

export default function BudgetSummary({ transactions }: BudgetSummaryProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const incomeThisMonth = transactions.filter((transaction) => {
    if (transaction.type !== "INCOME") return false;
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

  return (
    <div className="mb-4 p-4 bg-green-100 dark:bg-green-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800 dark:text-green-900 mb-2">
        Общий доход за текущий месяц
      </h2>
      <p className="text-2xl font-bold text-green-900 dark:text-green-800">
        {totalIncome.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
      </p>
    </div>
  );
}