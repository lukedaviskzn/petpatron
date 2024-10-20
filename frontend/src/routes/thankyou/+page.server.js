/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    const nonce = url.searchParams.get('nonce');
    const interact_ref = url.searchParams.get('interact_ref');
    return {
        resp: await fetch(`http://127.0.0.1:3000/completePayment?nonce=${nonce}&interact_ref=${interact_ref}`),
    };
}
