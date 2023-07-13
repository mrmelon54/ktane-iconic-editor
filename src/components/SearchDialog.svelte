<script lang="ts">
  import {iconicData} from "~/stores/iconic-data";
  import {onMount} from "svelte";
  import {selectedModule} from "~/stores/editor-data";

  export let close: () => void;

  let inputElement: HTMLInputElement;
  let inputValue: string;

  function changeModule() {
    let v = inputValue;
    let i = $iconicData.modules.findIndex(x => x.key == v);
    $selectedModule = i;
  }

  function keyPress(e) {
    if (e.which === 27 || e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  }

  onMount(() => {
    inputElement.focus();
  });
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Reorder Modules</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <p>Search for a module</p>
      <div>
        <input
          class="add-input"
          list="modules"
          bind:value={inputValue}
          bind:this={inputElement}
          on:input={() => changeModule()}
          on:keydown={keyPress}
        />
        <datalist id="modules">
          {#each $iconicData.modules as module}
            <option value={module.key} />
          {/each}
        </datalist>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .add-input {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 20pt;
  }
</style>
