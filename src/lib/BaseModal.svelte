<script lang="ts">
  import '$lib/app.css';
  import { useFocusOn } from 'svelte-focus-on';

  export let isOpen: boolean;

  const focusOn = useFocusOn();
</script>

{#if isOpen}
  <div
    role="dialog"
    class="modal fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-max m-4 p-3 rounded-md shadow-2xl bg-white z-40"
    use:focusOn
  >
    <div class="contents">
      <slot />
    </div>
  </div>
{/if}

<style>
</style>
