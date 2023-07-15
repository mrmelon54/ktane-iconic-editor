<script lang="ts">
  import {onMount} from "svelte/internal";
  import {
    getCurrentModuleString,
    getIconUrl,
    getNextPartCharSafe,
    getPartChar,
    getPartColor,
    getPartColorByChar,
    hoveredChar,
    selectedChar,
    selectedModule,
  } from "~/stores/editor-data";
  import {iconicData, type iconicDataPart, type iconicDataType} from "~/stores/iconic-data";

  let iconWrapper: HTMLDivElement;
  let moduleIcon: HTMLImageElement = new Image(32, 32);
  let moduleCanvas: HTMLCanvasElement;
  $: moduleCtx = moduleCanvas ? moduleCanvas.getContext("2d") : undefined;
  let imData: ImageData;
  $: imPix = (x: number, y: number, i: number) => imData.data[y * 32 * 4 + x * 4 + i];
  let C: HTMLCanvasElement;
  $: moduleRaw = getCurrentModuleString($iconicData, $selectedModule);

  let parts: Map<string, iconicDataPart> = new Map();

  let selX = -1;
  let selY = -1;
  let mouseX = -1;
  let mouseY = -1;
  let mouseHeld = false;
  let mouseType = "draw";
  let mouseSel = false;

  const borderSize = 4;

  moduleIcon.addEventListener("load", () => {
    moduleCtx.clearRect(0, 0, 32, 32);
    moduleCtx.drawImage(moduleIcon, 0, 0);
    imData = moduleCtx.getImageData(0, 0, 32, 32);
  });

  $: ((x: iconicDataType, y: number) => {
    moduleIcon.crossOrigin = "anonymous";
    let module = x.modules[y];
    if (module == undefined) {
      moduleIcon.src = getIconUrl("../Extra Icons/Misc/blank");
      return;
    }
    moduleIcon.src = getIconUrl(module.key);

    parts.clear();
    let loadParts = x.modules[y].parts;
    let updatePart: boolean = false;
    for (let i = 0; i < loadParts.length; i++) {
      let w = loadParts[i];
      if (!w.char || w.char === "") {
        w.char = getNextPartCharSafe(loadParts);
        updatePart = true;
      }
      parts.set(w.char, w);
    }
    if (updatePart) {
      x.modules[y].parts = loadParts;
      $iconicData = x;
    }
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

            if (r !== " ") {
              if (selChar == r) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(i * s + o, j * s + o, s, s);
              } else {
                ctx.fillStyle = findPartColor(r);
                if (i === 0 || r !== moduleRaw[j * 32 + (i - 1)]) borderLeft(ctx, i * s, j * s, s, s, o);
                if (i === 31 || r !== moduleRaw[j * 32 + (i + 1)]) borderRight(ctx, i * s, j * s, s, s, o);
                if (j === 0 || r !== moduleRaw[(j - 1) * 32 + i]) borderTop(ctx, i * s, j * s, s, s, o);
                if (j === 31 || r !== moduleRaw[(j + 1) * 32 + i]) borderBottom(ctx, i * s, j * s, s, s, o);
              }
            }
          }
        }

        ctx.fillStyle = "green";
        if (mouseSel) {
          let tl = {x: selX, y: selY};
          let br = {x: mouseX, y: mouseY};
          if (br.x < tl.x) [br.x, tl.x] = [tl.x, br.x];
          if (br.y < tl.y) [br.y, tl.y] = [tl.y, br.y];
          borderFull(ctx, tl.x * s, tl.y * s, (br.x - tl.x + 1) * s, (br.y - tl.y + 1) * s, o);
        } else {
          if (mouseX >= 0 && mouseY >= 0 && mouseX < 32 && mouseY < 32) borderFull(ctx, mouseX * s, mouseY * s, s, s, o);
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
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  });

  function borderFull(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: number) {
    borderTop(ctx, x, y, w, h, o);
    borderLeft(ctx, x, y, w, h, o);
    borderRight(ctx, x, y, w, h, o);
    borderBottom(ctx, x, y, w, h, o);
  }

  function borderTop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, _h: number, o: number) {
    ctx.fillRect(x + o, y + o, w, borderSize);
  }

  function borderLeft(ctx: CanvasRenderingContext2D, x: number, y: number, _w: number, h: number, o: number) {
    ctx.fillRect(x + o, y + o, borderSize, h);
  }

  function borderRight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: number) {
    ctx.fillRect(x + w + o - borderSize, y + o, borderSize, h);
  }

  function borderBottom(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, o: number) {
    ctx.fillRect(x + o, y + h + o - borderSize, w, borderSize);
  }

  function canvasMouseMove(ev) {
    let {x, y} = getMouseXY(ev);
    [mouseX, mouseY] = [x, y];
    if (mouseHeld && !mouseSel) replaceModuleRawChar({x, y});
  }

  function canvasMouseDown(ev) {
    let {x, y} = getMouseXY(ev);
    switch (ev.button) {
      case 0:
        mouseType = "draw";
        break;
      case 1:
        $selectedChar = moduleRaw[y * 32 + x];
        return;
      case 2:
        mouseType = "erase";
        break;
      default:
        return;
    }
    [mouseX, mouseY] = [x, y];
    mouseHeld = true;
    if (ev.ctrlKey) {
      mouseSel = true;
      [selX, selY] = [x, y];
    } else {
      replaceModuleRawChar({x, y});
    }
  }

  function canvasMouseUp() {
    mouseHeld = false;
    if (mouseSel) {
      replaceModuleRawChars({x: selX, y: selY}, {x: mouseX, y: mouseY});
      mouseSel = false;
      [selX, selY] = [-1, -1];
    }
  }

  function canvasMouseLeave() {
    mouseHeld = false;
    [mouseX, mouseY] = [-1, -1];
    mouseSel = false;
    [selX, selY] = [-1, -1];
  }

  function canvasKeyChange(ev) {
    if (ev.ctrlKey) {
      mouseSel = true;
      [selX, selY] = [mouseX, mouseY];
    }
  }

  function findPartColor(x: string) {
    if (!parts.has(x)) return "#ffffff";
    let a = parts.get(x).color;
    if (!a || a === "") return getPartColorByChar(x);
    return a;
  }

  function replaceModuleRawChar({x, y}) {
    if (x < 0 || y < 0 || x >= 32 || y >= 32) return;
    moduleRaw = replaceAt(moduleRaw, y * 32 + x, mouseType === "draw" ? $selectedChar : " ");
    iconicData.update(z => {
      if (z.modules[$selectedModule]) z.modules[$selectedModule].raw = moduleRaw;
      return z;
    });
  }

  function replaceModuleRawChars(tl: {x: number; y: number}, br: {x: number; y: number}) {
    if (tl.x < 0 || tl.y < 0 || br.x >= 32 || br.y >= 32) return;
    if (br.x < tl.x) [br.x, tl.x] = [tl.x, br.x];
    if (br.y < tl.y) [br.y, tl.y] = [tl.y, br.y];
    let char = mouseType === "draw" ? $selectedChar : " ";

    let dx = br.x - tl.x;
    for (let y = tl.y; y < br.y + 1; y++) {
      moduleRaw = replaceAt(moduleRaw, y * 32 + tl.x, char.repeat(dx + 1));
    }
    iconicData.update(z => {
      if (z.modules[$selectedModule]) z.modules[$selectedModule].raw = moduleRaw;
      return z;
    });
  }

  function getMouseXY({target, clientX, clientY}) {
    let s = Math.floor(C.clientWidth / 32);
    let oTop = moduleCanvas.offsetTop;
    let oLeft = moduleCanvas.offsetLeft;
    const bbox = target.getBoundingClientRect();
    const layerX = clientX - bbox.left;
    const layerY = clientY - bbox.top;
    let o = Math.floor((C.clientWidth - s * 32) / 2);
    let x = Math.floor((layerX - oTop - o) / s);
    let y = Math.floor((layerY - oLeft - o) / s);
    return {x, y};
  }

  // Used algorithm from: https://stackoverflow.com/a/11868159
  function colorContrast(r: number, g: number, b: number): "black" | "white" {
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
    return brightness > 125 ? "black" : "white";
  }

  // https://stackoverflow.com/a/1431113
  function replaceAt(s: string, index: number, replacement: string): string {
    return s.substring(0, index) + replacement + s.substring(index + replacement.length);
  }
</script>

<div id="icon-wrapper">
  <div id="icon-size" bind:this={iconWrapper}>
    <canvas
      bind:this={C}
      id="icon"
      on:mousemove={canvasMouseMove}
      on:mousedown={canvasMouseDown}
      on:mouseup={canvasMouseUp}
      on:mouseleave={canvasMouseLeave}
      on:contextmenu={ev => ev.preventDefault()}
      on:keydown={canvasKeyChange}
      on:keyup={canvasKeyChange}
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
        image-rendering: pixelated;
      }

      #module-icon-hidden {
        display: none;
        image-rendering: pixelated;
      }
    }
  }
</style>
