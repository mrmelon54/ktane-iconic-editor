<script lang="ts">
  import Wrapper from "./InnerApp.svelte";
  import {loadRawIconsData} from "./stores/ktane-icons-raw";
  import {loadRawModuleData} from "./stores/ktane-json-raw";

  let rawModuleData = loadRawModuleData();
  let rawIconsData = loadRawIconsData();

  let all = Promise.all([rawModuleData, rawIconsData]);
</script>

{#await all}
  <div>Loading KTaNE Iconic Editor...</div>
{:then _}
  <Wrapper />
{:catch err}
  <div>Failed to load KTaNE Iconic Editor: {err}</div>
{/await}
