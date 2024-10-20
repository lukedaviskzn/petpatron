<script>
    import { onMount } from 'svelte';

    export let data;

    onMount(() => {
        if (data.success) {
            window.location.href = `/?dog=${data.data.dog}&thanks=1#dogviewer`;
        }
    });
</script>

{#if data.success}
    Payment successful...
{:else}
    Failure
{/if}