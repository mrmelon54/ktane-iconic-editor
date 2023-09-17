<script lang="ts">
  export let close: () => void;

  export let invalidIcons: {name: string; found: boolean; caseIssue: boolean}[];

  $: console.log(invalidIcons);
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Invalid Icon Error</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Invalid module icons are listed below:</p>
      <ul class="error-list">
        {#each invalidIcons as i (i)}
          <li>
            <span>{i.name}</span>
            {#if i.caseIssue}<span> - case issue detected</span>{/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .dialog-content {
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .error-list {
    overflow-y: auto;
  }
</style>
