<script lang="ts">
  let parts = [
    {colour: "#ff0000", char: "0", name: "O"},
    {colour: "#00ff00", char: "1", name: "I"},
    {colour: "#0000ff", char: "2", name: "The bulb"},
  ];
</script>

<div class="tools">
  <div class="tool-row">
    <div class="btn">0</div>
  </div>
  {#each parts as part}
    <div class="part-row">
      <div class="part-colour" style="background-color:{part.colour}" />
      <div class="part-char">{part.char}</div>
      <div class="part-name">{part.name}</div>
    </div>
  {/each}
  <div class="part-row">
    <div class="part-colour" />
    <div class="part-char">+</div>
  </div>
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

      .part-colour {
        width: 5px;
        height: 20px;
      }

      .part-char {
        width: 20px;
        height: 20px;
        overflow: hidden;
      }

      .part-name {
        flex-grow: 1;
        height: 20px;
      }
    }
  }
</style>
