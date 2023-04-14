<script lang="ts">
  import {onMount} from "svelte/internal";

  let iconWrapper: HTMLDivElement;
  let C: HTMLCanvasElement;

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

      let s = C.clientWidth / 32;

      for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
          if (i % 2 == j % 2) ctx.fillStyle = "red";
          else ctx.fillStyle = "rebeccapurple";
          ctx.fillRect(i * s, j * s, i * s + s, j * s + s);
        }
      }
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<div id="icon-wrapper">
  <div id="icon-size" bind:this={iconWrapper}>
    <canvas bind:this={C} id="icon" />
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
    }
  }
</style>
