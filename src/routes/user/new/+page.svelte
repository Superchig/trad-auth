<script lang="ts">
  import { page } from '$app/stores';
  import { setCookieSafe } from '$lib/cookie';
  import Cookies from 'js-cookie';
  import { lastError } from '$lib/stores';
  import { trpc } from '$lib/trpc/client';
  import type { NewUserRequest } from '$lib/trpc/router';

  let newUserRequest: NewUserRequest = {
    username: '',
    email: '',
    password: ''
  };

  let elemForm: HTMLFormElement;
  let elemSubmitButton: HTMLButtonElement;

  const onSubmit = async () => {
    try {
      elemSubmitButton.disabled = true;

      const sessionId = await trpc($page).newUser.query(newUserRequest);

      Cookies.set('sessionId', sessionId, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        // Set cookie to expire after a month
        expires: 30
      });

      elemForm.reset();

      location.href = '/';
    } catch (err: any) {
      lastError.set(err);
    } finally {
      elemSubmitButton.disabled = false;
    }
  };
</script>

<h1>Sign Up</h1>

<form method="POST" on:submit|preventDefault={onSubmit} autocomplete="off" bind:this={elemForm}>
  <label for="username">Username:</label>
  <input id="username" type="text" bind:value={newUserRequest.username} />

  <label for="email">Email:</label>
  <input id="email" type="email" bind:value={newUserRequest.email} />

  <label for="password">Password:</label>
  <input id="password" type="password" bind:value={newUserRequest.password} />

  <button bind:this={elemSubmitButton}>Sign Up</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
