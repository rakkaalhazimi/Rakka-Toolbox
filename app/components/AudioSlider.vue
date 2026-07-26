<script lang="ts" setup>
import { useClamp } from '~/composables/useClamp';
import { useDownloadBlob } from '~/composables/useDownloadBlob';
import { useTrimAudio } from '~/composables/useTrimAudio';



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

const audioContext = ref<AudioContext>();
const audioDurationSecond = ref(10);
const timeStartSecond = ref(0);
const timeEndSecond = ref(0);

const minPos = ref(0);
const maxPos = ref(0);
const handleWidthPx = 12;
const handleHeightPx = 96;
const sliderHeightPx = 48;
const seekWidthPx = 3;
const seekHeightPx = sliderHeightPx;

const trackSliderRef = useTemplateRef<HTMLDivElement>('track-slider');
const progressSliderRef = useTemplateRef<HTMLDivElement>('progress-slider');

const progressBaseWidthPx = ref(0);
const progressVarWidthPx = computed(() => rightHandle.pos - leftHandle.pos - handleWidthPx);
const progressBaseLeftPx = computed(() => 
  trackSliderRef.value 
  ? trackSliderRef.value.getBoundingClientRect().left
  : 0
);



const leftHandle = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {leftHandle.isDragging = false},
  onMouseDown: (event: MouseEvent) => {leftHandle.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!leftHandle.isDragging) return;

    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - (handleWidthPx / 2);

    leftHandle.pos = useClamp(
      handlePos,
      minPos.value,
      rightHandle.pos - handleWidthPx, // Two handle won't collide
    );
    
    const progressLeftPx = progressSliderRef.value!.getBoundingClientRect().left;
    
    timeStartSecond.value = 
      (progressLeftPx - progressBaseLeftPx.value) / progressBaseWidthPx.value
      * audioManager.audioDurationSecond;
    timeStartSecond.value = round2Decimal(timeStartSecond.value);
    
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

    rightHandle.pos = useClamp(
      handlePos,
      leftHandle.pos + handleWidthPx, // Two handle won't collide
      maxPos.value,
    );
    
    const progressRightPx = progressSliderRef.value!.getBoundingClientRect().right;
    
    timeEndSecond.value = 
      (progressRightPx - progressBaseLeftPx.value) / progressBaseWidthPx.value
      * audioManager.audioDurationSecond;
    timeEndSecond.value = round2Decimal(timeEndSecond.value);
    
    // console.log('Time end: ', timeEndSecond.value);
  },
});

const seekBar = reactive<TrackHandle>({
  pos: 0,
  isDragging: false,
  onMouseUp: (event: MouseEvent) => {seekBar.isDragging = false},
  onMouseDown: (event: MouseEvent) => {seekBar.isDragging = true},
  onMouseMove: (event: MouseEvent) => {
    if (!seekBar.isDragging) return;
    
    const sliderLeftPx = trackSliderRef.value!.getBoundingClientRect().left;
    const handlePos = event.clientX - sliderLeftPx - (seekWidthPx / 2);

    seekBar.pos = useClamp(
      handlePos,
      minPos.value,
      rightHandle.pos - seekWidthPx, // Two handle won't collide
    );
    
    const progressLeftPx = progressSliderRef.value!.getBoundingClientRect().left;
    
    timeStartSecond.value = 
      (progressLeftPx - progressBaseLeftPx.value) / progressBaseWidthPx.value
      * audioManager.audioDurationSecond;
    timeStartSecond.value = round2Decimal(timeStartSecond.value);
  }
});


const audioManager = reactive({
  isPlaying: false,
  audioRef: useTemplateRef<HTMLAudioElement>('audio'),
  audioContext: ref<AudioContext>(),
  audioDurationSecond: ref(0),
  init: () => {
    audioManager.audioContext = new AudioContext();
    audioManager.audioRef!.onended = audioManager.onAudioEnd;
  },
  
  loadAudio: async (file: File) => {
    const url = URL.createObjectURL(file);
    audioManager.audioRef!.src = url;
    
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioManager.audioContext!.decodeAudioData(arrayBuffer);
    
    audioManager.audioDurationSecond = round2Decimal(audioBuffer.duration);
    const audioWaveform = audioBuffer.getChannelData(0);
  },
  
  playAudio: () => {
    audioManager.audioRef?.play();
    audioManager.isPlaying = true;
  },
  
  pauseAudio: () => {
    audioManager.audioRef?.pause();
    audioManager.isPlaying = false;
  },
  
  onAudioEnd: () => {
    audioManager.isPlaying = false;
  }  
});


