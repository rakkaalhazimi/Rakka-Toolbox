import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AudioTrimmerComponent from '~/components/AudioTrimmer.vue';
import AudioTrimmerPage from '~/pages/audio-trimmer.vue';



describe('Audio Trimmer', () => {

  it('Render File Upload form on first load', async () => {
    const component = await mountSuspended(AudioTrimmerPage);
    const uploadInput = component.findComponent({ name: 'UFileUpload' });

    expect(uploadInput.exists()).toBe(true);
  });


  it('Show Audio Trimmer after file upload', async () => {
    URL.createObjectURL = vi.fn(() => 'mock');
    
    const component = await mountSuspended(AudioTrimmerPage, {
      global: {
        stubs: {
          AudioTrimmer: true,
        },
      },
    });
    const form = component.findComponent({ name: 'UForm' });
    await form.trigger('submit');
    await nextTick();

    const audioTrimmer = component.findComponent({ name: 'AudioTrimmer' });
    expect(audioTrimmer.exists()).toBe(true);
  });

  
  
});
