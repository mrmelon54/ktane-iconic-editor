<script lang="ts">
  import {iconicData, type iconicDataModule} from "~/stores/iconic-data";
  import {dndzone} from "svelte-dnd-action";
  import {onMount} from "svelte";

  export let close: () => void;

  type moduleWithId = iconicDataModule & {id: number};

  let items: Array<moduleWithId> = [];

  function handleConsider(e) {
    items = e.detail.items;
  }

  function handleFinalize(e) {
    items = e.detail.items;
    $iconicData.modules = items.map(x => {
      return x as iconicDataModule;
    });
  }

  onMount(() => {
    items = $iconicData.modules.map((x, i) => {
      let y = x as moduleWithId;
      y.id = i;
      return y;
    });
  });
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Reorder Modules</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Drag modules to reorder</p>
      <div id="dnd" use:dndzone={{items: items}} on:consider={handleConsider} on:finalize={handleFinalize}>
        {#each items as item (item.id)}
          <div class="module-key">{item.key}</div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .module-key {
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: aqua;
      color: black;
    }
  }

  #dnd {
    overflow-y: auto;
    max-height: calc(80vh - 100px);
  }
</style>
