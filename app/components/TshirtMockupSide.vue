<script setup lang="ts">
import type { Image } from '~/types/Image';
import { TShirtColor, TSHIRT_COLOR_CHOICES } from '~/types/color'; 


const props = defineProps<{
  handleTshirtColorChange?: (color: TShirtColor) => void;
}>();

const baseSideWidthPx = 80;
const sideWContentPx = 240;
const sideWidthPx = ref(80);

const activePanel = ref('');
const isPanelActive = ref(false);

const imageList = ref<Image[]>([]);

enum Panel {
  IMAGE = 'image',
  COLOR = 'color',
  SKIN = 'skin',
};

const items = [
  {
    id: Panel.IMAGE,
    label: 'Images',
    icon: 'i-lucide-image',
    hover: ref(false),
  },
  {
    id: Panel.COLOR,
    label: 'Colors',
    icon: 'i-lucide-shirt',
    hover: ref(false),
  },
  {
    id: Panel.SKIN,
    label: 'Skin',
    icon: 'i-lucide-droplet',
    hover: ref(false),
  },
];

const colorItems: TShirtColor[] = [
  TSHIRT_COLOR_CHOICES.WHITE,
  TSHIRT_COLOR_CHOICES.BLACK,
  TSHIRT_COLOR_CHOICES.GRAY,
  TSHIRT_COLOR_CHOICES.GREEN,
  TSHIRT_COLOR_CHOICES.BLUE,
  TSHIRT_COLOR_CHOICES.NAVY,
  TSHIRT_COLOR_CHOICES.PURPLE,
  TSHIRT_COLOR_CHOICES.RED,
  TSHIRT_COLOR_CHOICES.PINK,
  TSHIRT_COLOR_CHOICES.YELLOW,
  TSHIRT_COLOR_CHOICES.ORANGE,
  TSHIRT_COLOR_CHOICES.BROWN,
  TSHIRT_COLOR_CHOICES.BEIGE,
];

const handleIconPress = (event: Event, id: Panel) => {
  // console.log('Pressed from: ', id);
  sideWidthPx.value = sideWContentPx;
  isPanelActive.value = !isPanelActive.value;
  activePanel.value = id;
};

const handleIconColorPress = (event: Event, color: TShirtColor) => {
  props.handleTshirtColorChange?.(color);
};

</script>


<template>
<aside 
  class="sticky flex"
  :style="{
    top: 'var(--ui-header-height)',
    height: 'calc(100vh - var(--ui-header-height))'
  }"
>
  <ul
    class="
      flex flex-col items-center gap-y-6
      py-4 w-16 h-full
      border-r border-default
    "
  >
    <li 
      v-for="item in items" :key="item.id" 
      class="flex flex-col items-center cursor-pointer"
      @click="(event: Event) => handleIconPress(event, item.id)"
      @mouseenter="() => item.hover.value = true"
      @mouseleave="() => item.hover.value = false"
    >
      <span 
        class="
          flex justify-center items-center 
          w-8 h-8 rounded-md
        "
        :class="{
          'bg-neutral-200': item.hover.value, 
          'dark:bg-neutral-500': item.hover.value,
        }"
      >
        <UIcon 
          :name="item.icon"
          class="w-6 h-6 cursor-pointer"
        />
      </span>
      <p class="text-xs">{{ item.label }}</p>
    </li>
  </ul>

  <div
    v-if="isPanelActive"
    class="overflow-scroll px-4 my-4 w-72 border-r border-default"
  >
    <!-- Image Panel -->
    <ImageUploadPanel v-if="activePanel === Panel.IMAGE" :images="imageList" />
    
    <!-- Color Panel -->
    <div v-if="activePanel === Panel.COLOR" class="w-full h-full">
      <ul class="grid grid-cols-3 gap-y-2">
        <li
          v-for="(item, index) in colorItems"
          :key="index"
          class="relative flex flex-col justify-center items-center cursor-pointer"
          @click="(event: Event) => handleIconColorPress(event, item)"
        >
          <div 
            class="
              flex justify-center items-center 
              w-10 h-10 rounded-full
              border border-default hover:border-primary-500
            "
          >
            <button 
              class="w-8 h-8 rounded-full border border-neutral-500 cursor-pointer"
              :style="{ 'background-color': item.hex }"
            />
          </div>
          <p>{{ item.label }}</p>
        </li>
      </ul>
    </div>
    
    
    <div v-if="activePanel === Panel.SKIN" class="w-full h-full"></div>
  </div>

</aside>
</template>
