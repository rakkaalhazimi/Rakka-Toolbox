<script lang="ts" setup>
  import { useElementBounding, useElementSize } from '@vueuse/core';
  import { type CanvasItem, createCanvasImageItem } from '~/types/canvas';


  const props = defineProps<{
    refName: string;
    width: number;
    height: number;
  }>();

  const elements = ref<CanvasItem[]>([]);
  const selectedElement = ref<CanvasItem>();
  const canvasRef = useTemplateRef<HTMLCanvasElement>(props.refName);
  const { left: canvasLeft, top: canvasTop } = useElementBounding(canvasRef);
  
  const dragOffset = reactive({ x: 0, y: 0 });
  

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
        elm.isDragging = true;
        selectedElement.value = elm;
  
        dragOffset.x = mouseX - elm.x;
        dragOffset.y = mouseY - elm.y;
        
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
  
  const handleCanvasOnMove = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    if (!selectedElement.value.isDragging) return;
    
    selectedElement.value.x = event.offsetX - dragOffset.x;
    selectedElement.value.y = event.offsetY - dragOffset.y;
    
    // canvasClear(canvasRef.value!);
    imageDraw(
      selectedElement.value.x,
      selectedElement.value.y,
      selectedElement.value.width,
      selectedElement.value.height,
      canvasRef.value!,
      selectedElement.value.imageUrl!
    );
  };
  
  const handleOnMouseRelease = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    selectedElement.value.isDragging = false;
  };

  const handleOnDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    const url = event.dataTransfer.getData('text');
    // console.log('Data transferred: ', event.dataTransfer.getData('text'));

    const { width, height } = imageSize(url);
    const imgItem = createCanvasImageItem({id: '', width, height, imageUrl: url});
    elements.value.push(imgItem);
    
    imageDraw(
      imgItem.x, 
      imgItem.y, 
      imgItem.width, 
      imgItem.height, 
      canvasRef.value!, 
      imgItem.imageUrl!
    );
  };

  
  onMounted(() => {
    document.addEventListener('mousedown', handleOutsideOnPress);
    document.addEventListener('mouseup', handleOnMouseRelease);
  });

</script>


<template>
  
  <canvas
    :ref="props.refName"
    :width="props.width" 
    :height="props.height" 
    class="border bg-white"
    @mousemove="handleCanvasOnMove"
    @dragover.prevent
    @drop.prevent
    @drop="handleOnDrop"
  >
  </canvas>
  
  <CanvasImageItem v-for="img in elements" :key="img.id">
    <ResizeBox 
      :imageX="canvasLeft + img.x" 
      :imageY="canvasTop + img.y"
      :imageWidth="img.width"
      :imageHeight="img.height"
      :isSelected="img.isSelected"
    />
  </CanvasImageItem>
  
</template>