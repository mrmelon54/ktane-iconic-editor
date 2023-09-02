<script lang="ts">
  import {getRawModuleData, type jsonRawModule} from "~/stores/ktane-json-raw";
  import ModuleSearchBox from "./ModuleSearchBox.svelte";
  import {iconicData} from "~/stores/iconic-data";
  import {KeyMap} from "~/utils/key-map";

  export let close: () => void;

  let rawModuleData = getRawModuleData();
  let modulesToAdd: Set<jsonRawModule> = new Set();
  let usedModules: KeyMap<string> = new KeyMap();

  let ktaneIconicModules: KeyMap<string>;
  $: ktaneIconicModules = new KeyMap($iconicData.modules.map(x => x.key));

  let filteredModuleList: jsonRawModule[];
  $: filteredModuleList = rawModuleData.KtaneModules.filter(x => !ktaneIconicModules.has(x.ModuleID) && !usedModules.has(x.ModuleID));

  function selectedModule(e: CustomEvent<any>): void {
    usedModules.add(e.detail.ModuleID);
    usedModules = usedModules;

    modulesToAdd.add(e.detail);
    modulesToAdd = modulesToAdd;
  }

  function addModules() {
    iconicData.update(x => {
      modulesToAdd.forEach(i => {
        if (x.modules.filter(x => x.key == i.ModuleID).length == 0)
          x.modules.push({
            key: i.ModuleID,
            raw: " ".repeat(32 * 32),
            parts: [],
            dirty: true,
          });
      });
      return x;
    });
    close();
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Add Modules</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <div class="moduleList">
        {#each [...modulesToAdd] as module (module.ModuleID)}
          <div class="module-token">{module.Name}</div>
        {/each}
      </div>
      <div class="module-search">
        <ModuleSearchBox moduleList={filteredModuleList} on:select={selectedModule} />
      </div>
      <div class="submit-wrapper">
        <button class="submit-button" on:click={addModules}>Add Modules</button>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .dialog {
    height: 70vh;

    .dialog-content {
      display: flex;
      flex-direction: column;
    }
  }

  .moduleList {
    display: flex;
    margin-bottom: 8px;
    gap: 4px;
    flex-wrap: wrap;

    .module-token {
      padding: 4px;
      border: 1px solid red;
      background-color: rgba(255, 0, 0, 0.2);
      box-sizing: border-box;
      border-radius: 4px;
    }
  }

  .module-search {
    flex-grow: 1;
    overflow: hidden;
  }

  .submit-wrapper {
    padding-block: 8px;

    .submit-button {
      padding: 4px;
    }
  }
</style>
