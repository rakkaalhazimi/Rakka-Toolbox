<script setup lang="ts">
import { type TShirtColor, TSHIRT_COLOR_CHOICES } from '~/types/color';


const frontTshirtImageUrl = '/tshirt/white.png';
const backTshirtImageUrl = '/tshirt/white-back.png';

const canvasRefName = 'base-canvas';
const tshirtColor = ref<TShirtColor>(TSHIRT_COLOR_CHOICES.WHITE);


const handleTshirtColorChange = (color: TShirtColor) => {
  tshirtColor.value = color;
  // console.log('[Page] Color changed to: ', color);
};

const handleSkinColorChange = () => {
  
};

</script>

<template>

<div class="relative flex">
  
  <TshirtMockupSide :handleTshirtColorChange="handleTshirtColorChange" />

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
      <div class="flex flex-row items-center">
        <TshirtMockupCanvas 
          :refName="canvasRefName" 
          :width="500" 
          :height="600"
          :tshirtImageUrl="frontTshirtImageUrl"
          :tshirtHexColor="tshirtColor.hex"
        />
        <TshirtMockupCanvas 
          :refName="canvasRefName" 
          :width="500" 
          :height="600"
          :tshirtImageUrl="backTshirtImageUrl"
          :tshirtHexColor="tshirtColor.hex"
        />
      </div>
    </UContainer>

  </UPageSection>
</div>
</template>