function round2Decimal(value: number) {
  return Math.round(value * 100) / 100;
}


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
    await useTrimAudio(props.audioFile!, timeStartSecond.value, timeEndSecond.value);
    
  useDownloadBlob(outputUrl, outputName);
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

  const sliderWidth = trackSliderRef.value!.getBoundingClientRect().width;

  maxPos.value = sliderWidth;
  minPos.value = -handleWidthPx;

  leftHandle.pos = minPos.value;
  rightHandle.pos = maxPos.value;
  
  progressBaseWidthPx.value = progressVarWidthPx.value;
  
  // console.log('Left: ', leftHandle.pos + handleWidthPx);
  // console.log('Slider left: ', trackSliderRef.value!.getBoundingClientRect().left);
  // console.log('Progress left: ', progressBaseLeftPx.value);
  // console.log('Offset left: ', leftHandle.pos + handleWidthPx);
  
  // Need to recalculate the layout to get the true value
  await nextTick();
  console.log('Progress left after tick: ', progressSliderRef.value!.getBoundingClientRect().left);
  
});

onUnmounted(() => {
  window.removeEventListener('mouseup', leftHandle.onMouseUp);
  window.removeEventListener('mouseup', rightHandle.onMouseUp);
  window.removeEventListener('mousemove', leftHandle.onMouseMove);
  window.removeEventListener('mousemove', rightHandle.onMouseMove);
});

</script>

<template>
  <div class="relative w-full">
    <div
      ref="track-slider"
      class="relative w-full h-6 bg-gray-300"
      :style="{
        height: `${ sliderHeightPx }px`,
      }"
    >
      <audio ref="audio"/>
      <div
        ref="progress-slider"
        class="absolute bg-primary origin-left"
        :style="{
          left: `${ leftHandle.pos + handleWidthPx }px`,
          width: `${ progressVarWidthPx }px`,
          height: `${ sliderHeightPx }px`,
        }"
      ></div>
      <div 
        id="seek-bar"
        class="absolute bg-gray-700"
        :style="{
          left: `${seekBar.pos}`,
          width: `${seekWidthPx}px`,
          height: `${seekHeightPx}px`,
        }"
      >
      </div>
      <button
        ref="left-track-handle"
        class="absolute top-[-50%] h-12 rounded-lg border bg-white"
        :style="{
          left: `${leftHandle.pos}px`,
          width: `${handleWidthPx}px`,
          height: `${handleHeightPx}px`,
        }"
        @mousedown="leftHandle.onMouseDown?.($event)"
      >
      </button>
      <button
        ref="right-track-handle"
        class="absolute top-[-50%] h-12 rounded-lg border bg-white"
        :style="{
          left: `${rightHandle.pos}px`,
          width: `${handleWidthPx}px`,
          height: `${handleHeightPx}px`,
        }"
        @mousedown="rightHandle.onMouseDown?.($event)"
      >
      </button>
    </div>


    <p id="duration">Duration: {{ secondsToHHMMSS(audioDurationSecond) }}</p>
    <p id="time-start">Time Start: {{ secondsToHHMMSS(timeStartSecond) }}</p>
    <p id="time-end">Time End: {{ secondsToHHMMSS(timeEndSecond) }}</p>
    
    <UButton
      v-if="!audioManager.isPlaying"
      icon="i-mdi-play"
      size="sm"
      color="primary"
      square
      class="rounded-full"
      @click="audioManager.playAudio"
    />
    <UButton
      v-else
      icon="i-material-symbols-pause"
      size="sm"
      color="primary"
      square
      class="rounded-full"
      @click="audioManager.pauseAudio"
    />
    
    <UButton @click="handleTrimAudio">Trim</UButton>
  </div>
</template>