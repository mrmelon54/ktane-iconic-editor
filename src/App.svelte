<script lang="ts">
  import BottomTools from "./components/BottomTools.svelte";
  import IconView from "./components/IconView.svelte";
  import TopTools from "./components/TopTools.svelte";
  import {iconicData, isIconicDataType} from "./stores/iconic-data";

  function onFileSelected(files) {
    let image = files[0];
    let reader = new FileReader();
    reader.readAsText(image);
    reader.onload = e => {
      try {
        let j = JSON.parse(e.target.result as string);
        if (!isIconicDataType(j)) throw new Error("JSON file follows wrong format");
        iconicData.set(j);
      } catch (e) {
        alert("Failed to parse JSON file: " + e);
      }
    };
  }

  let dropArea;
  let fileinput;

  function dragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add("highlight");
  }

  function dragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    dragLeave(e);
    let dt = e.dataTransfer;
    let files = dt.files;
    onFileSelected(files);
  }
</script>

<div id="content" on:dragenter={dragEnter} on:dragover={dragEnter} on:dragleave={dragLeave} on:drop={handleDrop} bind:this={dropArea}>
  <div id="left-tools" />
  <div id="icon-view">
    <IconView />
  </div>
  <div id="right-tools">
    <div id="top-tools">
      <TopTools />
    </div>
    <div id="bottom-tools">
      <BottomTools />
    </div>
  </div>
  <div id="dragDropOverlay">
    <div>Drop file to upload</div>
  </div>
</div>

<!-- file upload -->
<input style="display:none" type="file" accept=".json" on:change={() => onFileSelected(this.files)} bind:this={fileinput} />

<style lang="scss">
  #content {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    max-width: 100vw;

    #icon-view {
      display: flex;
      background: green;
      width: 100%;
    }

    #right-tools {
      display: flex;
      height: 100%;
      justify-content: space-between;
      flex-direction: column;

      #top-tools {
        background: blue;
      }

      #bottom-tools {
        background: red;
      }
    }

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
</style>
