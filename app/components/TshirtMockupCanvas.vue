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
  
  const moveOffset = reactive({ x: 0, y: 0 });
  
  const MIN_RESIZE_WIDTH_PX = 20;
  const MIN_RESIZE_HEIGHT_PX = 20;
  const resizeStart = reactive({ x: 0, y: 0, width: 0, height: 0 });
  const resizeHandle = ref('');
  
  const handleCanvasOnPress = (event: MouseEvent) => {
    // console.log(event.offsetX, event.offsetY);
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
        elm.isMoving = true;
        selectedElement.value = elm;
  
        moveOffset.x = mouseX - elm.x;
        moveOffset.y = mouseY - elm.y;
        
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
      if (selectedElement.value.isResizing) return;
      selectedElement.value.isSelected = false;
      selectedElement.value = undefined;
    }
  }
  
  const handleCanvasOnMove = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    if (!selectedElement.value.isMoving) return;
    
    const item = selectedElement.value;
    
    item.x = event.offsetX - moveOffset.x;
    item.y = event.offsetY - moveOffset.y;
    
    // canvasClear(canvasRef.value!);
    imageDraw(
      item.x,
      item.y,
      item.width,
      item.height,
      canvasRef.value!,
      item.imageUrl
    );
  };
  
  const handleOnResizePress = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    
    selectedElement.value.isResizing = true;
    
    const item = selectedElement.value;
    
    const elm = event.target as HTMLButtonElement;
    const handleClass = elm.classList.toString();
    resizeHandle.value = handleClass;
    // console.log('Handle class: ', handleClass);

    resizeStart.x = item.x;
    resizeStart.y = item.y;
    resizeStart.width = item.width;
    resizeStart.height = item.height;
  };
  
  const handleOnResizeImage = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    if (!selectedElement.value.isResizing) return;
    
    let x = resizeStart.x;
    let y = resizeStart.y;
    let width = resizeStart.width;
    let height = resizeStart.height;
    
    const right = x + width;
    const bottom = y + height;
    
    const mouseX = event.clientX - canvasLeft.value;
    const mouseY = event.clientY - canvasTop.value;
    
    if (resizeHandle.value.includes('top')) {
      y = Math.min(mouseY, bottom - MIN_RESIZE_HEIGHT_PX);
      height = Math.max(MIN_RESIZE_HEIGHT_PX, bottom - mouseY);
    }

    if (resizeHandle.value.includes('bottom')) {
      height = Math.max(MIN_RESIZE_HEIGHT_PX, mouseY - y);
    }
    
    if (resizeHandle.value.includes('left')) {
      x = Math.min(mouseX, right - MIN_RESIZE_WIDTH_PX);
      width = Math.max(MIN_RESIZE_WIDTH_PX, right - mouseX);
    }

    if (resizeHandle.value.includes('right')) {
      width = Math.max(MIN_RESIZE_WIDTH_PX, mouseX - x);
    }
    
    // Top Left (x, y, w, h)
    // Top Right (y, w, h)
    
    const item = selectedElement.value;

    item.x = x;
    item.y = y;
    item.width = width;
    item.height = height;

    imageDraw(
      item.x,
      item.y,
      item.width,
      item.height,
      canvasRef.value!,
      item.imageUrl
    );
  };
  
  const handleOnMouseRelease = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    selectedElement.value.isMoving = false;
    selectedElement.value.isResizing = false;
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
    document.addEventListener('mousemove', handleOnResizeImage);
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
      :handleOnResizePress="handleOnResizePress"
    />
  </CanvasImageItem>
  
</template>