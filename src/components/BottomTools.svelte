<script lang="ts">
  import loadIcon from "~/assets/load.png";
  import leftIcon from "~/assets/left.png";
  import rightIcon from "~/assets/right.png";
  import searchIcon from "~/assets/search.png";
  import addIcon from "~/assets/add.png";
  import addmultipleIcon from "~/assets/addmultiple.png";
  import renameIcon from "~/assets/rename.png";
  import reorderIcon from "~/assets/reorder.png";
  import copypartsIcon from "~/assets/copyparts.png";
  import copytextIcon from "~/assets/copytext.png";
  import fileIcon from "~/assets/file.png";
  import saveIcon from "~/assets/save.png";
  import backIcon from "~/assets/back.png";
  import FileSaver from "file-saver";
  import {get} from "svelte/store";
  import {iconicData} from "~/stores/iconic-data";
  import {selectedModule} from "~/stores/editor-data";

  function saveAction() {
    // JavaScript is still difficult in 2023
    var blob = new Blob([JSON.stringify(get(iconicData), null, 4)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "iconicData.json");
  }

  function leftAction() {
    let x = get(selectedModule) - 1;
    if (x < 0) selectedModule.set(get(iconicData).modules.length - 1);
    else selectedModule.set(x);
  }

  function rightAction() {
    let x = get(selectedModule) + 1;
    if (x >= get(iconicData).modules.length) selectedModule.set(0);
    else selectedModule.set(x);
  }

  function searchAction() {}

  function addAction() {
    let key = prompt("Module Key:");
    iconicData.update(x => {
      x.modules.push({
        key,
        raw: " ".repeat(32 * 32),
        parts: [],
      });
      return x;
    });
  }

  function renameAction() {
    let key = prompt("Module Key (press escape to cancel):");
    if (key == null) return;
    iconicData.update(x => {
      x.modules[get(selectedModule)].key = key;
      return x;
    });
  }

  function reorderAction() {}

  function copypartsAction() {}

  function copytextAction() {}

  function folderAction() {}
</script>

<div class="tools">
  <div class="tool-row">
    <button class="btn"><img src={loadIcon} alt="Download" title="Download" /></button>
    <div class="full">Assets gathered</div>
  </div>
  <div class="tool-row">
    {#if $iconicData.modules.length === 0}
      <div class="full">No modules to select</div>
    {:else if $selectedModule < 0 || $selectedModule >= $iconicData.modules.length}
      <button class="btn" on:click={() => selectedModule.set(0)}><img src={leftIcon} alt="Left" title="Left" /></button>
      <div class="full">Invalid module selected</div>
      {selectedModule.set(0)}
    {:else}
      <button class="btn" on:click={leftAction}><img src={leftIcon} alt="Left" title="Left" /></button>
      <div class="full">{$iconicData.modules[$selectedModule].key}</div>
      <button class="btn" on:click={rightAction}><img src={rightIcon} alt="Right" title="Right" /></button>
    {/if}
  </div>
  <div class="tool-row">
    <button class="btn"><img src={searchIcon} alt="Search" title="Search" /></button>
    <button class="btn" on:click={addAction}><img src={addIcon} alt="Add" title="Add" /></button>
    <button class="btn"><img src={addmultipleIcon} alt="Add Multiple" title="Add Multiple" /></button>
    <button class="btn" on:click={renameAction}><img src={renameIcon} alt="Rename" title="Rename" /></button>
    <button class="btn"><img src={reorderIcon} alt="Reorder" title="Reorder" /></button>
    <button class="btn"><img src={copypartsIcon} alt="Copy Parts" title="Copy Parts" /></button>
    <button class="btn"><img src={copytextIcon} alt="Copy Text" title="Copy Text" /></button>
    <button class="btn"><img src={fileIcon} alt="File" title="File" /></button>
  </div>
  <div class="tool-row">
    <button class="btn" on:click={saveAction}><img src={saveIcon} alt="Save" title="Save" /></button>
    <div class="full">1 unsaved</div>
    <button class="btn"><img src={backIcon} alt="Back" title="Back" /></button>
  </div>
</div>

<style lang="scss">
  .tools {
    width: 200px;

    .tool-row {
      display: flex;
      height: 25px;

      .btn {
        width: 25px;
        height: 25px;
        overflow: hidden;
        text-align: text;
        border: none;
        padding: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .full {
        flex-grow: 1;
      }
    }
  }
</style>
