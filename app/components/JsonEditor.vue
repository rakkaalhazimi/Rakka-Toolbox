<script setup lang="ts">
import { useElementSize } from '@vueuse/core';

// Don't import useColorMode, it already shared in global variable.
// Else our colorMode.value won't be reactive.
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

const textModel = defineModel();

const codeContentRefName = 'code-content';
const codeContentRef = useTemplateRef<HTMLElement>(codeContentRefName);

const highlighterRefName = 'syntax-highlighter';
const highlighterRef = useTemplateRef<HTMLPreElement>(highlighterRefName);

const textAreaRefName = 'text-area';
const textAreaRef = useTemplateRef<HTMLTextAreaElement>(textAreaRefName);
const { width: textAreaWidth, height: textAreaHeight } = useElementSize(textAreaRef);


function highlightJsonError(jsonString: string) {
  try {
    JSON.parse(jsonString);
    // Return string as it is if no error
    return jsonString;

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Invalid JSON format.';
    const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    // Insert additional error tag based on Parse Error line and col.
    if (lineColMatch) {
      let row = parseInt(lineColMatch[1] ?? '0');
      let col = parseInt(lineColMatch[2] ?? '0');
      
      const lines = jsonString.split('\n');
      row = Math.max(0, row - 1);
      const selectedLine = lines[row] ?? '';

      col = Math.max(0, col - 1);
      let modifiedLine =
        selectedLine.slice(0, col)
        + '<error>'
        + selectedLine.slice(col, col + 1)
        + '</error>'
        + selectedLine.slice(col + 1, selectedLine.length);

      // Replace error tag if no character found 
      // note: (maybe not because empty string can trigger error)
      //
      // modifiedLine = modifiedLine.replace('<error></error>', '');

      lines[row] = modifiedLine;
      const highlightedJson = lines.join('\n');
      console.log(highlightedJson);
      return highlightedJson;
    }
    
    console.error('Failed to parse JSON: ');
    console.error(error as Error);

    return jsonString;
  }
  
}

const colorMap: Record<string, string> = {
  key: 'text-red-400',
  string: 'text-green-400',
  number: 'text-orange-400',
  boolean: 'text-purple-400',
  null: 'text-gray-400',
};

function highlightText(match: string) {
  let cls = 'number';
  // Start with double quote
  if (/^"/.test(match)) {
    // End with colon
    if (/:$/.test(match)) {
      cls = 'key';
    // End without colon is always string
    } else {
      cls = 'string';
    }
  } else if (/true|false/.test(match)) {
    cls = 'boolean';
  } else if (/null/.test(match)) {
    cls = 'null';
  }
  const color = colorMap[cls];
  cls += ' ' + color;
  return '<span class="' + cls + '">' + match + '</span>';
}

// Function - JSON Syntax Highlighting
// ref: https://codepen.io/absolutedevelopment/pen/EpwVzN
function syntaxHighlight(json: string | object) {
  if (typeof json != "string") {
    json = JSON.stringify(json, null, "\t");
  }
  
  // json = json
  //   .replace(/&/g, "&amp;")
  //   .replace(/</g, "&lt;")
  //   .replace(/>/g, "&gt;");
  
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    highlightText
  );
}

const updateCode = (value: string) => {
  let text = value;
  // Handle final newlines
  if (text[text.length-1] == "\n") {
    text += " ";
  }

  // Let the user type plain <,> and & before highlighting
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  text = highlightJsonError(text);
  text = syntaxHighlight(text);
  codeContentRef.value!.innerHTML = text;
}

const handleInputText = (event: InputEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
  let text = textarea.value;
  updateCode(text);
}

// Gives textarea and pre tag tab behavior
function handleOnKeyDown(event: KeyboardEvent) {
  const textarea = event.target as HTMLTextAreaElement;
  const code = textarea.value;
  if (event.key == 'Tab') {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    const beforeTab = code.slice(0, textarea.selectionStart); // text before tab
    const afterTab = code.slice(textarea.selectionEnd, textarea.value.length); // text after tab

    const cursorPos = textarea.selectionStart + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    textarea.value = beforeTab + '\t' + afterTab; // add tab char
    
    // move cursor
    textarea.selectionStart = cursorPos;
    textarea.selectionEnd = cursorPos;
    updateCode(textarea.value) // Update text to include indent
  }
}

// Sync scroll between textarea and pre
const handleOnScroll = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  highlighterRef.value!.scrollTop = textarea.scrollTop;
  highlighterRef.value!.scrollLeft = textarea.scrollLeft;
};

onMounted(() => {
  updateCode(textModel.value as string);
});

</script>


<template>

  <div 
    class="relative w-full h-60"
  >
    <pre
      :ref="highlighterRefName"
      class="syntax-highlighter w-full h-full"
    ><code 
      :ref="codeContentRefName"
      class="code-content"
    ></code></pre>
    
    <textarea 
      :ref="textAreaRefName"
      v-model="textModel"
      name="json-editor" 
      class="
        json-editor
        w-full h-full
        bg-transparent text-transparent
        resize-none
        ring ring-inset ring-accented 
        outline-primary/25 
        focus-visible:outline-3 
        focus-visible:ring-primary
        transition-colors
      "
      :class="isDark ? 'caret-white' : 'caret-black'"
      @input="handleInputText"
      @scroll="handleOnScroll" 
      @keydown="handleOnKeyDown"
    ></textarea>
    
  </div>

</template>


<style>
.syntax-highlighter, .code-content, .json-editor {
  /* Text editor tab size */
  tab-size: 2;
  -moz-tab-size: 2;

  /* Text editor font */
  font-size: var(--text-base);
  font-family: monospace;
  line-height: var(--text-base--line-height);
}

.syntax-highlighter, .json-editor {
  border-radius: var(--radius-md);
}

/* Padding for both pre and textarea */
.syntax-highlighter, .json-editor {
  padding-inline: 0.625rem;
  padding-block: 0.625rem;
}

/* Make pre and textarea on top of each other */
.syntax-highlighter, .json-editor {
  position: absolute;
  top: 0;
  left: 0;
}

/* Scrollable pre tag */
.syntax-highlighter {
  overflow: scroll;
}

/* Textarea on top of pre */
.syntax-highlighter {
  z-index: 0;
} 
.json-editor {
  z-index: 1;
}

/* Error highlight */
error {
  background-color: #ec4899;
  color: var(--text-color-default);
}
</style>
