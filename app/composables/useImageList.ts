import type { Image } from '~/types/Image';


export default function useImageList() {
  const images = ref<Image[]>([]);
  
  return images;
}