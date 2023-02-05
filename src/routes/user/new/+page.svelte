<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  let greeting = 'press the button to load data';
  let loading = false;

  const loadData = async () => {
    loading = true;
    greeting = await trpc($page).greeting.query();
    loading = false;
  };
</script>

<h1>Sign Up</h1>

<form method="POST">
  <label for="username">Username:</label>
  <input id="username" name="username" type="text" />

  <label for="email">Email:</label>
  <input id="email" name="email" type="email" />

  <label for="password">Password:</label>
  <input id="password" name="password" type="password" />

  <button>Sign Up</button>
</form>

<a
  href="#load"
  role="button"
  class="secondary"
  aria-busy={loading}
  on:click|preventDefault={loadData}
>
  Load
</a>

<p>{greeting}</p>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
