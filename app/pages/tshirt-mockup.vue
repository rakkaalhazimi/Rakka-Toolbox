<script setup lang="ts">
import { useElementBounding } from '@vueuse/core';

const canvasRefName = 'base-canvas';
const canvasRef = useTemplateRef<HTMLCanvasElement>(canvasRefName);
const { x: canvasX, y: canvasY, left: canvasLeft, top: canvasTop } = useElementBounding(canvasRef);

const buttonSizePx = 8;
const buttonOffsetPx = buttonSizePx / 2;

const isDragging = ref(false);
const isSelected = ref(false);
const isResizing = ref(false);

const dragOffsetX = ref(0);
const dragOffsetY = ref(0);

const imageInitWidth = ref(0);
const imageInitHeight = ref(0);
const imageRatio = ref(1);
const resizePivotX = ref(0);
const resizePivotY = ref(0);

const selectionTop = ref(0);
const selectionLeft = ref(0);

const imageState = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

const handleOnDrawImage = () => {
  const canvas = canvasRef.value!;
  const ctx = canvas.getContext('2d')!;

  const image = document.getElementById('test-image') as HTMLImageElement;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    imageState.x,
    imageState.y,
    imageState.width,
    imageState.height
  );
};

const handleCanvasOnPress = (event: MouseEvent) => {
  // console.log(event.offsetX, event.offsetY);
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  const isMouseOnTheImage = (
    mouseX >= imageState.x 
    && mouseX <= imageState.x + imageState.width
    && mouseY >= imageState.y
    && mouseY <= imageState.y + imageState.height
  );

  if (isMouseOnTheImage) {
    isDragging.value = true;
    isSelected.value = true;

    dragOffsetX.value = mouseX - imageState.x;
    dragOffsetY.value = mouseY - imageState.y;
    

  } else {
    isSelected.value = false;
  }
  
};

const handleCanvasOnRelease = () => {
  isDragging.value = false;
};

const handleCanvasOnMove = (event: MouseEvent) => {
  if (isDragging.value) {
    imageState.x = event.offsetX - dragOffsetX.value;
    imageState.y = event.offsetY - dragOffsetY.value;

    handleOnDrawImage();
  }
};

const handleOnResizePress = (event: MouseEvent) => {
  isResizing.value = true;
  console.log('Initial coordinates: ');
  console.log(event.clientX - canvasLeft.value, event.clientY - canvasTop.value);
  
  resizePivotX.value = event.clientX;
  resizePivotY.value = event.clientY;
  imageInitWidth.value = imageState.width;
  imageInitHeight.value = imageState.height;

  imageRatio.value = imageInitWidth.value / imageInitHeight.value;
};

const handleOnResizeRelease = () => {
  isResizing.value = false;
};

const handleOnResizeImage = (event: MouseEvent) => {
  if (isResizing.value) {
    const widthChange = imageInitWidth.value + (resizePivotX.value - event.clientX);
    const heightChange = imageInitHeight.value + (resizePivotY.value - event.clientY);
    // console.log(widthChange, heightChange);

    if (widthChange > 0) {
      imageState.width = Math.max(widthChange, 40);
    };
    if (heightChange > 0) {
      imageState.height = Math.max(heightChange, 40);
    };
    imageState.x = event.clientX - canvasLeft.value;
    imageState.y = event.clientY - canvasTop.value;

    handleOnDrawImage();
  }
};

onMounted(() => {
  document.addEventListener('mouseup', handleOnResizeRelease);
  // document.addEventListener('mouseup', handleCanvasOnRelease);

  document.addEventListener('mousemove', handleOnResizeImage);

  const image = document.getElementById('test-image') as HTMLImageElement;
  imageState.width = image.width;
  imageState.height = image.height;
});

</script>

<template>
<div>
  <UPageSection
    id="tshirt-mockup"
    title="T-shirt Mockup"
    description="What T-shirt are you gonna make today?"
    :ui="{
      container: 'sm:gap-10',
    }"
  >
    <UContainer>
      
      <UButton variant="outline" class="cursor-pointer" @click="handleOnDrawImage">
        Draw
      </UButton>

      <img id="test-image" src="assets/logo/python.png" alt="python-logo">

      <div>
        <canvas 
          :ref="canvasRefName" 
          width="500" 
          height="600"
          class="mx-auto border"
          @mousedown="handleCanvasOnPress"
          @mousemove="handleCanvasOnMove"
          @mouseup="handleCanvasOnRelease"
        >
        </canvas>

        <div
          v-if="isSelected"
          class="fixed w-5 h-5 border-2 border-primary pointer-events-none"
          :style="{
            top: `${canvasY + imageState.y}px`, 
            left: `${canvasX + imageState.x}px`,
            width: `${imageState.width}px`,
            height: `${imageState.height}px`,
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
              left: `${(imageState.width / 2) - buttonOffsetPx}px`,
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle top-right absolute bg-black border border-black cursor-nesw-resize pointer-events-auto" 
            :style="{
              top: `-${buttonOffsetPx}px`, 
              right: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle left absolute bg-black border border-black cursor-ew-resize pointer-events-auto" 
            :style="{
              top: `${(imageState.height / 2) - buttonOffsetPx}px`, 
              left: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle right absolute bg-black border border-black cursor-ew-resize pointer-events-auto" 
            :style="{
              top: `${(imageState.height / 2) - buttonOffsetPx}px`, 
              right: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle bottom-left absolute bg-black border border-black cursor-nesw-resize pointer-events-auto" 
            :style="{
              bottom: `-${buttonOffsetPx}px`, 
              left: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle bottom absolute bg-black border border-black cursor-ns-resize pointer-events-auto" 
            :style="{
              bottom: `-${buttonOffsetPx}px`, 
              left: `${(imageState.width / 2) - buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
          <button 
            class="handle bottom-right absolute bg-black border border-black cursor-nwse-resize pointer-events-auto" 
            :style="{
              bottom: `-${buttonOffsetPx}px`, 
              right: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
          />
        </div>
      </div>

      
    </UContainer>
  </UPageSection>
</div>
</template>
