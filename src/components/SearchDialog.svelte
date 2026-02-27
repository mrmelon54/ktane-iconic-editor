<script lang="ts">
  import {iconicData} from "~/stores/iconic-data";
  import ModuleSearchBox from "./ModuleSearchBox.svelte";
  import {selectedModule} from "~/stores/editor-data";
  import {getRawModuleData, type jsonRawModule} from "~/stores/ktane-json-raw";

  interface Props {
    close: () => void;
  }

  let { close }: Props = $props();

  let rawModuleData = getRawModuleData();

  let ktaneIconicModules: Set<string> = $derived(new Set($iconicData.modules.map(x => x.key)));

  let filteredModuleList: jsonRawModule[] = $derived(rawModuleData.KtaneModules.filter(x => ktaneIconicModules.has(x.ModuleID)));

  function chooseModule(e: CustomEvent<any>): void {
    let i = $iconicData.modules.findIndex(x => x.key == e.detail.ModuleID);
    if (i == -1) {
      alert("Invalid module selected");
      return;
    }
    $selectedModule = i;
    close();
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Search</h2>
      <button class="cancel-button" onclick={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Search for a module and press enter to jump to the module.</p>
      <div>
        <ModuleSearchBox moduleList={filteredModuleList} on:select={chooseModule} />
      </div>
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
