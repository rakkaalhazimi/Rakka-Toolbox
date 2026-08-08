import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';

import JsonViewerPage from '~/pages/json-viewer.vue';

describe('JSON Viewer', () => {
  it('Renders JSON input form on first load', async () => {
    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'UTextarea' });

    expect(textarea.exists()).toBe(true);
  });

  it('Shows formatted JSON after valid input', async () => {
    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'UTextarea' });
    const testJson = JSON.stringify({ name: 'Test', value: 123 });

    await textarea.setValue(testJson);
    await component.find('form').trigger('submit');
    await nextTick();

    const preElement = component.find('pre');
    expect(preElement.exists()).toBe(true);
    expect(preElement.text()).toContain('Test');
  });

  it('Handles invalid JSON gracefully', async () => {
    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'UTextarea' });

    await textarea.setValue('{ invalid json }');
    await component.find('form').trigger('submit');
    await nextTick();

    const form = component.findComponent({ name: 'UForm' });
    expect(form.exists()).toBe(true);
  });

  it('Back button returns to input form', async () => {
    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'UTextarea' });
    const testJson = JSON.stringify({ test: 'data' });

    await textarea.setValue(testJson);
    await component.find('form').trigger('submit');
    await nextTick();

    const backButton = component.findAll('button').find(btn =>
      btn.classes().includes('i-heroicons-arrow-left')
    );
    await backButton?.trigger('click');
    await nextTick();

    const formInput = component.find('textarea');
    expect(formInput.exists()).toBe(true);
  });

  it('Copy button copies JSON to clipboard', async () => {
    const mockCopy = vi.fn();
    vi.mock('@vueuse/core', () => ({
      useClipboard: () => ({
        copy: mockCopy,
        copied: ref(false),
      }),
    }));

    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'UTextarea' });
    const testJson = JSON.stringify({ name: 'Test' });

    await textarea.setValue(testJson);
    await component.find('form').trigger('submit');
    await nextTick();

    const copyButton = component.findAll('button').find(btn =>
      btn.classes().includes('i-lucide-copy')
    );
    await copyButton?.trigger('click');

    expect(mockCopy).toHaveBeenCalled();
  });
});
