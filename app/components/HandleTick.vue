<script setup lang="ts">
const props = defineProps<{
  width: number;
  height: number;
}>();

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
