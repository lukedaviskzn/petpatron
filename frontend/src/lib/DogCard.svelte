<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";

    export let dog;

    const dispatch = createEventDispatcher();
</script>

<a class="block bg-slate-600 rounded-xl overflow-hidden w-1/2 sm:w-1/3 lg:w-1/4 hidden [&:nth-of-type(-n+2)]:block sm:[&:nth-of-type(-n+3)]:block lg:[&:nth-of-type(-n+4)]:block" transition:slide={{axis: "x"}}
href="#dogviewer" on:click={() => dispatch("selectDog")}>
    <div class="bg-cover bg-center w-full h-96" style="background-image: url('/dogs/{dog.image}')"></div>
    <div class="flex p-4">
        <div class="flex-1">
            <h3 class="text-2xl mb-2">{dog.name}</h3>
            <p class="text-slate-400">{dog.breed}</p>
        </div>
        <div class="flex-1 text-right text-slate-400">
            {#if typeof dog.birth_date === "string"}
                {(((new Date()).getTime() - (new Date(dog.birth_date)).getTime()) / 1000 / 3600 / 24 / 365.25).toFixed(0)}
            {:else}
                ????
            {/if}
            years old
        </div>
    </div>
</a>
