<script lang="ts">
  import type {iconicDataPart} from "~/stores/iconic-data";

  export let close: () => void;
  export let submit: (arg: iconicDataPart) => void;
  export let nextChar: string = "";

  let colorValue: string = "#000000";
  let charValue: string = nextChar;
  let nameValue: string = "";
</script>

<div id="add-part-dialog">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Add Part</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <div>
        <label for="color-field">Color:</label>
        <input id="color-field" name="color-field" type="color" bind:value={colorValue} />
      </div>
      <div>
        <label for="char-field">Char:</label>
        <input id="char-field" name="char-field" type="text" bind:value={charValue} />
      </div>
      <div>
        <label for="name-field">Name:</label>
        <input id="name-field" name="name-field" type="text" bind:value={nameValue} />
      </div>
      <div>
        <button
          on:click={() => {
            submit({color: colorValue, char: charValue, name: nameValue});
            close();
          }}>Add Part</button
        >
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  #add-part-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);

    > .dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 300px;
      transform: translate(-50%, -50%);
      background-color: #242424;
      padding: 16px;

      > .dialog-header {
        display: flex;
        justify-content: space-between;

        > h2 {
          margin: 0;
        }
      }
    }
  }
</style>
