<script lang="ts">
  import {getCurrentModuleString, getPartChar, getPartColor, hoveredChar, selectedChar, selectedModule} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";
</script>

<div class="tools">
  <div class="tool-row">
    <div class="char-view">{$selectedChar}</div>
  </div>
  {#if $iconicData.modules.length === 0}
    <div class="full">No modules to select</div>
  {:else if $selectedModule < 0 || $selectedModule >= $iconicData.modules.length}
    <div class="full">Invalid module selected</div>
  {:else}
    {@const module = $iconicData.modules[$selectedModule]}
    {#each module.parts as part, i}
      {@const partChar = getPartChar(i)}
      <button
        class="part-row {$hoveredChar === partChar ? 'hovered' : ''} {$selectedChar === partChar ? 'selected' : ''}"
        on:mouseenter={() => hoveredChar.set(partChar)}
        on:mouseleave={() => hoveredChar.set("")}
        on:click={() => selectedChar.set(partChar)}
        on:dblclick={() => {
          let name = prompt("Enter new part name, an empty name will remove the part:", part);
          if (name == null) return;
          name = name.trim();
          if (name === "") {
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
          $iconicData.modules[$selectedModule].parts[i] = name;
          $iconicData = $iconicData;
        }}
      >
        <div class="part-color" style="background-color:{getPartColor(i)}" />
        <div class="part-char">{partChar}</div>
        <div class="part-name">{part}</div>
      </button>
    {/each}
    <button
      class="part-row"
      on:click={() => {
        module.parts.push("Part #" + module.parts.length);
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

      .btn {
        width: 25px;
        height: 25px;
        overflow: hidden;
        text-align: text;
        border: none;
        padding: 0;
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
        color: black;
      }

      &.selected {
        background-color: green;
        color: black;
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
