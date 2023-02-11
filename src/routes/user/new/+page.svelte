<script lang="ts">
  import { page } from '$app/stores';
  import { lastError } from '$lib/stores';
  import { trpc } from '$lib/trpc/client';
  import type { NewUserRequest } from '$lib/trpc/router';

  let newUserRequest: NewUserRequest = {
    username: '',
    email: '',
    password: ''
  };

  const onSubmit = async () => {
    try {
      console.log(newUserRequest);

      const result = await trpc($page).newUser.query(newUserRequest);

      alert('result: ' + result);
    } catch (err: any) {
      lastError.set(err);
    }
  };
</script>

<h1>Sign Up</h1>

<form method="POST" on:submit|preventDefault={onSubmit} autocomplete="off">
  <label for="username">Username:</label>
  <input id="username" type="text" bind:value={newUserRequest.username} />

  <label for="email">Email:</label>
  <input id="email" type="email" bind:value={newUserRequest.email} />

  <label for="password">Password:</label>
  <input id="password" type="password" bind:value={newUserRequest.password} />

  <button>Sign Up</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
