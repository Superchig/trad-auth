<script lang="ts">
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
  import { lastError } from '$lib/stores';
  import { trpc } from '$lib/trpc/client';
  import type { LogInUserRequest } from '$lib/trpc/routers/user';
  import Button, { ButtonColor } from '$lib/Button.svelte';

  let logInRequest: LogInUserRequest = {
    email: '',
    password: ''
  };

  let elemForm: HTMLFormElement;
  let elemSubmitButton: HTMLButtonElement;

  const onSubmit = async () => {
    try {
      elemSubmitButton.disabled = true;

      const sessionId = await trpc($page).user.logIn.query(logInRequest);

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

<!-- FIXME(Chris): Refactor this out into a general center element, using `max-w-xl` -->
<div class="m-4 mx-auto max-w-xl">
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
      class="p-1 shadow-md rounded bg-blue-300 focus:bg-blue-200 mb-3"
      bind:value={logInRequest.password}
    />

    <Button color={ButtonColor.Blue} class="py-1" bind:thisValue={elemSubmitButton}>Log In</Button>
  </form>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
</style>
