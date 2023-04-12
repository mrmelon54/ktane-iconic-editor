<script lang="ts">
  import {onMount} from "svelte/internal";

  let C: HTMLCanvasElement;

  onMount(() => {
    const ctx = C.getContext("2d");
    let frame = requestAnimationFrame(loop);

    function loop() {
      frame = requestAnimationFrame(loop);

      let t = 1;

      const imageData = ctx.getImageData(0, 0, C.width, C.height);

      for (let p = 0; p < imageData.data.length; p += 4) {
        const i = p / 4;
        const x = i % C.width;
        const y = (i / C.width) >>> 0;

        const r = 64 + (128 * x) / C.width + 64 * Math.sin(t / 1000);
        const g = 64 + (128 * y) / C.height + 64 * Math.cos(t / 1000);
        const b = 128;

        imageData.data[p + 0] = r;
        imageData.data[p + 1] = g;
        imageData.data[p + 2] = b;
        imageData.data[p + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<div id="icon-wrapper">
  <canvas bind:this={C} id="icon" />
</div>

<style lang="scss">
  #icon-wrapper {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;

    > #icon {
      aspect-ratio: 1/1;
      width: 100%;
      background: lightcoral;
    }
  }
</style>
