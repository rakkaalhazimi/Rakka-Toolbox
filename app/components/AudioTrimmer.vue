<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
  audioFile?: File;
}>();

type TrackHandle = {
  pos: number | ComputedRef<number>;
  isDragging: boolean;
  onMouseUp: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
}

const timeStartSecond = ref(0);
const timeEndSecond = ref(0);

const trackSliderRefName = 'track-slider';
const trackSliderRef = useTemplateRef<HTMLDivElement>(trackSliderRefName);
const progressSliderRefName = 'progress-slider';
const progressSliderRef = useTemplateRef<HTMLDivElement>(progressSliderRefName);

const { width: sliderWidth } = useElementSize(trackSliderRef);
const handleWidthPx = 30;
const handleHeightPx = 30;
const sliderHeightPx = 48;
const seekWidthPx = 3;
const seekHeightPx = sliderHeightPx;

const offsetPx = handleWidthPx / 2;
const minPos = ref(-offsetPx);
const maxPos = computed(() => sliderWidth.value - offsetPx);

const progressBaseWidthPx = ref(0);
const progressVarWidthPx = computed(() => rightPos.value - leftPos.value);
const progressBaseLeftPx = computed(() => 
  trackSliderRef.value 
  ? trackSliderRef.value.getBoundingClientRect().left
  : 0
);

const audioRefName = 'audio';
const audioManager = useAudioManager(audioRefName);

const isLoadingTrim = ref(false);


const leftHandle = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {leftHandle.isDragging = false},
  onMouseDown: (event: MouseEvent) => {leftHandle.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!leftHandle.isDragging) return;

    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - offsetPx;
    leftHandle.pos = Math.min(handlePos, rightHandle.pos);

    const progressLeftPx = progressSliderRef.value!.getBoundingClientRect().left;
    
    timeStartSecond.value = 
      (progressLeftPx - progressBaseLeftPx.value) / progressBaseWidthPx.value
      * audioManager.audioDurationSecond;
    timeStartSecond.value = round2Decimal(timeStartSecond.value);
    
    audioManager.setAudioCurrentTime(timeStartSecond.value);
    audioManager.stopAtTime(timeStartSecond.value, timeEndSecond.value);
    
    // console.log('Time start: ', timeStartSecond.value);
  },
});
const leftPos = computed(() =>
  clampNumber(
    leftHandle.pos,
    minPos.value,
    maxPos.value,
));


const rightHandle = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {rightHandle.isDragging = false},
  onMouseDown: (event: MouseEvent) => {rightHandle.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!rightHandle.isDragging) return;

    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - offsetPx;
    rightHandle.pos = Math.max(handlePos, leftHandle.pos);

    const progressRightPx = progressSliderRef.value!.getBoundingClientRect().right;
    
    timeEndSecond.value = 
      (progressRightPx - progressBaseLeftPx.value) / progressBaseWidthPx.value
      * audioManager.audioDurationSecond;
    timeEndSecond.value = round2Decimal(timeEndSecond.value);
    
    audioManager.setAudioCurrentTime(timeStartSecond.value);
    audioManager.stopAtTime(timeStartSecond.value, timeEndSecond.value);
    
    // console.log('Time end: ', timeEndSecond.value);
  },
});
const rightPos = computed(() =>
  clampNumber(
    rightHandle.pos,
    minPos.value,
    maxPos.value,
  ));
// The computed doesnt have to include both handle,
// if we want to resolve screen change, we can just use min and max in computed.


const seekBarPos = computed(() => {

  const ticking = setInterval(() => {
    
  }, 100);
  
  if (audioManager.isPlaying) {
    const currentProgressPx = 
      (audioManager.audioCurrentTime / audioManager.audioDurationSecond)
      * progressBaseWidthPx.value;

    return clampNumber(
      currentProgressPx, 
      leftPos.value, 
      rightPos.value,
    );
    
  } else {
    return leftPos.value + offsetPx;
  }
});


