<script setup lang="ts">
import { useElementBounding } from '@vueuse/core';

const canvasRefName = 'base-canvas';
const canvasRef = useTemplateRef<HTMLCanvasElement>(canvasRefName);
const { x: canvasX, y: canvasY, left: canvasLeft, top: canvasTop } = useElementBounding(canvasRef);

const MIN_WIDTH_PX = 20;
const MIN_HEIGHT_PX = 20;

const buttonSizePx = 8;
const buttonOffsetPx = buttonSizePx / 2;

const isDragging = ref(false);
const isSelected = ref(false);
const isResizing = ref(false);

const dragOffsetX = ref(0);
const dragOffsetY = ref(0);

const handle = ref('');

const imageState = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

const start = reactive({
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
  const elm = event.target as HTMLButtonElement;
  const handleClass = elm.classList.toString();
  handle.value = handleClass;

  start.x = imageState.x;
  start.y = imageState.y;
  start.width = imageState.width;
  start.height = imageState.height;
};

const handleOnResizeRelease = () => {
  isResizing.value = false;
};

const handleOnResizeImage = (event: MouseEvent) => {
  if (!isResizing.value) return;
  // I need to make our image starting coordinate glide with the cursor on resize.
  // for top left, just use the offset coordinate of our mouse in canvas.
  // For top handle, we only need to resize vertically, so we dont change the x coordinate.
  let x = start.x;
  let y = start.y;
  let width = start.width;
  let height = start.height;
  
  const right = x + width;
  const bottom = y + height;
  
  const mouseX = event.clientX - canvasLeft.value;
  const mouseY = event.clientY - canvasTop.value;
  
  if (handle.value.includes('top')) {
    y = Math.min(mouseY, bottom - MIN_HEIGHT_PX);
    height = Math.max(MIN_HEIGHT_PX, bottom - mouseY);
  }

  if (handle.value.includes('bottom')) {
    height = Math.max(MIN_HEIGHT_PX, mouseY - y);
  }
  
  if (handle.value.includes('left')) {
    x = Math.min(mouseX, right - MIN_WIDTH_PX);
    width = Math.max(MIN_WIDTH_PX, right - mouseX);
  }

  if (handle.value.includes('right')) {
    width = Math.max(MIN_WIDTH_PX, mouseX - x);
  }
  
  // Top Left (x, y, w, h)
  // Top Right (y, w, h)

  imageState.x = x;
  imageState.y = y;
  imageState.width = width;
  imageState.height = height;

  handleOnDrawImage();
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
    class="w-full bg-elevated"
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
          class="border bg-white"
          @mousedown="handleCanvasOnPress"
          @mousemove="handleCanvasOnMove"
          @mouseup="handleCanvasOnRelease"
        >
        </canvas>

        <ResizeBox 
          :imageX="canvasX + imageState.x" 
          :imageY="canvasY + imageState.y"
          :imageWidth="imageState.width"
          :imageHeight="imageState.height"
          :isSelected="isSelected"
          :handleOnResizePress="handleOnResizePress"
        />

        <!-- <div
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
              top: `${(imageState.height / 2) - buttonOffsetPx}px`, 
              left: `-${buttonOffsetPx}px`, 
              width: `${buttonSizePx}px`, 
              height: `${buttonSizePx}px`,
            }"
            @mousedown="handleOnResizePress"
          />
          <button 
            class="handle right absolute bg-black border border-black cursor-ew-resize pointer-events-auto" 
            :style="{
              top: `${(imageState.height / 2) - buttonOffsetPx}px`, 
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
              left: `${(imageState.width / 2) - buttonOffsetPx}px`, 
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
        </div> -->
      </div>

      
    </UContainer>
  </UPageSection>
</div>
</template>
