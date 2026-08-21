<script lang="ts" setup>
  import { useElementBounding } from '@vueuse/core';
  
  import tshirtImageUrl from '~/assets/tshirt/white.png';
  import { CanvasItem, createCanvasImageItem, createCanvasShapeItem } from '~/types/canvas';

  
  const props = defineProps<{
    refName: string;
    width: number;
    height: number;
    tshirtHexColor: string;
  }>();

  const elements = ref<CanvasItem[]>([]);
  const selectedElement = ref<CanvasItem>();
  const tshirtElement = ref<CanvasItem>();
  const backgroundElement = ref<CanvasItem>();
    
  const canvasRef = useTemplateRef<HTMLCanvasElement>(props.refName);
  const { left: canvasLeft, top: canvasTop, update: updateCanvasRect } = useElementBounding(canvasRef);
  
  const moveOffset = reactive({ x: 0, y: 0 });
  
  const MIN_RESIZE_WIDTH_PX = 20;
  const MIN_RESIZE_HEIGHT_PX = 20;
  const resizeStart = reactive({ x: 0, y: 0, width: 0, height: 0 });
  const resizeHandle = ref('');
  
  
  const handleDrawSingleImage = (element: CanvasItem) => {
    imageDraw(
      element.x, 
      element.y, 
      element.width, 
      element.height, 
      canvasRef.value!, 
      element.image,
    );
  };
  
  const handleDrawTshirtImage = (element: CanvasItem) => {
    handleDrawSingleImage(element);
    imageColorize(
      element.x, 
      element.y, 
      element.width, 
      element.height,
      props.tshirtHexColor,
      canvasRef.value!,
    );
  };
  
  const handleDrawResizedImage = (element: CanvasItem) => {
    const resized = imageResize(element.width, element.height, element.image);
    imageDraw(
      element.x, 
      element.y, 
      element.width, 
      element.height, 
      canvasRef.value!, 
      resized
    );
  };
  
  const handleDrawShape = (element: CanvasItem) => {
    shapeRectDraw(
      element.x, 
      element.y, 
      element.width, 
      element.height,
      element.color,
      canvasRef.value!
    );
  }
  
  const handleRenderElements = async (elements: CanvasItem[]) => {
    canvasClear(canvasRef.value!);
    
    if (backgroundElement.value) {
      // handleDrawShape(backgroundElement.value);
    }
    
    if (tshirtElement.value) {
      handleDrawTshirtImage(tshirtElement.value);
    }
    
    for (const elm of elements) {
      handleDrawSingleImage(elm);
    }
  };
  
  
  // TODO: 
  // - Prioritize select for earliest element [ v ] 
  // - Another element select means the other is unselected [ v ]
  // - Draw T-shirt image on canvas but dont lump it with other element
  const handleCanvasOnPress = (event: MouseEvent) => {
    // console.log(event.offsetX, event.offsetY);
    const mouseX = event.clientX - canvasLeft.value;
    const mouseY = event.clientY - canvasTop.value;
    
    let prevElement: CanvasItem | undefined = undefined;
    
    for (const elm of elements.value) {
      const isMouseOnTheImage = (
        mouseX >= elm.x
        && mouseX <= elm.x + elm.width
        && mouseY >= elm.y
        && mouseY <= elm.y + elm.height
      );
      
      if (isMouseOnTheImage) {
        elm.isSelected = true;
        elm.isMoving = true;
        selectedElement.value = elm;
  
        moveOffset.x = mouseX - elm.x;
        moveOffset.y = mouseY - elm.y;
        
        if (prevElement) {
          prevElement.isSelected = false;
        }
        
      } else {
        elm.isSelected = false;
      }
      
      prevElement = elm;
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
    
    const mouseX = event.clientX - canvasLeft.value;
    const mouseY = event.clientY - canvasTop.value;
    
    item.x = mouseX - moveOffset.x;
    item.y = mouseY - moveOffset.y;
    
    handleRenderElements(elements.value);
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
    
    handleRenderElements(elements.value);
  };
  
  const handleOnMouseRelease = (event: MouseEvent) => {
    if (!selectedElement.value) return;
    selectedElement.value.isMoving = false;
    selectedElement.value.isResizing = false;
  };

  const handleOnDrop = async (event: DragEvent) => {
    if (!event.dataTransfer) return;
    
    // Update canvas bounding rectangle
    updateCanvasRect();
    
    const url = event.dataTransfer.getData('text');
    // console.log('Data transferred: ', event.dataTransfer.getData('text'));

    const { width, height } = imageSize(url);
    const imgItem = await createCanvasImageItem({width, height, imageUrl: url});
    // Current selection will be cancelled when user drags another image.
    // I'll let it like this for a moment.
    imgItem.isSelected = true;
    elements.value.push(imgItem);
    
    handleRenderElements(elements.value);
  };
  
  const handleOnDeleteElement = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === 'Delete') {
      if (!selectedElement.value) return;
      const selected = selectedElement.value;
      elements.value = elements.value.filter(item => item.id !== selected.id);
      handleRenderElements(elements.value);
      selectedElement.value = undefined;
    }
  };

  
  onMounted(async () => {
    document.addEventListener('mousedown', handleOutsideOnPress);
    document.addEventListener('mouseup', handleOnMouseRelease);
    document.addEventListener('mousemove', handleOnResizeImage);
    document.addEventListener('keydown', handleOnDeleteElement);
    
    // TShirt Image
    // console.log('Tshirt: ', tshirtImage);
    const { width: tshirtWidth, height: tshirtHeight } = imageSize(tshirtImageUrl);
    const height = imageHeightFromRatio(tshirtWidth, tshirtHeight, props.height);
    tshirtElement.value = await createCanvasImageItem({width: props.width, height, imageUrl: tshirtImageUrl});
    handleDrawTshirtImage(tshirtElement.value);
    
    // Background
    const tshirtColor = props.tshirtHexColor ?? '#ffffff';
    backgroundElement.value = createCanvasShapeItem({
      width: props.width, 
      height: props.height, 
      color: tshirtColor, 
    });
    // handleDrawShape(backgroundElement.value);
  });
  
  watch(() => props.tshirtHexColor, (newColor: string) => {
    if (!backgroundElement.value) return;
    backgroundElement.value.color = newColor;
    
    handleRenderElements(elements.value);
  });

</script>


<template>
  
  <!-- {{ selectedElement }} -->
  
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