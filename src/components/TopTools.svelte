<script lang="ts">
  import {
    containsMissingPart,
    getCurrentModuleString,
    getPartByChar,
    getPartChar,
    hoveredChar,
    selectedChar,
    selectedModule,
  } from "~/stores/editor-data";
  import {iconicData, type iconicDataModule, type iconicDataPart} from "~/stores/iconic-data";
  import DynamicPartColor from "./DynamicPartColor.svelte";

  let renameMode: {part: iconicDataPart; i: number} | null = null;
  let renameInput: HTMLInputElement;

  $: if (renameInput) renameInput.focus();

  function renamePart(value: string, part: iconicDataPart, i: number) {
    const module = $iconicData.modules[$selectedModule];
    value = value.trim();
    if (value === "") {
      if (confirm("Do you want to remove this part?")) {
        deletePart(module, part, i);
      }
      return;
    }
    $iconicData.modules[$selectedModule].parts[i] = {name: value, color: module.parts[i].color};
    $iconicData.modules[$selectedModule].dirty = true;
    $iconicData = $iconicData;
  }

  function renamePartKeyPress(e) {
    if (renameMode && e.which === 27) renameMode = null;
  }

  function renamePartBlur() {
    if (renameMode) renamePart(renameInput.value, renameMode.part, renameMode.i);
    renameMode = null;
  }

  function selectPartKeyPress(e) {
    if (renameMode != null) return;
    let n = getPartByChar(e.key);
    if (n == -1) return;
    if ($iconicData.modules.length === 0) return;
    if ($selectedModule < 0 || $selectedModule >= $iconicData.modules.length) return;
    let module = $iconicData.modules[$selectedModule];
    let parts = module.parts;
    if (n >= parts.length) {
      let nextPart = getPartChar(parts.length);
      addPart(module);
      selectedChar.set(nextPart);
      console.log("nextPart", nextPart);
    } else {
      selectedChar.set(e.key);
    }
  }

  function addPart(module: iconicDataModule) {
    module.parts.push({char: getPartChar(module.parts.length), name: "Part #" + module.parts.length, color: ""});
    $iconicData.modules[$selectedModule].parts = module.parts;
    $iconicData.modules[$selectedModule].dirty = true;
    $iconicData = $iconicData;
  }

  function deletePart(module: iconicDataModule, part: iconicDataPart, i: number) {
    $iconicData.modules[$selectedModule].parts.splice(i, 1);
    let raw = getCurrentModuleString($iconicData, $selectedModule);
    raw = raw.replaceAll(getPartChar(i), " ");
    for (let j = i; j < module.parts.length; j++) {
      raw = raw.replaceAll(getPartChar(j + 1), getPartChar(j));
    }
    $iconicData.modules[$selectedModule].raw = raw;
    $iconicData.modules[$selectedModule].dirty = true;
    $iconicData = $iconicData;
    selectedChar.set(" ");
    hoveredChar.set(" ");
  }
</script>

<svelte:window on:keypress|stopPropagation={selectPartKeyPress} />

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
        class="part-row"
        class:hovered={$hoveredChar === partChar}
        class:selected={$selectedChar === partChar}
        on:mouseenter={() => hoveredChar.set(partChar)}
        on:mouseleave={() => hoveredChar.set("")}
        on:click={() => (renameMode = {part, i})}
      >
        <div class="part-color">
          <DynamicPartColor moduleIndex={$selectedModule} partIndex={i} />
        </div>
        <div class="part-char">{partChar}</div>
        {#if renameMode && renameMode.part === part && renameMode.i === i}
          <div class="part-rename">
            <input
              type="text"
              value={part.name}
              bind:this={renameInput}
              on:blur={() => renamePartBlur()}
              on:keydown|stopPropagation={e => renamePartKeyPress(e)}
            />
          </div>
        {:else}
          <div class="part-name">{part.name}</div>
          <button class="part-delete" on:click|preventDefault|stopPropagation={() => deletePart(module, part, i)} />
        {/if}
      </button>
    {/each}
    <button class="part-row" on:click={() => addPart(module)}>
      <div class="part-color" />
      <div class="part-char">+</div>
    </button>
    {#if containsMissingPart(module)}
      <div class="part-row">Missing part</div>
    {/if}
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

      .part-delete {
        width: 20px;
        height: 20px;
        position: relative;

        &::after {
          display: block;
          position: absolute;
          content: "\d7";
          top: 50%;
          left: 50%;
          width: 100%;
          font-size: 25px;
          transform: translate(-50%, -50%) translateY(-2.5px);
          pointer-events: none;
        }
      }
    }
  }
</style>
