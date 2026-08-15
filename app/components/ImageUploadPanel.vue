<script lang="ts" setup>
  import type { FormSubmitEvent } from '@nuxt/ui';
  import type { Image } from '~/types/Image';
  
  const props = defineProps<{
    images: Image[]
  }>();

  const hasUpload = ref(false);

  const state = reactive({
    image: ref<File>(),
  });
  
  const handleOnChange = () => {
    if (!state.image) return;
    hasUpload.value = true;
  };
  
  const handleOnSubmit = (event: FormSubmitEvent<any>) => {
    if (!state.image) return;
    
    const blob = new Blob([state.image], { type: state.image.type });
    const url = URL.createObjectURL(blob);
    props.images.push({ url });
    
    state.image = undefined;
    hasUpload.value = false;
  };
</script>

<template>
<div class="w-full h-full overflow-scroll">
  
  <UForm :state="state" class="flex flex-col gap-y-2 mb-8" @submit="handleOnSubmit">
    <UFileUpload
      name="images"
      variant="area" 
      layout="list"
      file-icon="i-lucide-file-audio"
      accept="image/*"
      :ui="{ base: 'bg-elevated hover:bg-primary-200' }"
      v-model="state.image"
      @change="handleOnChange"
    />
    <UButton 
      type="submit" 
      class="w-full justify-center" 
      :disabled="!hasUpload"
    >
      Upload
    </UButton>
  </UForm>
  
  <div class="flex flex-col gap-y-2">
    <img v-for="img in props.images" :key="img.url" :src="img.url" />
  </div>
</div>
</template>