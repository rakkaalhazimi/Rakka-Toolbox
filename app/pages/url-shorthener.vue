<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useClipboard } from '@vueuse/core';



const urlInput = ref('');
const urlResult = ref('');
const hasGenerated = ref(false);
const { copy, copied } = useClipboard();
const { trigger, pending, error } = useUrlShortener();
const toast = useToast();

type schema = {
  url: string;
};

const state = reactive({
  url: urlInput,
});

const handleOnSubmit = async (event: FormSubmitEvent<schema>) => {
  hasGenerated.value = true;
  const res = await trigger(event.data.url);
  urlResult.value = res.url;
};

const handleOnSubmitTest = async (event: FormSubmitEvent<schema>) => {
  urlResult.value = event.data.url;
  hasGenerated.value = true;
};

const handleBack = () => {
  hasGenerated.value = false;
  urlResult.value = '';
  urlInput.value = '';
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
          @submit.prevent="handleOnSubmit"
        >
          <UFormField name="url">
            <UInput 
              type="url" 
              size="lg"
              placeholder="Type your url here" 
              v-model="urlInput" 
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
                id="url-shorthener-result"
                size="lg" 
                :model-value="urlResult" 
                :loading="pending"
                :ui="{ trailing: 'pr-0.5' }"
                readonly
                class="md:w-md"
              />
            </UFormField>
            <UButton
              color="success"
              variant="solid"
              size="lg"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              aria-label="Copy to clipboard"
              @click="copy(urlResult)"
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
  