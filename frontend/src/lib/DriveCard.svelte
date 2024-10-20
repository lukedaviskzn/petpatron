<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";

    export let drive;

    const dispatch = createEventDispatcher();
</script>

<div class="bg-slate-600 rounded-xl overflow-hidden w-1/4" transition:slide={{axis: "x"}}>
    <a class="block bg-cover bg-center w-full h-96" style="background-image: url('/dogs/{drive.image}')" href="#" on:click={() => dispatch("selectDrive")}></a>
    <div class="flex p-4">
        <div class="flex-1">
            <h3 class="text-2xl mb-2">{drive.name}</h3>
        </div>
        <div class="flex-1 text-right text-slate-400"></div>
    </div>
</div>
