<script lang="ts">
  import { page } from '$app/stores';
  import { validRoute } from '$lib/routes';
  import Cookies from 'js-cookie';

  const signOut = () => {
    console.log('Signing out...');

    Cookies.remove('sessionId');

    location.reload();
  };
</script>

<h1>Traditional Auth</h1>

{#if $page.data.user}
  <button on:click={signOut}>Log Out</button>
{:else}
  <a href={validRoute('/user/new')}>Sign Up</a>

  <!-- TODO(Chris): Remove this line break -->
  <br />

  <a href={validRoute('/user/login')}>Sign In</a>
{/if}

<style>
</style>
