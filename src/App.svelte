<script lang="ts">
  import BottomTools from "./components/BottomTools.svelte";
  import IconView from "./components/IconView.svelte";
  import TopTools from "./components/TopTools.svelte";
</script>

<div id="content">
  <div id="left-tools" />
  <div id="icon-view">
    <IconView />
  </div>
  <div id="right-tools">
    <div id="top-tools">
      <TopTools />
    </div>
    <div id="bottom-tools">
      <BottomTools />
    </div>
  </div>
</div>

<style lang="scss">
  #content {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    max-width: 100vw;

    #icon-view {
      display: flex;
      background: green;
      width: 100%;
    }

    #right-tools {
      display: flex;
      height: 100%;
      justify-content: space-between;
      flex-direction: column;

      #top-tools {
        background: blue;
      }

      #bottom-tools {
        background: red;
      }
    }
  }
</style>
