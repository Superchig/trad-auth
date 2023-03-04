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

<h1>Traditional Auth</h1>

{#if $page.data.user}
  <Button color={ButtonColor.Blue} on:click={signOut}>Log Out</Button>
{:else}
  <a href={validRoute('/user/login')}>Sign In</a>
{/if}

<style>
</style>
