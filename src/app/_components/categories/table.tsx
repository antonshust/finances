"use client";

import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Category } from "@prisma/client";
import Link from "next/link";

interface CatTableProps {
  categories: Category[];
}

export default function CatTable({ categories }: CatTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentIncomePage, setCurrentIncomePage] = useState(1);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  
  const pageSize = 3; 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const incomeCategories = categories.filter((category) => category.type === "INCOME");
  const expenseCategories = categories.filter((category) => category.type === "EXPENSE");

  const totalIncomePages = Math.ceil(incomeCategories.length / pageSize);
  const totalExpensePages = Math.ceil(expenseCategories.length / pageSize);

  const paginatedIncomeCategories = incomeCategories.slice(
    (currentIncomePage - 1) * pageSize,
    currentIncomePage * pageSize,
  );

  const paginatedExpenseCategories = expenseCategories.slice(
    (currentExpensePage - 1) * pageSize,
    currentExpensePage * pageSize,
  );

  const handleIncomePageChange = (page: number) => {
    setCurrentIncomePage(page);
  };

  const handleExpensePageChange = (page: number) => {
    setCurrentExpensePage(page);
  };

  return (
    <div>
      {isClient ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Доходы</h2>
          <div className="overflow-x-auto shadow-md rounded-lg mb-8">
            <table className="w-full text-base text-left text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Название</th>
                  <th scope="col" className="px-6 py-3">Описание</th>
                  <th scope="col" className="px-6 py-3">Тип</th>
                  <th scope="col" className="px-6 py-3 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncomeCategories.map((u) => (
                  <tr key={u.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{u.description}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Доход</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/categories/${u.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
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
            {Array.from({ length: totalIncomePages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => handleIncomePageChange(page)} className={`mx-1 px-3 py-1 rounded-md ${currentIncomePage === page ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300"}`}>
                {page}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Расходы</h2>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-base text-left text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Название</th>
                  <th scope="col" className="px-6 py-3">Описание</th>
                  <th scope="col" className="px-6 py-3">Тип</th>
                  <th scope="col" className="px-6 py-3 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenseCategories.map((u) => (
                  <tr key={u.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{u.description}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Расход</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/categories/${u.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
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
            {Array.from({ length: totalExpensePages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => handleExpensePageChange(page)} className={`mx-1 px-3 py-1 rounded-md ${currentExpensePage === page ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-300"}`}>
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}