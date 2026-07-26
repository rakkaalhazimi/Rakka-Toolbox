type UrlShothernerResponse = {
  url: string;
};

export default function useUrlShortener() {
  const pending = ref(false);
  const error = ref<Error | null>(null);
  
  const trigger = async (url: string) => {
    pending.value = true;
    error.value = null;
    try {
      return await $fetch<UrlShothernerResponse>('/api/url-shorthener/generate', {
        query: { url },
      });
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      pending.value = false;
    }
  };

  return {
    trigger,
    pending: readonly(pending),
    error: readonly(error),
  };
}