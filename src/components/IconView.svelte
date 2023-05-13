<script lang="ts">
  import {onMount} from "svelte/internal";
  import {get} from "svelte/store";
  import {hoveredChar, selectedChar, selectedModule} from "~/stores/editor-data";
  import {iconicData, type iconicDataType} from "~/stores/iconic-data";

  let iconWrapper: HTMLDivElement;
  let moduleIcon: HTMLImageElement = new Image(32, 32);
  let moduleCanvas: HTMLCanvasElement;
  $: moduleCtx = moduleCanvas ? moduleCanvas.getContext("2d") : undefined;
  let imData: ImageData;
  $: imPix = (x: number, y: number, i: number) => imData.data[y * 32 * 4 + x * 4 + i];
  let C: HTMLCanvasElement;
  $: moduleRaw = getCurrentModuleString($iconicData, $selectedModule);

  let mouseX = -1;
  let mouseY = -1;
  let mouseHeld = false;

  function getCurrentModuleString(iconicData: iconicDataType, selectedModule) {
    let z = iconicData.modules[selectedModule];
    if (z) return capString(z.raw, 32 * 32);
    return " ".repeat(32 * 32);
  }

  moduleIcon.addEventListener("load", () => {
    moduleCtx.clearRect(0, 0, 32, 32);
    moduleCtx.drawImage(moduleIcon, 0, 0);
    imData = moduleCtx.getImageData(0, 0, 32, 32);
  });

  $: ((x: iconicDataType, y: number) => {
    moduleIcon.crossOrigin = "anonymous";
    let module = x.modules[y];
    if (module == undefined) {
      moduleIcon.src = "about:blank";
      return;
    }
    moduleIcon.src = "https://ktane-icons.mrmelon54.com/Module Icons/" + module.key + ".png";
  })($iconicData, $selectedModule);

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
      let s2 = s / 2;
      let o = Math.floor((C.clientWidth - s * 32) / 2);
      let selChar = $hoveredChar;
      if (imData) {
        for (let i = 0; i < 32; i++) {
          for (let j = 0; j < 32; j++) {
            let z = [imPix(i, j, 0), imPix(i, j, 1), imPix(i, j, 2), imPix(i, j, 3)];
            let r = moduleRaw[j * 32 + i];

            ctx.fillStyle = `rgba(${z[0]},${z[1]},${z[2]},${z[3]})`;
            ctx.fillRect(i * s + o, j * s + o, s, s);

            ctx.fillStyle = colorContrast(z[0], z[1], z[2]);
            ctx.font = "16px Arial";
            ctx.textBaseline = "middle";
            ctx.fillText(r, i * s + s2 - 5 + o, j * s + s2 + o);

            if (selChar == r) {
              ctx.fillStyle = "yellow";
              ctx.fillRect(i * s + o, j * s + o, s, 2);
              ctx.fillRect(i * s + o, j * s + o, 2, s);
              ctx.fillRect(i * s + o, (j + 1) * s + o - 2, s, 2);
              ctx.fillRect((i + 1) * s + o - 2, j * s + o, 2, s);
            }

            if (i === mouseX && j === mouseY) {
              ctx.fillStyle = "green";
              ctx.fillRect(i * s + o, j * s + o, s, 2);
              ctx.fillRect(i * s + o, j * s + o, 2, s);
              ctx.fillRect(i * s + o, (j + 1) * s + o - 2, s, 2);
              ctx.fillRect((i + 1) * s + o - 2, j * s + o, 2, s);
            }
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

  function canvasClick(ev) {
    let {x, y} = getMouseXY(ev);
    replaceModuleRawChar({x, y});
  }

  function canvasMouseMove(ev) {
    let {x, y} = getMouseXY(ev);
    [mouseX, mouseY] = [x, y];
    if (mouseHeld) replaceModuleRawChar({x, y});
  }

  function canvasMouseDown(ev) {
    let {x, y} = getMouseXY(ev);
    [mouseX, mouseY] = [x, y];
    mouseHeld = true;
    replaceModuleRawChar({x, y});
  }

  function canvasMouseUp() {
    mouseHeld = false;
  }

  function canvasMouseLeave() {
    mouseHeld = false;
    mouseX = -1;
    mouseY = -1;
  }

  function replaceModuleRawChar({x, y}) {
    if (x < 0 || y < 0 || x >= 32 || y >= 32) return;
    moduleRaw = replaceAt(moduleRaw, y * 32 + x, $selectedChar);
    iconicData.update(z => {
      z.modules[$selectedModule].raw = moduleRaw;
      return z;
    });
  }

  function getMouseXY({layerX, layerY}) {
    let s = Math.floor(C.clientWidth / 32);
    let o = Math.floor((C.clientWidth - s * 32) / 2);
    let x = Math.floor((layerX - o) / s);
    let y = Math.floor((layerY - o) / s);
    return {x, y};
  }

  // Used algorithm from: https://stackoverflow.com/a/11868159
  function colorContrast(r, g, b) {
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round((parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000);
    return brightness > 125 ? "black" : "white";
  }

  // https://stackoverflow.com/a/1431113
  function replaceAt(s: string, index: number, replacement: string) {
    return s.substring(0, index) + replacement + s.substring(index + replacement.length);
  }

  function capString(s: string, len: number) {
    return s.slice(0, len) + (s.length < len ? " ".repeat(len - s.length) : "");
  }
</script>

<div id="icon-wrapper">
  <div id="icon-size" bind:this={iconWrapper}>
    <canvas
      bind:this={C}
      id="icon"
      on:click={canvasClick}
      on:mousemove={canvasMouseMove}
      on:mousedown={canvasMouseDown}
      on:mouseup={canvasMouseUp}
      on:mouseleave={canvasMouseLeave}
    />
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
