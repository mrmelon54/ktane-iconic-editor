<script lang="ts">
  import {hoveredChar, selectedChar, selectedModule} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";
  import AddPartDialog from "./AddPartDialog.svelte";

  let showDialog: boolean = false;

  function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }
</script>

<div class="tools">
  <div class="tool-row">
    <div class="btn">{$selectedChar}</div>
  </div>
  {#if $iconicData.modules.length === 0}
    <div class="full">No modules to select</div>
  {:else if $selectedModule < 0 || $selectedModule >= $iconicData.modules.length}
    <div class="full">Invalid module selected</div>
  {:else}
    {@const module = $iconicData.modules[$selectedModule]}
    {#each module.parts as part}
      <button
        class="part-row {$hoveredChar === part.char ? 'hovered' : ''}"
        on:mouseenter={() => hoveredChar.set(part.char)}
        on:mouseleave={() => hoveredChar.set("")}
        on:click={() => selectedChar.set(part.char)}
      >
        <div class="part-color" style="background-color:{part.color}" />
        <div class="part-char">{part.char}</div>
        <div class="part-name">{part.name}</div>
      </button>
    {/each}
    <button class="part-row" on:click={() => (showDialog = true)}>
      <div class="part-color" />
      <div class="part-char">+</div>
    </button>
    {#if showDialog}
      <AddPartDialog
        close={() => (showDialog = false)}
        submit={arg => {
          module.parts.push(arg);
          $iconicData.modules[$selectedModule].parts = module.parts;
        }}
        nextChar={nextChar(module.parts[module.parts.length - 1].char)}
      />
    {/if}
  {/if}
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
    }

    .part-row {
      display: flex;
      height: 20px;
      cursor: pointer;
      border: none;
      padding: 0;
      background: none;
      text-align: left;
      width: inherit;
      font-size: inherit;

      &.hovered {
        background-color: yellow;
      }

      .part-color {
        width: 5px;
        height: 20px;
      }

      .part-char {
        width: 20px;
        height: 20px;
        overflow: hidden;
        text-align: center;
      }

      .part-name {
        flex-grow: 1;
        height: 20px;
      }
    }
  }
</style>
