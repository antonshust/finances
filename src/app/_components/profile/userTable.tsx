"use client";

import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { User } from "@prisma/client";
import Link from "next/link";

export default function UserTable({ users }: { users: User[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      {isClient ? (
        <table className="w-full text-base text-left text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Имя
              </th>
              <th scope="col" className="px-6 py-3">
                Фамилия
              </th>
              <th scope="col" className="px-6 py-3">
                Почта
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {u.firstName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {u.lastName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {u.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/profile/${u.id}`}
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