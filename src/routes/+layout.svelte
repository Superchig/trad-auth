<script lang="typescript">
  import { lastError } from "$lib/stores";
  import JSONTree from 'svelte-json-tree';
</script>

{#if $lastError}
  <JSONTree value={$lastError} />
{/if}

<slot />
