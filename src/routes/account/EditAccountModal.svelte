<script lang="ts">
  import '$lib/app.css';
  import { closeModal } from 'svelte-modals';
  import type { Account } from '$lib/account';
  import BaseModal from '$lib/BaseModal.svelte';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import TextInput from '$lib/TextInput.svelte';
  import { submitWithEnter } from '$lib/util';

  export let isOpen: boolean;
  export let account: Account;

  let form: HTMLFormElement;
  let ancestors = account.full_name!.split(':');
  let newName = ancestors.at(-1);
</script>

<BaseModal {isOpen}>
  <h2 class="text-2xl">Edit account</h2>

  <hr class="my-3" />

  <p>What do you want to <b>rename</b> this account to?</p>

  <hr class="my-3" />

  <form method="POST" action="?/update_account" class="actions flow-root" bind:this={form}>
    <div class="grid grid-cols-2 gap-y-3 mb-3">
      <input type="number" name="account_id" value={account.id} hidden />

      {#if ancestors.length > 1}
        <label for="parent_prefix" class="text-right mr-2 px-2 py-1">Parent (prefix):</label>
        <TextInput
          name="parent_prefix"
          value={ancestors.slice(0, ancestors.length - 1).join(':')}
          disabled
          class="px-2 py-1"
        />
      {/if}

      <label for="new_name" class="text-right mr-2 px-2 py-1">New name:</label>
      <TextInput
        name="new_name"
        bind:value={newName}
        on:keydown={(event) => submitWithEnter(event, form)}
        class="px-2 py-1"
      />
    </div>

    <Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>

    <Button type="submit" color={ButtonColor.Yellow} class="p-2 float-right">Rename Account</Button>
  </form>
</BaseModal>

<style>
</style>
