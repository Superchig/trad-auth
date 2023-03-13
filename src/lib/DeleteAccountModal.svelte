<script lang="ts">
  import '$lib/app.css';
  import { onMount } from 'svelte';
  import { closeModal } from 'svelte-modals';
  import type { Account } from '$lib/account';
  import BaseModal from './BaseModal.svelte';
  import Button, { ButtonColor } from './Button.svelte';
  import { trpc } from '$lib/trpc/client';
  import { page } from '$app/stores';
  import { lastError } from './stores';

  export let isOpen: boolean;

  export let account: Account;

  let childCount: number | string = 'LOADING';

  const onSubmit = async () => {
    try {
      await trpc($page).account.deleteWithAllChildren.query({ accountId: account.id! });

      location.reload();
    } catch (err: any) {
      lastError.set(err);
    }
  };

  onMount(async () => {
    const response = await trpc($page).account.countChildren.query({ accountId: account.id! });

    childCount = response.count_children;
  });
</script>

<BaseModal {isOpen}>
  <h2 class="text-2xl">Delete account (with children)</h2>

  <hr class="my-3" />

  <p>This account has <b>{childCount}</b> child account(s).</p>

  <p>Do you still want to delete this account, and <b>all of its children</b>?</p>

  <hr class="my-3" />

  <form on:submit|preventDefault={onSubmit} class="actions flow-root">
    <input type="number" name="account_id" hidden value={account.id} />

    <Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>
    <Button type="submit" color={ButtonColor.Red} class="p-2 float-right">
      Delete All Children
    </Button>
  </form>
</BaseModal>

<style>
</style>