function secondsToHHMMSS(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad numbers with leading zeros to ensure uniform length
  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

async function handleTrimAudio() {
  isLoadingTrim.value = true;
  const { outputUrl, outputName } = 
    await trimAudio(props.audioFile!, timeStartSecond.value, timeEndSecond.value);
    
  downloadBlob(outputUrl, outputName);
  isLoadingTrim.value = false;
}


onMounted(async () => {
  window.addEventListener('mouseup', leftHandle.onMouseUp);
  window.addEventListener('mouseup', rightHandle.onMouseUp);
  window.addEventListener('mousemove', leftHandle.onMouseMove);
  window.addEventListener('mousemove', rightHandle.onMouseMove);
  
  // audioContext.value = new AudioContext();
  // loadAudio();
  
  audioManager.init();
  await audioManager.loadAudio(props.audioFile!);
  timeEndSecond.value = audioManager.audioDurationSecond;
  // console.log('Time end second: ', timeEndSecond.value);

  leftHandle.pos = minPos.value;
  rightHandle.pos = maxPos.value;
  
  progressBaseWidthPx.value = progressVarWidthPx.value;
  
  // console.log('Left: ', leftHandle.pos + handleWidthPx);
  // console.log('Slider left: ', trackSliderRef.value!.getBoundingClientRect().left);
  // console.log('Progress left: ', progressBaseLeftPx.value);
  // console.log('Offset left: ', leftHandle.pos + handleWidthPx);
  
  // nextTick() will wait the layout to load.
  // Sometimes the layout is still loading and some size get off
  // Need to recalculate the layout to get the true value
  // await nextTick();
  
});

onUnmounted(() => {
  window.removeEventListener('mouseup', leftHandle.onMouseUp);
  window.removeEventListener('mouseup', rightHandle.onMouseUp);
  window.removeEventListener('mousemove', leftHandle.onMouseMove);
  window.removeEventListener('mousemove', rightHandle.onMouseMove);
});

</script>

<template>
  <div class="relative flex flex-col gap-y-6 w-full">
    <div
      :ref="trackSliderRefName"
      class="relative w-full h-6 bg-gray-300"
      :style="{
        height: `${ sliderHeightPx }px`,
      }"
    >
      <audio :ref="audioRefName"/>
      <div
        :ref="progressSliderRefName"
        class="absolute bg-primary origin-left"
        :style="{
          left: `${ leftPos + offsetPx }px`,
          width: `${ progressVarWidthPx }px`,
          height: `${ sliderHeightPx }px`,
        }"
      ></div>
      
       <div 
        id="seek-bar"
        class="absolute bg-gray-700"
        :style="{
          left: `${seekBarPos}px`,
          width: `${seekWidthPx}px`,
          height: `${seekHeightPx}px`,
        }"
      >
      </div> 
      
      <HandleTick 
        ref="left-track-handle"
        :width="handleWidthPx" 
        :height="handleHeightPx"
        class="absolute bg-primary"
        :style="{
          top: `-${handleHeightPx}px`,
          left: `${leftPos}px`,
        }"
        :disabled="audioManager.isPlaying"
        @mousedown="leftHandle.onMouseDown?.($event)"  
      ></HandleTick>

      <HandleTick 
        ref="right-track-handle"
        :width="handleWidthPx" 
        :height="handleHeightPx"
        class="absolute bg-primary"
        :style="{
          top: `-${handleHeightPx}px`,
          left: `${rightPos}px`,
        }"
        :disabled="audioManager.isPlaying"
        @mousedown="rightHandle.onMouseDown?.($event)"
      ></HandleTick>
    </div>

    <div class="flex flex-row">
      <UButton
        v-if="!audioManager.isPlaying"
        icon="i-mdi-play"
        size="2xl"
        color="primary"
        class="rounded-full self-start"
        @click="audioManager.playAudio"
      />
      <UButton
        v-else
        icon="i-material-symbols-pause"
        size="2xl"
        color="primary"
        class="rounded-full self-start"
        @click="audioManager.pauseAudio"
      />
      <div class="grid grid-cols-3 items-center w-full text-right">
        <span>
          <p>Duration</p>
          <p id="duration">{{ round2Decimal(timeEndSecond - timeStartSecond) }}</p>
        </span>
        <span>
          <p>Time Start</p>
          <p id="time-start">{{ secondsToHHMMSS(timeStartSecond) }}</p>
        </span>
        <span>
          <p>Time End</p>
          <p id="time-end">{{ secondsToHHMMSS(timeEndSecond) }}</p>
        </span>
      </div>
    </div>

    <div class="flex justify-end">
      <UButton 
        size="lg" 
        :loading="isLoadingTrim"
        @click="handleTrimAudio"
      >Trim</UButton>
    </div>
  </div>
</template>
