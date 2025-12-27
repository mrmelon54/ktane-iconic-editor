<script lang="ts">
  export let close: () => void;

  export let title: string;
  export let infoBody: string[];
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>{title}</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <ul>
        {#each infoBody as row}
          <li>{row}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .dialog-content {
    overflow-y: scroll !important;
    scrollbar-gutter: stable;
  }
</style>
