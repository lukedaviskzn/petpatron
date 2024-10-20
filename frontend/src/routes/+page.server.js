import { turso } from "$lib/turso.server";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const { rows } = await turso.execute("SELECT * FROM dogs");
    return {
        dogs: rows
    };
}
