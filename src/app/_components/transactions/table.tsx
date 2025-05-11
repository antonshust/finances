"use client"; 

import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Transaction, Category } from "@prisma/client"; 
import Link from "next/link";

export interface TransactionWithCategory extends Transaction {
  category: Category | null; 
}

interface TransactionTableProps {
  transactions: TransactionWithCategory[]; 
  type: "INCOME" | "EXPENSE";
  typeName: string;
  pageSize: number; 
}

function TransactionTable({
  transactions,
  type,
  typeName,
  pageSize,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.type === type
  );

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{typeName}</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">
                Описание
              </th>
              <th scope="col" className="px-4 py-2">
                Сумма
              </th>
              <th scope="col" className="px-4 py-2">
                Дата
              </th>
              <th scope="col" className="px-4 py-2">
                Категория
              </th>
              <th scope="col" className="px-4 py-2 text-center">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2">{transaction.amount.toString()}</td>
                <td className="px-4 py-2">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {transaction.category ? transaction.category.name : "Не указана"}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link
                    href={`/transactions/${transaction.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <PencilSquareIcon className="w-4 h-4 inline-block align-middle mr-1" />
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  transactions: TransactionWithCategory[]; 
}

export default function TransactionOverview({ transactions }: Props) {
  const pageSize = 3;

  return (
    <div>
      <TransactionTable
        transactions={transactions}
        type="INCOME"
        typeName="Доходы"
        pageSize={pageSize}
      />
      <TransactionTable
        transactions={transactions}
        type="EXPENSE"
        typeName="Расходы"
        pageSize={pageSize}
      />
    </div>
  );
}