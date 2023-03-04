<script lang="ts">
  import '$lib/app.css';

  export let value: string | null | undefined = '';
  export let name: string | undefined = undefined;
  export let disabled: boolean | null | undefined = undefined;
  export let placeholder: string | null | undefined = undefined;
  export let autocomplete: 'off' | 'on' = 'on';

  let className = '';

  // https://navillus.dev/blog/svelte-class-props
  export { className as class };
</script>

<input
  type="text"
  class={'bg-blue-200 disabled:bg-gray-200 rounded-lg shadow-md hover:bg-blue-100 ' + className}
  {name}
  {disabled}
  {placeholder}
  {autocomplete}
  bind:value
  on:keydown
/>

<style>
</style>
