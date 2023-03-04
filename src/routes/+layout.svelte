<script lang="ts">
  import { lastError } from '$lib/stores';
  // TODO(Chris): Fork json-tree to suppress A11y warnings
  import JSONTree from 'svelte-json-tree';

  import '$lib/app.css';

  import { getCurrentTab, NavbarTab } from '$lib/navbar_tab';
  import { accountsPath, transactionsPath } from '$lib/routes';
  import { beforeUpdate, onMount } from 'svelte';
  import { Modals } from 'svelte-modals';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  const getTabClasses = (tab: NavbarTab): string => {
    if (tab == data.currentTab) {
      return 'text-orange-600';
    } else {
      return '';
    }
  };

  beforeUpdate(() => {
    const pathname = window.location.pathname;

    if (!pathname) {
      return;
    }

    data.currentTab = getCurrentTab(pathname);
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible" />
</svelte:head>

{#if $lastError}
  <div style="--json-tree-font-family: monospace;">
    <JSONTree value={$lastError} />
  </div>
{/if}

<Modals>
  <div slot="backdrop" class="backdrop">
    <div class="bg-gray-600/50 fixed top-0 bottom-0 w-full backdrop-blur-sm z-30" />
  </div>
</Modals>

<nav class="shadow-md p-2 z-20">
  <div class="m-auto max-w-screen-lg">
    <div class="flex justify-between items-center">
      <a
        href="/"
        class="p-2 text-xl font-extrabold hover:text-white hover:bg-orange-600 hover:rounded-md hover:shadow-md"
      >
        Home
      </a>
      {#key data.currentTab}
        <div class="flex space-x-8">
          <a
            href={transactionsPath()}
            class={'text-lg hover:underline hover:text-blue-500 ' +
              getTabClasses(NavbarTab.Transactions)}
          >
            Transactions
          </a>
          <a
            href={accountsPath()}
            class={'text-lg hover:underline hover:text-blue-500 ' +
              getTabClasses(NavbarTab.Accounts)}
          >
            Accounts
          </a>
        </div>
      {/key}
    </div>
  </div>
</nav>

<div class="z-20">
  <slot />
</div>

<style>
</style>
