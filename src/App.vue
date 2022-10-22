<script setup>
import { ref, computed } from 'vue'
import { toKhmer } from 'khmernumber'
import { isKhmer } from 'is-khmer'

const text = ref("")
const intl = new Intl.Segmenter(undefined, { granularity: 'word' });
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

    <h2>លទ្ធផល</h2>
    <div v-if="segmentsCount.length" class="slate-card">
      <ul class="slate-ul">
        <li v-for="(item, index) in segmentsCount" :key="index">
          <span class="slate-key">{{toKhmer((index + 1).toString())}}</span>
          <span>{{item[0]}}</span>
          <span class="slate-counter">{{toKhmer(item[1].toString())}}</span>
        </li>
      </ul>
    </div>
    <div v-else class="slate-card">
      <p class="slate-info">សូមវាយអ្វីមួយ</p>
    </div>

  </div>
</template>
