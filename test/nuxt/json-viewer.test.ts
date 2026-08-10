import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';

import JsonViewerPage from '~/pages/json-viewer.vue';


const mockCopy = vi.fn();
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core')
  return {
    ...actual,
    useClipboard: () => ({
      copy: mockCopy,
      isSupported: ref(true),
    }),
  }
});


describe('JSON Viewer', () => {
  it('Renders JSON input form on first load', async () => {
    const component = await mountSuspended(JsonViewerPage);
    const textarea = component.findComponent({ name: 'JsonEditor' });

    expect(textarea.exists()).toBe(true);
  });

  it('Shows formatted JSON after valid input', async () => {
    const component = await mountSuspended(JsonViewerPage, {
      global: {
        stubs: {
          JsonEditor: true,
          JsonViewer: true,
        }
      }
    });
    const testJson = JSON.stringify({ name: 'Test', value: 123 });

    // When JsonEditor is stubbed there is no textarea; set the bound ref directly
    // instead of typing into a textarea
    (component.vm as any).jsonInput = testJson;
    await component.find('form').trigger('submit');
    await nextTick();

    const preElement = component.findComponent({name: 'JsonViewer'});
    expect(preElement.exists()).toBe(true);
  });

  it('Handles invalid JSON gracefully', async () => {
    const component = await mountSuspended(JsonViewerPage, {
      global: {
        stubs: {
          JsonEditor: true,
          JsonViewer: true,
        }
      }
    });
    const testJson = '{ invalid json }';
    (component.vm as any).jsonInput = testJson;
    await component.find('form').trigger('submit');
    await nextTick();

    const form = component.findComponent({ name: 'JsonEditor' });
    expect(form.exists()).toBe(true);
  });

  it('Back button returns to input form', async () => {
    const component = await mountSuspended(JsonViewerPage, {
      global: {
        stubs: {
          JsonEditor: true,
          JsonViewer: true,
        }
      }
    });
    const testJson = JSON.stringify({ test: 'data' });
    (component.vm as any).jsonInput = testJson;
    await component.find('form').trigger('submit');
    await nextTick();

    const backButton = component.findAll('button').find(btn =>
      btn.text().includes('Back')
    );
    await backButton?.trigger('click');
    await nextTick();

    const formInput = component.findComponent({ name: 'JsonEditor' });
    expect(formInput.exists()).toBe(true);
  });

  it('Copy button copies JSON to clipboard', async () => {
    const component = await mountSuspended(JsonViewerPage, {
      global: {
        stubs: {
          JsonEditor: true,
          JsonViewer: true,
        }
      }
    });
    const testJson = JSON.stringify({ name: 'Test' });
    (component.vm as any).jsonInput = testJson;
    await component.find('form').trigger('submit');
    await nextTick();

    const copyButton = component.find('button[aria-label="Copy to clipboard"]');
    await copyButton?.trigger('click');

    expect(mockCopy).toHaveBeenCalled();
  });
});
