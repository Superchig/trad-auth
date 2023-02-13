<script lang="ts">
  import { setCookieSafe } from '$lib/cookie';
  import { validRoute } from '$lib/routes';
  import Cookies from 'js-cookie';
  import type { PageData } from './$types';

  export let data: PageData;

  const signOut = () => {
    console.log('Signing out...');

    // TODO(Chris): Refactor this into a cookie deletion method
    Cookies.remove('sessionId');

    location.reload();
  };
</script>

<h1>Traditional Auth</h1>

{#if data.isSignedIn}
  <button on:click={signOut}>Log Out</button>
{:else}
  <a href={validRoute('/user/new')}>Sign Up</a>
{/if}

<style>
</style>
