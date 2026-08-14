<script setup lang="ts">
const props = defineProps<{
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
  isSelected: boolean;
  handleOnResizePress?: (event: MouseEvent) => void;
}>();

const buttonSizePx = 8;
const buttonOffsetPx = buttonSizePx / 2;


</script>

<template>
  <div
    v-if="props.isSelected"
    class="fixed w-5 h-5 border-2 border-primary pointer-events-none"
    :style="{
      top: `${props.imageY}px`, 
      left: `${props.imageX}px`,
      width: `${props.imageWidth}px`,
      height: `${props.imageHeight}px`,
    }"
  >
    <button 
      class="handle top-left absolute bg-black border border-black cursor-nwse-resize pointer-events-auto" 
      :style="{
        top: `-${buttonOffsetPx}px`, 
        left: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle top absolute bg-black border border-black cursor-ns-resize pointer-events-auto" 
      :style="{
        top: `-${buttonOffsetPx}px`, 
        left: `${(props.imageWidth / 2) - buttonOffsetPx}px`,
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle top-right absolute bg-black border border-black cursor-nesw-resize pointer-events-auto" 
      :style="{
        top: `-${buttonOffsetPx}px`, 
        right: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle left absolute bg-black border border-black cursor-ew-resize pointer-events-auto" 
      :style="{
        top: `${(props.imageHeight / 2) - buttonOffsetPx}px`, 
        left: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle right absolute bg-black border border-black cursor-ew-resize pointer-events-auto" 
      :style="{
        top: `${(props.imageHeight / 2) - buttonOffsetPx}px`, 
        right: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle bottom-left absolute bg-black border border-black cursor-nesw-resize pointer-events-auto" 
      :style="{
        bottom: `-${buttonOffsetPx}px`, 
        left: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle bottom absolute bg-black border border-black cursor-ns-resize pointer-events-auto" 
      :style="{
        bottom: `-${buttonOffsetPx}px`, 
        left: `${(props.imageWidth / 2) - buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
    <button 
      class="handle bottom-right absolute bg-black border border-black cursor-nwse-resize pointer-events-auto" 
      :style="{
        bottom: `-${buttonOffsetPx}px`, 
        right: `-${buttonOffsetPx}px`, 
        width: `${buttonSizePx}px`, 
        height: `${buttonSizePx}px`,
      }"
      @mousedown="handleOnResizePress"
    />
  </div>
</template>
