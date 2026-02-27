<script lang="ts">
  import {createEventDispatcher, onMount} from "svelte";
  import type {jsonRawModule} from "~/stores/ktane-json-raw";
  import TopTools from "./TopTools.svelte";

  const dispatch = createEventDispatcher();

  interface Props {
    moduleList?: Array<jsonRawModule>;
  }

  let {moduleList = new Array()}: Props = $props();

  let inputValue: string = $state("");
  let filteredList: Array<jsonRawModule> = $derived(filterModuleList(inputValue, moduleList));
  let selectedModule: number = $state(0);
  $effect(() => {
    selectedModule = fixSelection(selectedModule, filteredList);
  });
  let scrollingFilterList: HTMLDivElement = $state();

  function inputKeyPress(event: KeyboardEvent & {currentTarget: EventTarget & HTMLInputElement}) {
    event.stopPropagation();
    switch (event.code) {
      case "Enter":
        event.preventDefault();
        dispatch("select", filteredList[selectedModule]);
        inputValue = "";
        break;
      case "ArrowUp":
        event.preventDefault();
        selectedModule = fixSelection(selectedModule - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        selectedModule = fixSelection(selectedModule + 1);
        break;
    }
  }

  function filterModuleList(v: string, moduleList: Array<jsonRawModule>): Array<jsonRawModule> {
    let m = moduleList
      .filter(
        x =>
          stringContains(x.ModuleID, v) ||
          (x.Name && stringContains(x.Name, v)) ||
          (x.FileName && stringContains(x.FileName, v)) ||
          (x.Symbol && stringContains(x.Symbol, v)) ||
          x.SteamID === v,
      )
      .slice(0, 100);
    m.sort(moduleMetaCompare(v));
    return m;
  }

  function moduleMetaMatch(a: jsonRawModule, v: string): boolean {
    return (
      stringMatch(a.ModuleID, v) ||
      (a.Name && stringMatch(a.Name, v)) ||
      (a.FileName && stringMatch(a.FileName, v)) ||
      (a.Symbol && stringMatch(a.Symbol, v)) ||
      (a.SteamID && stringMatch(a.SteamID, v))
    );
  }

  function moduleMetaCompare(v: string) {
    return function (a: jsonRawModule, b: jsonRawModule) {
      let a2 = moduleMetaMatch(a, v);
      let b2 = moduleMetaMatch(b, v);
      if (a2) return b2 ? 0 : -1;
      else return b2 ? 1 : 0;
    };
  }

  function stringMatch(a: string, b: string): boolean {
    return stringCompare(a, b) == 0;
  }

  function stringContains(a: string, b: string): boolean {
    return (a || "").toLowerCase().includes((b || "").toLowerCase());
  }

  function stringCompare(a: string, b: string): number {
    return (a || "").localeCompare(b || "", "en", {sensitivity: "base"});
  }

  function fixSelection<T>(sel: number, list: Array<T>) {
    if (sel < 0) sel = 0;
    if (sel >= list.length) sel = list.length - 1;
    return sel;
  }

  function scrollToSelection() {
    if (!scrollingFilterList) return;
    let height = scrollingFilterList.clientHeight;
    let scrollHeight = scrollingFilterList.scrollHeight || height;
    let itemHeight = scrollHeight / filteredList.length;
    let y = selectedModule * itemHeight - height / 2;
    if (y < 0) y = 0;
    if (y > scrollHeight) y = scrollHeight;
    scrollingFilterList.scrollTop = y;
  }

  let inputField: HTMLInputElement = $state();

  onMount(() => {
    inputField.focus();
  });
  $effect(() => {
    filteredList;
    selectedModule;
    scrollToSelection();
  });
</script>

<div class="search-box">
  <div class="input-wrapper">
    <input class="add-input" bind:this={inputField} bind:value={inputValue} onkeypress={inputKeyPress} onkeydown={inputKeyPress} />
  </div>
  <div class="scrolling-filter" bind:this={scrollingFilterList}>
    {#each filteredList as filterItem, i (filterItem.ModuleID)}
      {#if selectedModule == i}
        <div class="selectedFilterItem">{filterItem.Name}</div>
      {:else}
        <div>{filterItem.Name}</div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  .search-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .input-wrapper {
    padding: 4px;

    .add-input {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
    }
  }

  .selectedFilterItem {
    background-color: rgba(255, 0, 0, 0.2);
  }

  .scrolling-filter {
    overflow-y: auto;
    margin-top: 8px;
  }
</style>
