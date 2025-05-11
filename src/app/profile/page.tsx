import { auth } from "~/server/auth";
import { db } from "~/server/db";
import UserTable from "../_components/profile/userTable";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Профиль</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Вы не авторизованы.</p>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Профиль</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Пользователь не найден.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Профиль пользователя</h1>
      <UserTable users={[user]} />
    </div>
  );
}