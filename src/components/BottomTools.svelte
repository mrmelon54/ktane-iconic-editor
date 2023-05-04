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
</script>

<div class="tools">
  <div class="tool-row">
    <div class="btn"><img src={loadIcon} alt="Download" title="Download" /></div>
    <div class="full">Assets gathered</div>
  </div>
  <div class="tool-row">
    <div class="btn"><img src={leftIcon} alt="Left" title="Left" /></div>
    <div class="full">The Bulb</div>
    <div class="btn"><img src={rightIcon} alt="Right" title="Right" /></div>
  </div>
  <div class="tool-row">
    <div class="btn"><img src={searchIcon} alt="Search" title="Search" /></div>
    <div class="btn"><img src={addIcon} alt="Add" title="Add" /></div>
    <div class="btn"><img src={addmultipleIcon} alt="Add Multiple" title="Add Multiple" /></div>
    <div class="btn"><img src={renameIcon} alt="Rename" title="Rename" /></div>
    <div class="btn"><img src={reorderIcon} alt="Reorder" title="Reorder" /></div>
    <div class="btn"><img src={copypartsIcon} alt="Copy Parts" title="Copy Parts" /></div>
    <div class="btn"><img src={copytextIcon} alt="Copy Text" title="Copy Text" /></div>
    <div class="btn"><img src={fileIcon} alt="File" title="File" /></div>
  </div>
  <div class="tool-row">
    <div class="btn"><img src={saveIcon} alt="Save" title="Save" /></div>
    <div class="full">1 unsaved</div>
    <div class="btn"><img src={backIcon} alt="Back" title="Back" /></div>
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
