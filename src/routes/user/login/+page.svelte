<script lang="ts">
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
  import { lastError } from '$lib/stores';
  import { trpc } from '$lib/trpc/client';
  import type { LogInRequest } from '$lib/trpc/router';

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
        throw new Error("Invalid email or password");
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

<h1>Log In</h1>

<!-- TODO(Chris): Refactor out a common Form component -->
<form method="POST" on:submit|preventDefault={onSubmit} autocomplete="off" bind:this={elemForm}>
  <label for="email">Email:</label>
  <input id="email" type="email" bind:value={logInRequest.email} />

  <label for="password">Password:</label>
  <input id="password" type="password" bind:value={logInRequest.password} />

  <button bind:this={elemSubmitButton}>Log In</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
