<script lang="ts">
  import {selectedModule} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";
  import {getRawModuleData, type jsonRawModule} from "~/stores/ktane-json-raw";
  import ModuleSearchBox from "./ModuleSearchBox.svelte";

  export let close: () => void;

  let rawModuleData = getRawModuleData();

  let ktaneIconicModules: Set<string>;
  $: ktaneIconicModules = new Set($iconicData.modules.map(x => x.key));

  let filteredModuleList: jsonRawModule[];
  $: filteredModuleList = rawModuleData.KtaneModules.filter(x => ktaneIconicModules.has(x.ModuleID));

  function chooseModule(e: CustomEvent<any>): void {
    let i = $iconicData.modules.findIndex(x => x.key == e.detail.ModuleID);
    if (i == -1) {
      alert("Invalid module selected");
      return;
    }
    iconicData.update(x => {
      x.modules[i].parts = x.modules[$selectedModule].parts;
      x.modules[i].raw = x.modules[$selectedModule].raw;
      return x;
    });
    $selectedModule = i;
    close();
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Copy Module Parts and Text</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Search for a module and press enter to copy the parts and text to it</p>
      <div>
        <ModuleSearchBox moduleList={filteredModuleList} on:select={chooseModule} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";
</style>
