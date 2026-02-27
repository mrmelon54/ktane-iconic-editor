<script lang="ts">
  import { run } from 'svelte/legacy';

  import {getPartColor, updateOnLoad} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";

  interface Props {
    moduleIndex: number;
    partIndex: number;
  }

  let { moduleIndex, partIndex }: Props = $props();

  let c = $state(getColor());

  function getColor(): string {
    let a = $iconicData.modules[moduleIndex].parts[partIndex].color;
    if (!a || a === "") return getPartColor(partIndex);
    return a;
  }

  function changeInput() {
    $iconicData.modules[moduleIndex].parts[partIndex].color = c;
    $iconicData = $iconicData;
  }
  run(() => {
    $updateOnLoad, moduleIndex, partIndex, (c = getColor());
  });
</script>

<input type="color" bind:value={c} onchange={() => changeInput()} />

<style lang="scss">
  input[type="color"] {
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    border: none;
  }
</style>
