<script lang="ts">
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
  import { lastError } from '$lib/stores';
  import { trpc } from '$lib/trpc/client';
  import type { LogInRequest } from '$lib/trpc/router';
  import Button, { ButtonColor } from '$lib/Button.svelte';

  let logInRequest: LogInRequest = {
    email: '',
    password: ''
  };

  let elemForm: HTMLFormElement;
  let elemSubmitButton: HTMLButtonElement;

  const onSubmit = async () => {
    try {
      elemSubmitButton.disabled = true;

      const sessionId = await trpc($page).logIn.query(logInRequest);

      if (sessionId === null) {
        throw new Error('Invalid email or password');
      }

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

<!-- FIXME(Chris): Refactor this into a common h1 applied-class -->
<h1 class="text-3xl mb-3">Log In</h1>

<!-- TODO(Chris): Refactor out a common Form component -->
<form method="POST" on:submit|preventDefault={onSubmit} autocomplete="off" bind:this={elemForm}>
  <label for="email">Email:</label>
  <input
    id="email"
    type="email"
    class="p-1 shadow-md rounded bg-blue-300 focus:bg-blue-200"
    bind:value={logInRequest.email}
  />

  <label for="password">Password:</label>
  <input
    id="password"
    type="password"
    class="p-1 shadow-md rounded bg-blue-300 focus:bg-blue-200"
    bind:value={logInRequest.password}
  />

  <Button color={ButtonColor.Blue} class="py-1">Log In</Button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
