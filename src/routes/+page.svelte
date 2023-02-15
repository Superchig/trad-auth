<script lang="ts">
  import { setCookieSafe } from '$lib/cookie';
  import { validRoute } from '$lib/routes';
  import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
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

  <!-- TODO(Chris): Remove this line break -->
  <br />

  <a href={validRoute('/user/login')}>Sign In</a>
{/if}

<style>
</style>
