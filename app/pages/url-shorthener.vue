<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useClipboard } from '@vueuse/core';

import { useUrlShortener } from '~/composables/useUrlShortener';



const value = ref('');
const result = ref('');
const hasGenerated = ref(false);
const { copy, copied } = useClipboard();
const { generate } = useUrlShortener();

type schema = {
  url: string;
};

const state = reactive({
  url: value,
});

const handleOnSubmit = async (event: FormSubmitEvent<schema>) => {
  const url = await generate(event.data.url);
  result.value = url!;
  hasGenerated.value = true;
};

const handleOnSubmitTest = async (event: FormSubmitEvent<schema>) => {
  result.value = event.data.url;
  hasGenerated.value = true;
};

const handleBack = () => {
  hasGenerated.value = false;
};
  
</script>

<template>
  <div>
    <UPageSection
      id="url-shorthener"
      title="URL Shorthener"
      description="Trim those long string into simple string"
      :ui="{
        container: 'sm:gap-10'
      }"
    >
      <UContainer>
        <UForm 
          v-if="!hasGenerated"
          class="flex flex-row justify-center gap-x-2 mx-auto max-w-md"
          :state="state"
          @submit="handleOnSubmit"
        >
          <UFormField name="url">
            <UInput 
              type="url" 
              size="lg"
              placeholder="Type your url here" 
              v-model="value" 
              trailing-icon="i-lucide-link"
              class="md:w-md"
            />
          </UFormField>
          <UButton type="submit" size="lg">Generate</UButton>
        </UForm>
        
        <div v-else class="flex flex-col items-center gap-y-4 mx-auto max-w-md">
          <!-- <h4>Your short URL is:</h4> -->
          <div class="flex flex-row items-end gap-x-2">
            <UFormField label="Your result">
              <UInput 
                size="lg" 
                :model-value="result" 
                readonly
                :ui="{ trailing: 'pr-0.5' }"
                class="md:w-md"
              />
            </UFormField>
            <UButton
              color="success"
              variant="solid"
              size="lg"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              aria-label="Copy to clipboard"
              @click="copy(result)"
            />
          </div>
          
          <UButton 
            to="" 
            variant="link" 
            color="primary"
            icon="i-heroicons-arrow-right"
            trailing
            class="cursor-pointer"
            @click="handleBack"
          >
            Back to url shorthener
          </UButton>
        </div>
        
      </UContainer>
  
    </UPageSection>
  </div>
</template>
  