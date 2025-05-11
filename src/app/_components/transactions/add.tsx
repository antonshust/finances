"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { createTransaction } from "~/app/api/action/transaction";

export function AddTransaction() {
    const [categories, setCategories] = useState<any[]>([]);
    const [amount, setAmount] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [date, setDate] = useState<string>("");
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
                console.log("Категории получены:", data);
                setCategories(data);
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("description", description);
        formData.append("amount", amount);
        formData.append("type", (event.target as HTMLFormElement).type.value);
        formData.append("categoryId", categoryId);
        formData.append("date", date);
        
        try {
            await createTransaction(formData);
            console.log("Транзакция успешно добавлена");
            resetForm();
        } catch (error) {
            console.error("Ошибка при добавлении транзакции:", error);
        }
    };

    const resetForm = () => {
        setAmount("");
        setCategoryId("");
        setDescription("");
        setDate("");
    };

    return (
        <div className="mb-8">
            <details className={`collapse bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700 ${isOpen ? 'open' : ''}`}>
                <summary
                    className="collapse-title text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center px-6 py-4 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
                    Добавить транзакцию
                </summary>
                {isOpen && (
                    <form
                        className="collapse-content form-control p-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Описание</label>
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Сумма</label>
                                <input
                                    type="text"
                                    name="amount"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Тип</label>
                                <select
                                    name="type"
                                    id="type"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
                                >
                                    <option value="INCOME">Доход</option>
                                    <option value="EXPENSE">Расход</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="categoryId" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Категория</label>
                                <select
                                    name="categoryId"
                                    id="categoryId"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
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
                                <label htmlFor="date" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Дата</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Добавить
                            </button>
                        </div>
                    </form>
                )}
            </details>
        </div>
    );
}