<script lang="typescript">
  import { lastError } from "$lib/stores";
</script>

{#if $lastError}
  {$lastError}
{/if}

<slot />
