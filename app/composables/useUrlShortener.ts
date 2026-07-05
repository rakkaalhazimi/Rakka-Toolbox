type UrlShothernerResponse = {
  url: string;
};

export function useUrlShortener() {
  const generate = async (url: string) => {
    const { data } = await useFetch<UrlShothernerResponse>(`/api/url-shorthener/generate?url=${url}`);
    return data.value?.url;
  }
  return { generate };
}