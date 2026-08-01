<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
  audioFile?: File;
}>();

type TrackHandle = {
  pos: number;
  isDragging: boolean;
  onMouseUp: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
}

const epsilon = 2;

const timeStartSecond = ref(0);
const timeEndSecond = ref(0);

const trackSliderRef = useTemplateRef<HTMLDivElement>('track-slider');
const progressSliderRef = useTemplateRef<HTMLDivElement>('progress-slider');

const { width: sliderWidth } = useElementSize(trackSliderRef);
const minPos = ref(0);
const maxPos = computed(() => sliderWidth.value);

const handleWidthPx = 30;
const handleHeightPx = 30;
const sliderHeightPx = 48;
const seekWidthPx = 3;
const seekHeightPx = sliderHeightPx;


const progressBaseWidthPx = ref(0);
const progressVarWidthPx = computed(() => rightHandle.pos - leftHandle.pos);
const progressBaseLeftPx = computed(() => 
  trackSliderRef.value 
  ? trackSliderRef.value.getBoundingClientRect().left
  : 0
);

const audioRefName = 'audio';
const audioManager = useAudioManager(audioRefName);


const leftHandle = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {leftHandle.isDragging = false},
  onMouseDown: (event: MouseEvent) => {leftHandle.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!leftHandle.isDragging) return;

    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - (handleWidthPx / 2);

    leftHandle.pos = clampNumber(
      handlePos,
      minPos.value,
      rightHandle.pos - epsilon, // Two handles won't collide
    );
    
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


const rightHandle = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {rightHandle.isDragging = false},
  onMouseDown: (event: MouseEvent) => {rightHandle.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!rightHandle.isDragging) return;

    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - (handleWidthPx / 2);

    rightHandle.pos = clampNumber(
      handlePos,
      leftHandle.pos + epsilon, // Two handles won't collide
      maxPos.value,
    );
    
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


const seekBarPos = computed(() => {
  const currentProgressPx = 
    (audioManager.audioCurrentTime / audioManager.audioDurationSecond)
    * progressBaseWidthPx.value;
  return clampNumber(
    currentProgressPx, 
    leftHandle.pos, 
    rightHandle.pos
  );
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
  const { outputUrl, outputName } = 
    await trimAudio(props.audioFile!, timeStartSecond.value, timeEndSecond.value);
    
  downloadBlob(outputUrl, outputName);
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
      ref="track-slider"
      class="relative w-full h-6 bg-gray-300"
      :style="{
        height: `${ sliderHeightPx }px`,
      }"
    >
      <audio :ref="audioRefName"/>
      <div
        ref="progress-slider"
        class="absolute bg-primary origin-left"
        :style="{
          left: `${ leftHandle.pos }px`,
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
          left: `${leftHandle.pos - handleWidthPx / 2}px`,
        }"
        @mousedown="leftHandle.onMouseDown?.($event)"
      ></HandleTick>

      <HandleTick 
        ref="right-track-handle"
        :width="handleWidthPx" 
        :height="handleHeightPx"
        class="absolute bg-primary"
        :style="{
          top: `-${handleHeightPx}px`,
          left: `${rightHandle.pos - handleWidthPx / 2}px`,
        }"
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
      <div class="grid grid-cols-3 items-center w-full text-center">
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
      <UButton size="lg" @click="handleTrimAudio">Trim</UButton>
    </div>
  </div>
</template>
