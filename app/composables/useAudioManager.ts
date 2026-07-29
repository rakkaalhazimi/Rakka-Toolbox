import { reactive, ref } from 'vue';



export default function useAudioManager(refName: string) {
  const audioRef = useTemplateRef<HTMLAudioElement>(refName);
  const audioContext = ref<AudioContext>();
  const audioDurationSecond = ref(0);
  const audioCurrentTime = ref(0);

  const audioManager = reactive({
    isPlaying: false,
    audioRef,
    audioContext,
    audioDurationSecond,
    audioCurrentTime,

    init: () => {
      audioContext.value = new AudioContext();
      const audio = audioRef.value!;
      audio.onended = audioManager.onAudioEnd;
      audio.ontimeupdate = audioManager.onTimeUpdate;
    },

    loadAudio: async (file: File) => {
      const url = URL.createObjectURL(file);
      audioRef.value!.src = url;
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.value!.decodeAudioData(arrayBuffer);
      audioDurationSecond.value = round2Decimal(audioBuffer.duration);
    },

    playAudio: () => {
      audioRef.value?.play();
      audioManager.isPlaying = true;
    },

    pauseAudio: () => {
      audioRef.value?.pause();
      audioManager.isPlaying = false;
    },

    onAudioEnd: () => {
      audioManager.isPlaying = false;
    },
    
    onTimeUpdate: (event: Event) => {
      const audio = event.currentTarget as HTMLAudioElement;
      audioCurrentTime.value = audio.currentTime;
    },
    
    setAudioCurrentTime: (time: number) => {
      const audio = audioRef.value!;
      audio.currentTime = time;
      audio.onended = () => {
        audioManager.onAudioEnd();
        audio.currentTime = time;
      }
    },
    
    stopAtTime: (timeStart: number, timeEnd: number) => {
      const audio = audioRef.value!;
      audio.ontimeupdate = (event: Event) => {
        audioManager.onTimeUpdate(event);
        if (audio.currentTime >= timeEnd) {
          audioManager.pauseAudio();
          audioManager.setAudioCurrentTime(timeStart);
        }
      };
    }
  });

  return audioManager;
}