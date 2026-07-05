import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UrlShortener from '~/pages/url-shorthener.vue';



// For future use of mock useFetch
const mockUseFetchData = ref('');
mockNuxtImport('useFetch', () => {
  return vi.fn(() => {
    return {
      data: mockUseFetchData,
      pending: ref(false),
      error: ref(null),
      refresh: vi.fn()
    }
  })
});


const mockGenerateUrl = vi.fn().mockResolvedValue('');
vi.mock('@/composables/useUrlShortener', () => ({
  useUrlShortener: () => ({
    generate: mockGenerateUrl
  })
}));



describe('URL Shortener', () => {
  
  beforeEach(() => {
    mockGenerateUrl.mockClear();
  });

  it('Render URL Shorthener form', async () => {
    const component = await mountSuspended(UrlShortener);
    expect(component.text()).toContain('Generate');
  });


  it('Mock useFetch', async () => {
    const mockData = ref('hello world');
    mockUseFetchData.value = mockData.value;
    
    const { data } = await useFetch('/api/my-data');
    
    expect(data.value).toEqual('hello world');
  });


  it('Generated short url is shown on the page', async () => {
    const baseUrl = 'https://google.com';
    const expectedUrl = 'https://localhost:3000/abcd';

    mockGenerateUrl.mockResolvedValueOnce(expectedUrl);

    const component = await mountSuspended(UrlShortener);
    await component.find('input[type="url"]').setValue(baseUrl);
    await component.find('form').trigger('submit');
    await component.find('button[type="submit"]').trigger('click');

    const inputResult = component.find('input[readonly]');
    const inputElement = inputResult.element as HTMLInputElement;

    expect(inputResult.exists()).toBeTruthy();
    expect(inputElement.value).toBe(expectedUrl);
  });


})