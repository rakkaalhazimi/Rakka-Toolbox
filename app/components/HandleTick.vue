<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
  width: number;
  height: number;
};
const props = defineProps<Props>();

</script>

<template>
<button 
  class="triangle"
  :style="{
    width: `${props.width}px`,
    height: `${props.height}px`,
  }"
></button>

</template>

<style>
.triangle {
  aspect-ratio: 1/cos(30deg);
  clip-path: polygon(50% 100%,100% 0,0 0);
}
</style>
