<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

const audioFile = ref<File>();
const hasUpload = ref(false);

type schema = {
  url: string;
};

const state = reactive({
  file: audioFile,
});
  
  
const handleOnSubmit = (event: FormSubmitEvent<schema>) => {
  hasUpload.value = true;
};

const handleBack = () => {
  hasUpload.value = false;
  audioFile.value = undefined;
}
  
</script>

<template>
  <div>
    <UPageSection
      id="audio-trimmer"
      title="Audio Trimmer"
      description="Let's get the part of audio that you need."
      :ui="{
        container: 'sm:gap-10',
      }"
    >
      <UContainer>
        <UForm 
          v-if="!hasUpload"
          class="flex flex-col justify-center gap-y-4 mx-auto max-w-md"
          :state="state"
          @submit.prevent="handleOnSubmit"
        >
          <!-- Audio File -->
          <UFormField name="file">
            <UFileUpload
              v-model="audioFile"
              color="primary"
              layout="list"
              file-icon="i-lucide-file-audio"
              highlight
              accept="audio/*"
              label="Drop your audio file here or Click here"
            />
          </UFormField>
          
          <UButton 
            type="submit" 
            class="justify-center"
            :disabled="audioFile ? false : true"
          >
            Trim Audio
          </UButton>
          
        </UForm>
        
        <div v-else class="flex flex-col items-center gap-y-4 mx-auto max-w-5xl">
          <UButton
            to=""
            variant="link"
            color="primary"
            icon="i-heroicons-arrow-left"
            class="cursor-pointer"
            @click="handleBack"
          >
            Cancel
          </UButton>
          <AudioTrimmer :audio-file="audioFile"></AudioTrimmer>
        </div>
        
      </UContainer>
    </UPageSection>
  </div>
</template>