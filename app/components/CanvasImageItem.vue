<script lang="ts" setup>
  // const props = defineProps<{
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  // }>();

  // const isSelected = ref(true);


</script>


<template>
  <!-- <ResizeBox 
    :imageX="props.x" 
    :imageY="props.y"
    :imageWidth="props.width"
    :imageHeight="props.height"
    :isSelected="isSelected"
  /> -->
  <slot></slot>
</template>