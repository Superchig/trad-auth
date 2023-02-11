<script lang="typescript">
  import { lastError } from '$lib/stores';
  import JSONTree from 'svelte-json-tree';
</script>

{#if $lastError}
  <div style="--json-tree-font-family: monospace;">
    <JSONTree value={$lastError} />
  </div>
{/if}

<slot />
