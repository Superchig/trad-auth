<script lang="ts">
  import { setCookieSafe } from '$lib/cookie';
  import { validRoute } from '$lib/routes';
  import type { PageData } from './$types';

  export let data: PageData;

  const isSignedIn = data.sessionId !== undefined;

  const signOut = () => {
    // TODO(Chris): Refactor this into a cookie deletion method
    setCookieSafe('sessionId', '', {
      expires: new Date()
    });

    // FIXME(Chris): Find a way to avoid this reload / do the whole thing in a
    // round-trip
    location.reload();
  };
</script>

<h1>Are you signed in?</h1>

{#if isSignedIn}
  <p>Yes.</p>
{:else}
  <p>No.</p>
{/if}

<a href={validRoute('/user/new')}>Sign Up</a>

<button on:click={signOut}>Log Out</button>

<style>
</style>
