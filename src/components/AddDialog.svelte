<script lang="ts">
  import {getRawModuleData, type jsonRawModule} from "~/stores/ktane-json-raw";
  import ModuleSearchBox from "./ModuleSearchBox.svelte";
  import {iconicData, sortIconicModules} from "~/stores/iconic-data";
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
    addSingleModule(e.detail);
  }

  function addSingleModule(e: jsonRawModule) {
    usedModules.add(e.ModuleID);
    usedModules = usedModules;

    modulesToAdd.add(e);
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
      sortIconicModules(x);
      return x;
    });
    close();
  }

  function selectAll() {
    filteredModuleList.forEach(x => {
      addSingleModule(x);
    });
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Add Modules</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <div class="module-list-wrapper">
        <div class="module-list">
          {#each [...modulesToAdd] as module (module.ModuleID)}
            <div class="module-token">{module.Name}</div>
          {/each}
        </div>
      </div>
      <div class="module-search">
        <ModuleSearchBox moduleList={filteredModuleList} on:select={selectedModule} />
      </div>
      <div class="submit-wrapper">
        <button class="submit-button" on:click={addModules}>Add Modules</button>
        <button class="submit-button" on:click={selectAll}>Select All Remaining Modules</button>
      </div>
    </div>
    <div id="dragDropOverlay">
      <div>Drop file to upload</div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .dialog {
    #dragDropOverlay {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        font-size: 30px;
      }
    }

    &:not(.highlight) #dragDropOverlay {
      display: none;
    }
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
  }

  .module-list-wrapper {
    max-height: 200px;

    .module-list {
      display: flex;
      margin-bottom: 8px;
      gap: 4px;
      flex-wrap: wrap;
      overflow-y: auto;
      max-height: 200px;

      .module-token {
        padding: 4px;
        border: 1px solid red;
        background-color: rgba(255, 0, 0, 0.2);
        box-sizing: border-box;
        border-radius: 4px;
      }
    }
  }

  .module-search {
    display: flex;
    flex-direction: column;
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
