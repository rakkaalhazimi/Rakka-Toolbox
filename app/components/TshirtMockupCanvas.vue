<script lang="ts" setup>
  import { useElementBounding, useElementSize } from '@vueuse/core';
  import { ElementType, type CanvasElement } from '~/types/canvas';


  const props = defineProps<{
    refName: string;
    width: number;
    height: number;
  }>();

  const elements = ref<CanvasElement[]>([]);
  const selectedElement = ref<CanvasElement>();
  const canvasRef = useTemplateRef<HTMLCanvasElement>(props.refName);
  const { left: canvasLeft, top: canvasTop } = useElementBounding(canvasRef);
  

  const handleCanvasOnPress = (event: MouseEvent) => {
    console.log(event.offsetX, event.offsetY);
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    
    for (const elm of elements.value) {
      const isMouseOnTheImage = (
        mouseX >= elm.x
        && mouseX <= elm.x + elm.width
        && mouseY >= elm.y
        && mouseY <= elm.y + elm.height
      );
      
      if (isMouseOnTheImage) {
        // isDragging.value = true;
        // isSelected.value = true;
        elm.isSelected = true;
        selectedElement.value = elm;
  
        // dragOffsetX.value = mouseX - imageState.x;
        // dragOffsetY.value = mouseY - imageState.y;
      } else {
        elm.isSelected = false;
        if (selectedElement.value?.id === elm.id) {
          selectedElement.value = undefined;
        }
      }
    }

  };
  
  const handleOutsideOnPress = (event: MouseEvent) => {
    if (event.target === canvasRef.value) {
      handleCanvasOnPress(event);
    } else {
      if (!selectedElement.value) return;
      selectedElement.value.isSelected = false;
      selectedElement.value = undefined;
    }
  }

  const handleOnDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    const url = event.dataTransfer.getData('text');
    // console.log('Data transferred: ', event.dataTransfer.getData('text'));

    const state = imageDraw(canvasRef.value!, url);
    elements.value.push({
      id: url,
      type: ElementType.IMAGE,
      x: 0,
      y: 0,
      width: state.width,
      height: state.height,
      isSelected: false,
      imageUrl: url,
    });
  };

  
  onMounted(() => {
    document.addEventListener('mousedown', handleOutsideOnPress);
  });

</script>


<template>
  
  <canvas
    :ref="props.refName"
    :width="props.width" 
    :height="props.height" 
    class="border bg-white"
    @dragover.prevent
    @drop.prevent
    @drop="handleOnDrop"
  >
  </canvas>
  
  <CanvasImageElement v-for="img in elements" :key="img.id">
    <ResizeBox 
      :imageX="canvasLeft + img.x" 
      :imageY="canvasTop + img.y"
      :imageWidth="img.width"
      :imageHeight="img.height"
      :isSelected="img.isSelected"
    />
  </CanvasImageElement>
  
</template>