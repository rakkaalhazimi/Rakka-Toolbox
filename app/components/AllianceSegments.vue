<script lang="ts" setup>

  const props = defineProps<{
    segments: number;
    completed: number;
    imageUrl?: string;
  }>();

  const segments = props.segments;
  const completed = props.completed;
  const gap = 6;
  const paddingPx = 4.5;
  const sizePx = 45;
  const filledColor = '#42AC98';
  const emptyColor = '#71717a';

  const segmentBackground = computed(() => {
    const segmentSize = 360 / segments;
    const visibleSize = segmentSize - gap;

    const colors = [];

    for (let i = 0; i < segments; i++) {
      const start = i * segmentSize;
      const end = start + visibleSize;

      const color = i < completed
        ? filledColor
        : emptyColor;

      colors.push(
        `${color} ${start}deg ${end}deg`,
        `transparent ${end}deg ${start + segmentSize}deg`
      );
    }

    return `conic-gradient(${colors.join(', ')})`;
  });
</script>


<template>
<div 
  class="relative" 
  :style="{ 
    width: `${sizePx}px`, 
    height: `${sizePx}px` 
  }"
>
  <img
    :src="props.imageUrl"
    class="absolute rounded-full bg-red-400"
    :style="{ 
      top: `${paddingPx}px`,
      left: `${paddingPx}px`,
      width: `${sizePx - paddingPx * 2}px`, 
      height: `${sizePx - paddingPx * 2}px`
    }"
  ></img>
  
  <div 
    class="arc absolute"
    :style="{ 
      width: `${sizePx}px`, 
      height: `${sizePx}px`,
      background: segmentBackground,
      padding: `${paddingPx}px`,
    }">
  </div>
</div>
</template>


<style>
  .arc {
    aspect-ratio: 1;
    box-sizing: border-box;
    border-radius: 50%;

    mask:
      linear-gradient(#0000 0 0) content-box intersect,
      linear-gradient(#000 0 0);
  }
</style>