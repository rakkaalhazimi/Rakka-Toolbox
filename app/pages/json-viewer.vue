<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useClipboard, useElementSize } from '@vueuse/core';


const textAreaRefName = 'text-area';
const textAreaRef = useTemplateRef<any>(textAreaRefName);
const { width: textAreaWidth, height: textAreaHeight } = useElementSize(textAreaRef);


const jsonInput = ref('');
const jsonResult = ref<object | null>(null);
const hasViewed = ref(false);
const isValidJson = ref(true);
const { copy, copied } = useClipboard();
const toast = useToast();

type schema = {
  json: string;
};

const state = reactive({
  json: jsonInput,
});


const handleOnSubmit = (event: FormSubmitEvent<schema>) => {
  try {
    const parsed = JSON.parse(event.data.json);
    jsonResult.value = parsed;
    hasViewed.value = true;
    isValidJson.value = true;
    
  } catch (error) {
    isValidJson.value = false;
    const errorMessage =
      error instanceof Error ? error.message : 'Invalid JSON format.';

    const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    
    toast.add({
      title: 'Invalid JSON',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  }
};

const handleBack = () => {
  hasViewed.value = false;
  jsonResult.value = null;
  isValidJson.value = true;
};

const handleCopyJson = () => {
  if (jsonResult.value) {
    copy(JSON.stringify(jsonResult.value, null, 2));
    toast.add({
      title: 'Copied!',
      description: 'JSON copied to clipboard.',
      icon: 'i-lucide-check',
    });
  }
};

const handlePasteJson = async () => {
  const clipboardText = await navigator.clipboard.readText();
  jsonInput.value = clipboardText;
}

const handleTest = () => {
  console.log('Width: ', textAreaWidth);
  console.log('Height: ', textAreaHeight);
}


onMounted(async () => {
  window.addEventListener('paste', handleTest);
});

</script>

<template>
  <div>
    <UPageSection
      id="json-viewer"
      title="JSON Viewer"
      description="Visualize and format your JSON data with ease."
      :ui="{
        container: 'sm:gap-10',
      }"
    >
      <UContainer>
        <UForm
          v-if="!hasViewed"
          class="relative flex flex-col justify-center gap-y-4 mx-auto max-w-2xl"
          :state="state"
          @submit.prevent="handleOnSubmit"
        > 
          <!-- JSON Input -->
          <JsonEditor v-model="jsonInput"></JsonEditor> 

          <UButton
            type="submit"
            class="justify-center"
            :disabled="!jsonInput.trim()"
          >
            View JSON
          </UButton>

          <!-- <UTooltip text="Paste from your Clipboard" class="absolute right-0 top-0">
            <UButton
              color="primary"
              variant="outline"
              size="sm"
              icon="i-lucide-clipboard-paste"
              aria-label="Paste from your Clipboard"
              class="cursor-pointer"
              @click="handlePasteJson"
            />
          </UTooltip> -->
        </UForm>

        <div v-else class="flex flex-col items-center gap-y-6 mx-auto max-w-4xl">
          <UButton
            variant="link"
            color="primary"
            icon="i-heroicons-arrow-left"
            class="cursor-pointer ml-auto"
            @click="handleBack"
          >
            Back
          </UButton>

          <div class="w-full">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Formatted JSON</h3>
              <UButton
                color="success"
                variant="solid"
                size="sm"
                :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy to clipboard"
                @click="handleCopyJson"
              />
            </div>

            <div class="bg-slate-900 rounded-lg p-6 overflow-auto max-h-96 border border-slate-700">
              <pre class="text-sm text-slate-100 font-mono whitespace-pre-wrap wrap-break-words">{{ JSON.stringify(jsonResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>
  </div>
</template>
