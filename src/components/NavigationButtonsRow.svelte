<script lang="ts">
  import { css } from "goober";
  import { createEventDispatcher } from "svelte";

  import Button from "~/components/Button.svelte";

  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let nextLabel: string = "Next";
  export let refreshLabel: string | undefined = undefined;

  const dispatchEvent = createEventDispatcher();

  function handleBackClick(): void {
    dispatchEvent("back");
  }

  function handleNextClick(): void {
    dispatchEvent("next");
  }

  function handleRefreshClick(): void {
    dispatchEvent("refresh");
  }

  const styleClass = css`
    button {
      min-height: 3rem;
      min-width: 6.5rem;
    }
  `;
</script>

<style>
  ul {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>

<nav class={styleClass} {...$$restProps}>
  <ul>
    <li>
      <Button variant="default" {disabled} on:click={handleBackClick}>
        Back
      </Button>
    </li>

    <li>
      <Button variant="primary" {disabled} {loading} on:click={handleNextClick}>
        {nextLabel}
      </Button>
    </li>

    {#if refreshLabel !== undefined}
      <li>
        <Button variant="eggplant" {disabled} on:click={handleRefreshClick}>
          {refreshLabel}
        </Button>
      </li>
    {/if}
  </ul>
</nav>
