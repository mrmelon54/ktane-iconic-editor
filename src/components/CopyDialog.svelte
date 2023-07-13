<script lang="ts">
  import {onMount} from "svelte";
  import {selectedModule} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";

  export let type: string = "";
  export let close: () => void;

  function dblClickModule(i: number) {
    if (type === "parts") {
      iconicData.update(x => {
        x.modules[i].parts = x.modules[$selectedModule].parts;
        return x;
      });
    } else {
      iconicData.update(x => {
        x.modules[i].raw = x.modules[$selectedModule].raw;
        return x;
      });
    }
    $selectedModule = i;
    close();
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Copy Module {type === "parts" ? "Parts" : "Text"}</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Double click on a module below to copy the {type} to it</p>
      {#each $iconicData.modules as module, i}
        <div class="module-key" on:dblclick={() => dblClickModule(i)}>{module.key}</div>
      {/each}
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
</style>
