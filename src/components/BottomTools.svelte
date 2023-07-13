<script lang="ts">
  import leftIcon from "~/assets/icons/left.png";
  import rightIcon from "~/assets/icons/right.png";
  import searchIcon from "~/assets/icons/search.png";
  import addIcon from "~/assets/icons/add.png";
  import renameIcon from "~/assets/icons/rename.png";
  import reorderIcon from "~/assets/icons/reorder.png";
  import copypartsIcon from "~/assets/icons/copyparts.png";
  import copytextIcon from "~/assets/icons/copytext.png";
  import saveIcon from "~/assets/icons/save.png";
  import backIcon from "~/assets/icons/back.png";
  import FileSaver from "file-saver";
  import {iconicData} from "~/stores/iconic-data";
  import {selectedModule} from "~/stores/editor-data";
  import AddDialog from "./AddDialog.svelte";
  import CopyDialog from "./CopyDialog.svelte";
  import ReorderDialog from "./ReorderDialog.svelte";
  import SearchDialog from "./SearchDialog.svelte";

  let showSearchDialog: boolean = false;
  let showAddDialog: boolean = false;
  let showReorderDialog: boolean = false;
  let showCopyPartsDialog: boolean = false;
  let showCopyTextDialog: boolean = false;

  function saveAction() {
    // JavaScript is still difficult in 2023
    var blob = new Blob([JSON.stringify($iconicData, null, 4)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "iconicData.json");
  }

  function leftAction() {
    let x = $selectedModule - 1;
    if (x < 0) $selectedModule = $iconicData.modules.length - 1;
    else $selectedModule = x;
  }

  function rightAction() {
    let x = $selectedModule + 1;
    if (x >= $iconicData.modules.length) $selectedModule = 0;
    else $selectedModule = x;
  }

  function renameAction() {
    let key = prompt("Module Key (press escape to cancel):");
    if (key == null) return;
    iconicData.update(x => {
      x.modules[$selectedModule].key = key;
      return x;
    });
  }
</script>

<div class="tools">
  <div class="tool-row">
    {#if $iconicData.modules.length === 0}
      <div class="full">No modules to select</div>
    {:else if $selectedModule < 0 || $selectedModule >= $iconicData.modules.length}
      <button class="btn" on:click={() => ($selectedModule = 0)}><img src={leftIcon} alt="Left" title="Left" /></button>
      <div class="full">Invalid module selected</div>
      {selectedModule.set(0)}
    {:else}
      <button class="btn" on:click={leftAction}><img src={leftIcon} alt="Left" title="Left" /></button>
      <div class="full module-name">{$iconicData.modules[$selectedModule].key}</div>
      <button class="btn" on:click={rightAction}><img src={rightIcon} alt="Right" title="Right" /></button>
    {/if}
  </div>
  <div class="tool-row">
    <button class="btn" on:click={() => (showSearchDialog = true)}><img src={searchIcon} alt="Search" title="Search" /></button>
    <button class="btn" on:click={() => (showAddDialog = true)}><img src={addIcon} alt="Add" title="Add" /></button>
    <button class="btn" on:click={renameAction}><img src={renameIcon} alt="Rename" title="Rename" /></button>
    <button class="btn" on:click={() => (showReorderDialog = true)}><img src={reorderIcon} alt="Reorder" title="Reorder" /></button>
    <button class="btn" on:click={() => (showCopyPartsDialog = true)}><img src={copypartsIcon} alt="Copy Parts" title="Copy Parts" /></button>
    <button class="btn" on:click={() => (showCopyTextDialog = true)}><img src={copytextIcon} alt="Copy Text" title="Copy Text" /></button>
  </div>
  <div class="tool-row">
    <button class="btn" on:click={saveAction}><img src={saveIcon} alt="Save" title="Save" /></button>
    <div class="full">1 unsaved</div>
    <button class="btn"><img src={backIcon} alt="Back" title="Back" /></button>
  </div>
  {#if showSearchDialog}
    <SearchDialog close={() => (showSearchDialog = false)} />
  {/if}
  {#if showAddDialog}
    <AddDialog close={() => (showAddDialog = false)} />
  {/if}
  {#if showReorderDialog}
    <ReorderDialog close={() => (showReorderDialog = false)} />
  {/if}
  {#if showCopyPartsDialog}
    <CopyDialog type="parts" close={() => (showCopyPartsDialog = false)} />
  {/if}
  {#if showCopyTextDialog}
    <CopyDialog type="text" close={() => (showCopyTextDialog = false)} />
  {/if}
</div>

<style lang="scss">
  .tools {
    width: 100%;

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

      .module-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-inline: 8px;
      }
    }
  }
</style>
