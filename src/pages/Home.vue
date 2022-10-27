<script setup>
import pako from 'pako'
import { useRoute, useRouter } from 'vue-router'
import Wordcloud from '../components/Wordcloud.vue';
import { watch, ref, computed, watchEffect } from 'vue'
import { toKhmer } from 'khmernumber'
import { isKhmer } from 'is-khmer'
import { Base64 } from 'js-base64'

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const router = useRouter();
const route = useRoute()
const scaleRef = ref(parseInt(route.query.s, 16) || 8);
const weightRef = ref(parseInt(route.query.w, 16) || 500);
const text = ref(decodeAndInflate())
const intl = new Intl.Segmenter('km', { granularity: 'word' });

const segments = computed(
  () => [...intl.segment(text.value)]
    .filter(it => it.isWordLike)
    .map(it => it.segment)
)

const segmentsCount = computed(() => {
  const map = new Map();
  for (const seg of segments.value) {
    if (!isKhmer(seg)) {
      continue;
    }
    if (map.has(seg)) map.set(seg, map.get(seg) + 1);
    else map.set(seg, 1)
  }
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return entries
});


function decodeAndInflate() {
  if (route.query.data) {
    try {
      const bytes = pako.inflate(Base64.toUint8Array(route.query.data));
      return textDecoder.decode(bytes);
    } catch (e) {
      console.error('failed to decode');
      console.error(e);
    }
  }
  return '';
}

watch(text, async () => {
  const value = text.value.trim();
  const bytes = textEncoder.encode(value);
  const compressedBase64 = Base64.fromUint8Array(pako.deflate(bytes));
  await router.replace({
    query: {
      ...route.query,
      data: compressedBase64,
    },
  });
})

watch(scaleRef, async () => {
  router.replace({ 
    query: {
      ...route.query,
      s: new Number(scaleRef.value).toString(16)
    }
  })
});

watch(weightRef, async () => {
  router.replace({ 
    query: {
      ...route.query,
      w: new Number(weightRef.value).toString(16)
    }
  })
});


</script>

<template>
  <div class="container">
    <h1>ក្រុម​ពាក្យ​ខ្មែរ</h1>
    <p>ចែកពាក្យខ្មែរជាក្រុមៗ</p>
    <div class="slate-card">
      <div class="slate-column">
        <textarea placeholder="សូមវាយអ្វីមួយ" class="slate-textarea" v-model="text" rows="10"></textarea>
      </div>
    </div>


    <h2 v-if="segmentsCount.length">ពពកពាក្យ</h2>

    <div class="slate-column" v-if="segmentsCount.length">
      <label for="scale">មាត្រដ្ឋាន <strong>{{ scaleRef }}</strong></label>
      <input id="scale" name="scale" v-model="scaleRef" min="1" max="30" type="range" style="accent-color: slateblue;">
      <br>
      <label for="weight">កម្រាស់អក្សរ <strong>{{ weightRef }}</strong></label>
      <input id="weight" name="weight" v-model="weightRef" min="300" max="800" type="range"
        style="accent-color: slateblue;">
    </div>

    <div v-if="segmentsCount.length">
      <Wordcloud :weight="weightRef" :scale="scaleRef" :values="segmentsCount" />
    </div>



    <h3>ចំនួនដងនៃពាក្យ</h3>
    <div v-if="segmentsCount.length" class="slate-card">
      <ul class="slate-ul">
        <li v-for="(item, index) in segmentsCount" :key="index">
          <span class="slate-key">{{ toKhmer((index + 1).toString()) }}</span>
          <span>{{ item[0] }}</span>
          <span class="slate-counter">{{ toKhmer(item[1].toString()) }}</span>
        </li>
      </ul>
    </div>
    <div v-else class="slate-card">
      <p class="slate-info">សូមវាយអ្វីមួយ</p>
    </div>
  </div>
</template>
