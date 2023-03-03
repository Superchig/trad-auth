<script lang="ts">
  import { lastError } from '$lib/stores';
  // TODO(Chris): Fork json-tree to suppress A11y warnings
  import JSONTree from 'svelte-json-tree';

  import '$lib/app.css';
</script>

{#if $lastError}
  <div style="--json-tree-font-family: monospace;">
    <JSONTree value={$lastError} />
  </div>
{/if}

<slot />
