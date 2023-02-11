<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const isSignedIn = data.sessionId !== undefined;
</script>

<h1>Are you signed in?</h1>

{#if isSignedIn}
  <p>Yes.</p>
{:else}
  <p>No.</p>
{/if}

<a href="/user/new">Sign Up</a>

<style>
</style>
