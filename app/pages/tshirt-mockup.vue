<script setup lang="ts">
const canvasRefName = 'base-canvas';

</script>

<template>

<div class="relative flex">
  
  <TshirtMockupSide />

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
      <div class="flex flex-col items-center">
        <TshirtMockupCanvas 
          :refName="canvasRefName" 
          :width="500" 
          :height="600" 
        />
      </div>
    </UContainer>

  </UPageSection>
</div>
</template>
