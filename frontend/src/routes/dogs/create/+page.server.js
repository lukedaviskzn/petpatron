import { turso } from "$lib/turso.server";

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let name = data.get('name')?.toString();
        let type = data.get('type')?.toString();
        let image = data.get('image')?.toString();
        let bio = "";
        let breed = data.get('breed')?.toString();
        let date_of_birth = data.get('date_birth')?.toString() || null;
        let date_of_death = data.get('date_death')?.toString() || null;
        let hobby = data.get('hobby')?.toString() ?? "";

        if (!name || !image || !breed) return "null check failure";

        await fetch(`http://localhost:3000/generateBio?name=${name}&breed=${breed}&type=${type}&hobby=${hobby}`).then(response => {
            return response.text();
        }).then(dogdata => {bio = dogdata.toString()});

        if (data) {
            await turso.execute({
                sql: 'INSERT INTO dogs (name, image, breed, bio, birth_date, death_date, account) VALUES (?, ?, ?, ?, ?, ?);' ,
                args: [name, image, breed, bio, date_of_birth, date_of_death],
            })
        }
    },
};
