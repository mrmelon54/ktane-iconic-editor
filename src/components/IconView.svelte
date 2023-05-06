<script lang="ts">
  import {onMount} from "svelte/internal";
  import {get} from "svelte/store";
  import {selectedModule} from "~/stores/editor-data";
  import {iconicData} from "~/stores/iconic-data";

  let iconWrapper: HTMLDivElement;
  let moduleIcon: HTMLImageElement = new Image(32, 32);
  let moduleCanvas: HTMLCanvasElement;
  $: moduleCtx = moduleCanvas ? moduleCanvas.getContext("2d") : undefined;
  let imData: ImageData;
  $: imPix = (x, y, i) => imData.data[y * 32 * 4 + x * 4 + i];
  let C: HTMLCanvasElement;

  moduleIcon.addEventListener("load", () => {
    moduleCtx.clearRect(0, 0, 32, 32);
    moduleCtx.drawImage(moduleIcon, 0, 0);
    imData = moduleCtx.getImageData(0, 0, 32, 32);
  });

  selectedModule.subscribe(x => {
    moduleIcon.crossOrigin = "anonymous";
    let module = get(iconicData).modules[x];
    if (module == undefined) {
      moduleIcon.src = "about:blank";
      return;
    }
    moduleIcon.src = "https://ktane.mrmelon54.com/Icons/" + module.key + ".png";
  });

  window.addEventListener("resize", resizeCanvas);

  function resizeCanvas() {
    C.style.width = "0";
    C.style.height = "0";
    let w = iconWrapper.clientWidth;
    let h = iconWrapper.clientHeight;
    let s = w <= h ? w : h;
    C.style.width = s + "px";
    C.style.height = s + "px";
    C.width = s;
    C.height = s;
  }

  onMount(() => {
    const ctx = C.getContext("2d");
    let frame = requestAnimationFrame(loop);
    resizeCanvas();

    function loop() {
      frame = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, C.clientWidth, C.clientHeight);

      let s = Math.floor(C.clientWidth / 32);
      let o = Math.floor((C.clientWidth - s * 32) / 2);
      if (imData) {
        for (let i = 0; i < 32; i++) {
          for (let j = 0; j < 32; j++) {
            ctx.fillStyle = `rgba(${imPix(i, j, 0)},${imPix(i, j, 1)},${imPix(i, j, 2)},${imPix(i, j, 3)})`;
            ctx.fillRect(i * s + o, j * s + o, s, s);
          }
        }
      } else {
        for (let i = 0; i < 32; i++) {
          for (let j = 0; j < 32; j++) {
            if (i % 2 == j % 2) ctx.fillStyle = "red";
            else ctx.fillStyle = "rebeccapurple";
            ctx.fillRect(i * s + o, j * s + o, s, s);
          }
        }
      }

      ctx.fillStyle = "lightcoral";
      ctx.fillRect(s * 32 + o, 0, C.clientWidth, C.clientHeight);
      ctx.fillRect(0, s * 32 + o, C.clientWidth, C.clientHeight);
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<div id="icon-wrapper">
  <div id="icon-size" bind:this={iconWrapper}>
    <canvas bind:this={C} id="icon" />
    <canvas bind:this={moduleCanvas} id="module-icon-hidden" />
  </div>
</div>

<style lang="scss">
  #icon-wrapper {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;

    #icon-size {
      width: 100%;
      height: 100%;
      overflow: hidden;

      #icon {
        aspect-ratio: 1/1;
        background: lightcoral;
        image-rendering: pixelated;
      }

      #module-icon-hidden {
        display: none;
        image-rendering: pixelated;
      }
    }
  }
</style>
