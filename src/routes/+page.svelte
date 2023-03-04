<script lang="ts">
  import { page } from '$app/stores';
  import { validRoute } from '$lib/routes';
  import Cookies from 'js-cookie';
  import Button, { ButtonColor } from '$lib/Button.svelte';

  const signOut = () => {
    console.log('Signing out...');

    Cookies.remove('sessionId');

    location.reload();
  };
</script>

<div class="m-4 mx-auto max-w-xl">
  <!-- FIXME(Chris): Refactor this into a common h1 applied-class -->
  <h1 class="text-3xl mb-3">Traditional Auth</h1>

  {#if $page.data.user}
    <Button color={ButtonColor.Blue} class="p-3 px-6 pt-2" on:click={signOut}>Log Out</Button>
  {:else}
    <a
      class="p-3 bg-blue-500 text-white hover:bg-blue-400 rounded-lg shadow-md"
      href={validRoute('/user/login')}>Sign In</a
    >
  {/if}
</div>

<style>
</style>
