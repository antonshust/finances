"use client";

import React from "react";

import { TransactionWithCategory } from "../transactions/table";

interface TotalBalanceProps {
  transactions: TransactionWithCategory[];
}

export default function TotalBalance({ transactions }: TotalBalanceProps) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalAvailable = totalIncome - totalExpense;

  return (
    <div className="max-w-xl mx-auto p-6 bg-purple-100 dark:bg-purple-200 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-900 mb-4">
        Текущий баланс
      </h2>
      <p className="text-3xl font-bold text-purple-900 dark:text-purple-800 mb-4">
        {totalAvailable.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
      </p>
    </div>
  );
}