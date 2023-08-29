<script lang="ts">
  import Wrapper from "./InnerApp.svelte";
  import {loadRawModuleData} from "./stores/ktane-json-raw";

  let rawModuleData = loadRawModuleData();
</script>

{#await rawModuleData}
  <div>Loading KTaNE Iconic Editor...</div>
{:then _}
  <Wrapper />
{:catch err}
  <div>Failed to load KTaNE Iconic Editor: {err}</div>
{/await}
