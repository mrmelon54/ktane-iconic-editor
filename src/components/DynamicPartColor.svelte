<script lang="ts">
  import {getPartColor, updateOnLoad} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";

  export let moduleIndex: number;
  export let partIndex: number;

  let c = getColor();
  $: $updateOnLoad, moduleIndex, partIndex, (c = getColor());

  function getColor(): string {
    let a = $iconicData.modules[moduleIndex].parts[partIndex].color;
    if (!a || a === "") return getPartColor(partIndex);
    return a;
  }

  function changeInput() {
    $iconicData.modules[moduleIndex].parts[partIndex].color = c;
    $iconicData = $iconicData;
  }
</script>

<input type="color" bind:value={c} on:change={() => changeInput()} />

<style lang="scss">
  input[type="color"] {
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    border: none;
  }
</style>
