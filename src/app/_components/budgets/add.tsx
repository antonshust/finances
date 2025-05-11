"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { createBudget } from "~/app/api/action/budget";

export function AddBudget() {
  const [categories, setCategories] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/action/category", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Ошибка при получении категорий:", errorText);
          throw new Error(`Ошибка при получении категорий: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const expenseCategories = data.filter((cat: any) => cat.type === 'EXPENSE');
        setCategories(expenseCategories);
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("categoryId", categoryId);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    try {
      await createBudget(formData);
      resetForm();
    } catch (error) {
      console.error("Ошибка при добавлении бюджета:", error);
    }
  };

  const resetForm = () => {
    setAmount("");
    setCategoryId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="mb-8">
      <details className={`collapse bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 ${isOpen ? 'open' : ''}`}>
        <summary
          className="collapse-title text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center px-6 py-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
          Задать бюджет
        </summary>
        {isOpen && (
          <form className="collapse-content p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoryId" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">Категория</label>
                <select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
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
                <label htmlFor="amount" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">Бюджет</label>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">Дата начала</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">Дата окончания</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Добавить
              </button>
            </div>
          </form>
        )}
      </details>
    </div>
  );
}