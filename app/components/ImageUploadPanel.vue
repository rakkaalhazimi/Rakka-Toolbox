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
<div class="w-full h-full">
  
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
  
  <UScrollArea 
    v-slot="{ item, index }"
    :items="props.images"
    :virtualize="{ gap: 16 }"
    shadow
  >
    <img :key="index" :src="item.url" />
  </UScrollArea>
</div>
</template>