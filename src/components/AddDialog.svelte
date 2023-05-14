<script lang="ts">
  import {getIconUrl} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";

  export let close: () => void;

  let inputValue: string;
  $: ((_: string) => {
    readyToSubmit = null;
  })(inputValue);

  let verifying: boolean;
  let verifyFetch: number;
  let readyToSubmit: Array<string> | null = null;
  let missingMods: Array<string> | null = null;
  let existingMods: number = 0;

  function getParsedInput(): Array<string> {
    return inputValue.split("\n").map(x => x.trim());
  }

  async function submit() {
    verifying = true;

    // pre-parsed input is ready
    if (readyToSubmit !== null) {
      iconicData.update(data => {
        readyToSubmit.forEach(x => {
          data.modules.push({
            key: x,
            raw: " ".repeat(32 * 32),
            parts: [],
          });
        });
        return data;
      });
      close();
      return;
    }

    let modList = correctNames(getParsedInput());
    let modKeys = $iconicData.modules.map(x => x.key.toLowerCase());
    let newMods = modList.filter(x => !modKeys.includes(x.toLowerCase()));
    existingMods = modList.length - newMods.length;

    let reqDone = await Promise.all(newMods.map(x => moduleCheckPromise(x)));
    newMods = reqDone.filter(x => x.exists).map(x => x.module);
    let missMods = reqDone.filter(x => !x.exists).map(x => x.module);

    readyToSubmit = newMods;
    missingMods = missMods;

    verifying = false;
  }

  function moduleCheckPromise(module: string): Promise<{module: string; exists: boolean}> {
    return new Promise<{module: string; exists: boolean}>((res, rej) => {
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", encodeURI(getIconUrl(module)));
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 2) res({module, exists: xmlHttp.status === 200});
      };
      xmlHttp.send();
    });
  }

  function correctNames(v: Array<string>): Array<string> {
    return v.map(x => {
      x = x.replaceAll("’", "'");
      return x;
    });
  }
</script>

<div class="dialog-outer">
  <div class="dialog">
    <div class="dialog-header">
      <h2>Add Modules</h2>
      <button class="cancel-button" on:click={() => close()}>&times;</button>
    </div>
    <div class="dialog-content">
      <div>
        <textarea class="add-textbox" bind:value={inputValue} />
      </div>
      {#if verifying}
        <div>Verifying input</div>
      {:else}
        {#if readyToSubmit !== null && missingMods !== null}
          <div>Submitting will add {readyToSubmit.length} module{readyToSubmit.length === 1 ? "" : "s"}.</div>
          <div title={missingMods.join("\n")}>
            {missingMods.length} module{missingMods.length === 1 ? "" : "s"} are missing an icon.
            <button on:click={() => (inputValue = missingMods.join("\n"))}>Output to box</button>
          </div>
          <div>{existingMods} module{existingMods === 1 ? "" : "s"} are already here and were ignored.</div>
          <div>Press the button again to add modules</div>
        {/if}
        <div>
          <button on:click={() => submit()}>{readyToSubmit !== null ? "Submit" : "Verify"}</button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @import "../assets/dialog.scss";

  .add-textbox {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 300px;
  }
</style>
