export default function useAudioManager(refName: string) {
  const audioManager = reactive({
    isPlaying: false,
    audioRef: useTemplateRef<HTMLAudioElement>(refName),
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
  
  return audioManager;
}