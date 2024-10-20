<script>
    export let data;
</script>

{#if data}
    <p>{data}</p>
{:else}
    No response
{/if}