import { getCategories } from '../category';

export async function GET(request: Request) {
    try {
        const categories = await getCategories();
        return new Response(JSON.stringify(categories), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return new Response(JSON.stringify({ message: error.message }), { status: 500 });
        } else {
            console.error("Неопознанная ошибка:", error);
            return new Response(JSON.stringify({ message: "Произошла неизвестная ошибка." }), { status: 500 });
        }
    }
}