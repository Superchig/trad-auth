<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Are you signed in?</h1>

<p>No.</p>

<h1>Number of users in existence.</h1>

<p>{data.count}</p>

<a href="/user/new">Sign Up</a>

<style>
</style>
