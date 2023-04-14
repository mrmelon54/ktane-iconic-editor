<div class="tools">
  <div class="tool-row">
    <div class="btn">Download</div>
    <div class="full">Assets gathered</div>
  </div>
  <div class="tool-row">
    <div class="btn">&lt;</div>
    <div class="full">The Bulb</div>
    <div class="btn">&gt;</div>
  </div>
  <div class="tool-row">
    <div class="btn">Search</div>
    <div class="btn">Add</div>
    <div class="btn">Add Multiple</div>
    <div class="btn">Rename</div>
    <div class="btn">Reorder</div>
    <div class="btn">Copy Parts</div>
    <div class="btn">Copy Text</div>
    <div class="btn">File</div>
  </div>
  <div class="tool-row">
    <div class="btn">Save</div>
    <div class="full">1 unsaved</div>
    <div class="btn">Back</div>
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
      }

      .full {
        flex-grow: 1;
      }
    }
  }
</style>
