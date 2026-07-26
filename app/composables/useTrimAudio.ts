import { fetchFile } from '@ffmpeg/util';

import { useInitFfmpeg } from '~/composables/useInitFfmpeg';



export async function useTrimAudio(inputFile: File, startTime: number, endTime: number) {
  const ffmpeg = await useInitFfmpeg();
  const inputName = inputFile.name;
  const outputName = `output_${inputName}`;

  // 1. Write the source file into FFmpeg's virtual FS memory map
  await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

  // 2. Execute CLI arguments equivalent to: 
  // ffmpeg -i input.mp3 -ss 0 -to 10 -c copy output.mp3
  await ffmpeg.exec([
    '-i', inputName,
    '-ss', startTime.toString(),
    '-to', endTime.toString(),
    '-c', 'copy', // Stream copy mode bypasses heavy re-encoding for instant processing
    outputName
  ]);

  // 3. Extract the processed file from the virtual file system
  const data = await ffmpeg.readFile(outputName);
  const uint8 = data as Uint8Array<ArrayBuffer>;
  
  // 4. Create an object URL to feed into local components
  const audioBlob = new Blob([uint8], { type: inputFile.type });
  const outputUrl = URL.createObjectURL(audioBlob);
  console.log('Output Url: ', outputUrl);

  // Clean up memory inside the virtual file system
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);
  
  return { outputUrl, outputName };
}