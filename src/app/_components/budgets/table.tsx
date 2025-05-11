"use client"; 

import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Budget, Category } from "@prisma/client"; 
import Link from "next/link";

interface BudgetWithCategory extends Budget {
  category: Category | null;
}

interface BudgetTableProps {
  budgets: BudgetWithCategory[];
  pageSize: number; 
}

export default function BudgetTable({ budgets }: { budgets: BudgetWithCategory[] }) {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      {isClient ? (
        <table className="w-full text-base text-left text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Категория</th>
              <th scope="col" className="px-6 py-3">Лимит</th>
              <th scope="col" className="px-6 py-3">Дата начала</th>
              <th scope="col" className="px-6 py-3">Дата окончания</th>
              <th scope="col" className="px-6 py-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr
                key={b.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {b.category ? b.category.name : "Без категории"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {b.amount}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {b.startDate ? new Date(b.startDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {b.endDate ? new Date(b.endDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/budgets/${b.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <PencilSquareIcon className="w-4 h-4 inline-block align-middle mr-1" />{" "}
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}