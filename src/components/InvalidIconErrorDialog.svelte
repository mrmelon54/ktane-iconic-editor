<script lang="ts">
  import {iconicData} from "~/stores/iconic-data";
  import ModuleSearchBox from "./ModuleSearchBox.svelte";
  import {selectedModule} from "~/stores/editor-data";
  import {getRawModuleData, type jsonRawModule} from "~/stores/ktane-json-raw";

  export let close: () => void;

  export let invalidIcons: string[];
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Invalid Icon Error</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Invalid module icons are listed below:</p>
      <ul>
        {#each invalidIcons as i (i)}
          <li>{i}</li>
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
</style>
