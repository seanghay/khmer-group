<script setup>
import { ref, onMounted, watch } from 'vue';
import wordcloud from './wordcloud.js'

// definitions
const boardRef = ref(null);

// configuration
const props = defineProps(['weight', 'values', 'scale']);

// hooks

onMounted(() => {
  /**
   * @type {HTMLCanvasElement}
   */
  const parent = boardRef.value.parentNode;
  const resizeObserver = new ResizeObserver(redraw);
  resizeObserver.observe(parent);
})

watch(props, () => {
  redraw();
})


// methods
function redraw() {
  if (!boardRef.value) return;
  const canvas = boardRef.value;
  const ctx = canvas.getContext('2d');

  const width = boardRef.value.parentNode.clientWidth;
  const height = width / (4 / 3);

  // configure canvas size
  canvas.width = Math.round(width * devicePixelRatio);
  canvas.height = Math.round(height * devicePixelRatio);
  canvas.style.width = width + "px"
  canvas.style.height = height + "px"
  ctx.scale(devicePixelRatio, devicePixelRatio);
  draw(ctx, canvas, width, height);
}


function draw(ctx, canvas, width, height) {

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000';

  wordcloud(canvas, {
    list: props.values,
    weightFactor(size) {
      return size * parseFloat(props.scale);
    },
    fontWeight: props.weight,
    // color: 'slateblue',
    size: { width, height },
    fontFamily: "Kantumruy Pro"
  });
}

function download() {
  console.log('download')
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = boardRef.value;
  canvas.toBlob((blob) => {
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `khmer-group-${new Date().toLocaleDateString()}.png`
    anchor.click()
  }, "image/png", 1)
}

</script>

<template>
  <button @click="download" class="slate-button slate-gap-x-1">ទាញយក</button>
  <div class="slate-card slate-gap-x-1"> 
    <canvas class="board" ref="boardRef"></canvas>
  </div>
</template>

<style lang="scss">
.board {}
</style>