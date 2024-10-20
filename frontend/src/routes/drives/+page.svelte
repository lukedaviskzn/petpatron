<script>
    import NavBar from "$lib/NavBar.svelte";
    import { onDestroy, onMount } from "svelte";

    export let data;

    let open = null;
    let open_payment = false;
    let loading = false;

    /** @type {string} */
    let wallet = "";
    /** @type {number} */
    let amount = 1.0;

    /**
     * @param {SubmitEvent} e
     */
    async function submitForm(e) {
        e.preventDefault();
        const SPCA_WALLET = "http://ilp.interledger-test.dev/spca";
        console.log(wallet, amount, typeof wallet, typeof amount);

        if (!wallet || !amount || amount < 0) {
            console.log("failed");
            return;
        }

        // http://ilp.interledger-test.dev/cadesayner
        loading = true;
        let response;
        try {
            response = await (await fetch(`http://127.0.0.1:3000/payment?from=${encodeURIComponent(wallet)}&to=${encodeURIComponent(SPCA_WALLET)}&amount=${encodeURIComponent(amount*100)}&drive=${open.id}`)).json();
        } catch {}
        loading = false;

        if (response) {
            window.location.href = response;
        }
    }
</script>

<NavBar/>

<div class="max-w-7xl mx-auto my-4">
    {#each data.drives as drive (drive.id)}
        
    {/each}
</div>

{#if open}
    <div class="max-w-6xl mx-auto p-2 my-16">
        <div class="flex gap-4">
            <div class="bg-cover bg-center aspect-square w-96 rounded-lg" style="background-image: url('/dogs/{open.image}')"></div>
            <div>
                {#if typeof open.birth_date === "string"}
                    <p class="float-right text-xl text-slate-200">{(((new Date()).getTime() - (new Date(open.birth_date)).getTime()) / 1000 / 3600 / 24 / 365.25).toFixed(0)} years old</p>
                {/if}
                <h3 class="text-2xl mb-2">{open.name}</h3>
                <p class="text-slate-200 mb-1">{open.breed}</p>
                <p class="mb-2">{ open.bio } </p>
                <div class="flex gap-2 items-center">
                    <progress class="flex-1 my-0 rounded" value="{open.account}" max="100">{open.account}%</progress>
                    ${open.account} / $100
                    <button class="bg-slate-600 rounded-sm px-2 py-1 border" on:click={() => open_payment = true}>Donate to Support { open.name }</button>
                </div>
            </div>
        </div>
        
        {#if open_payment}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center" on:click={() => open_payment = false}>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="bg-slate-800 w-full max-w-md mx-2 rounded-lg px-3 py-2" on:click={e => e.stopPropagation()}>
                    <div class="flex">
                        <h2 class="text-slate-400 text-lg flex-1">
                            Donate to {open.name}!
                        </h2>
                        {#if loading}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                        {/if}
                    </div>
                    <hr class="my-1 border-slate-600">
                    <form on:submit={submitForm}>
                        <div>
                            <label class="mb-2" for="wallet">Wallet ID</label><br>
                            <input class="mb-2 bg-slate-900 border border-slate-600 rounded p-2 w-full" type="text" name="wallet" id="wallet" bind:value={wallet} disabled={loading}><br>
                        </div>
                        <div class="flex items-center gap-2 mb-2">
                            <input class="flex-1" type="range" name="amount" id="amount" bind:value={amount} min="1" max="100" disabled={loading}><br>
                            <label for="amount">${amount}</label>
                        </div>
                        <div class="text-right">
                            <input class="bg-slate-600 rounded-sm px-2 py-1 border" type="submit" value="Donate" disabled={loading}>
                        </div>
                    </form>
                </div>
            </div>
        {/if}
    </div>
{/if}
