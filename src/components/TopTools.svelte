<script lang="ts">
  import {
    getCurrentModuleString,
    getNextPartCharSafe,
    getPartChar,
    getPartColor,
    hoveredChar,
    selectedChar,
    selectedModule,
  } from "~/stores/editor-data";
  import {iconicData, type iconicDataPart} from "~/stores/iconic-data";
  import DynamicPartColor from "./DynamicPartColor.svelte";

  let renameMode: {part: iconicDataPart; i: number} | null = null;
  let renameInput: HTMLInputElement;

  $: if (renameInput) renameInput.focus();

  function renamePart(value: string, part: iconicDataPart, i: number) {
    const module = $iconicData.modules[$selectedModule];
    value = value.trim();
    if (value === "") {
      if (confirm("Do you want to remove this part?")) {
        $iconicData.modules[$selectedModule].parts.splice(i, 1);
        let raw = getCurrentModuleString($iconicData, $selectedModule);
        raw = raw.replaceAll(getPartChar(i), " ");
        for (let j = i; j < module.parts.length; j++) {
          raw = raw.replaceAll(getPartChar(j + 1), getPartChar(j));
        }
        $iconicData.modules[$selectedModule].raw = raw;
        $iconicData = $iconicData;
      }
      return;
    }
    $iconicData.modules[$selectedModule].parts[i] = {char: module.parts[i].char, name: value, color: module.parts[i].color};
    $iconicData = $iconicData;
  }

  function renamePartKeyPress(e) {
    if (renameMode && e.which === 27) renameMode = null;
  }

  function renamePartBlur() {
    if (renameMode) renamePart(renameInput.value, renameMode.part, renameMode.i);
  }
</script>

<div class="tools">
  {#if $iconicData.modules.length === 0}
    <div class="full">No modules to select</div>
  {:else if $selectedModule < 0 || $selectedModule >= $iconicData.modules.length}
    <div class="full">Invalid module selected</div>
  {:else}
    <div class="tool-row">
      <div class="char-view">{$selectedChar}</div>
    </div>
    {@const module = $iconicData.modules[$selectedModule]}
    {#each module.parts as part, i}
      {@const partChar = getPartChar(i)}
      <button
        class="part-row {$hoveredChar === partChar ? 'hovered' : ''} {$selectedChar === partChar ? 'selected' : ''}"
        on:mouseenter={() => hoveredChar.set(partChar)}
        on:mouseleave={() => hoveredChar.set("")}
        on:click={() => selectedChar.set(partChar)}
        on:dblclick={() => (renameMode = {part, i})}
      >
        <div class="part-color">
          <DynamicPartColor moduleIndex={$selectedModule} partIndex={i} />
        </div>
        <div class="part-char">{partChar}</div>
        {#if renameMode && renameMode.part === part && renameMode.i === i}
          <div class="part-rename">
            <input type="text" value={part.name} bind:this={renameInput} on:blur={() => renamePartBlur()} on:keydown={e => renamePartKeyPress(e)} />
          </div>
        {:else}
          <div class="part-name">{part.name}</div>
        {/if}
      </button>
    {/each}
    <button
      class="part-row"
      on:click={() => {
        module.parts.push({char: getNextPartCharSafe(module.parts), name: "Part #" + module.parts.length, color: ""});
        $iconicData.modules[$selectedModule].parts = module.parts;
        $iconicData = $iconicData;
      }}
    >
      <div class="part-color" />
      <div class="part-char">+</div>
    </button>
  {/if}
</div>

<style lang="scss">
  .tools {
    width: 100%;

    .tool-row {
      display: flex;
      height: 25px;

      .char-view {
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
      color: rgba(255, 255, 255, 0.87);

      &.hovered {
        background-color: yellow;
        color: black;
      }

      &.selected {
        background-color: green;
        color: black;
      }

      .part-color {
        width: 20px;
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
