<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui';

const props = defineProps<{
  json: string;
}>();

function typeToIcon(value: any) {
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return 'i-boxicons-bracket-curly';
  }
  else if (Array.isArray(value)) {
    return 'i-boxicons-bracket';
  }
  else {
    return 'i-boxicons-key';
  }
}

function typeToSuffix(value: any) {
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return 'i-boxicons-bracket-curly';
  }
  else if (Array.isArray(value)) {
    return 'i-boxicons-bracket';
  }
  else {
    return 'i-boxicons-key';
  }
}

function jsonToTreeItem(jsonItem: any): TreeItem[] {
  if (typeof jsonItem === 'string') {
    return [{ label: jsonItem, icon: 'i-lucide-text' }];
    
  } else if (typeof jsonItem === 'number') {
    return [{ label: String(jsonItem), icon: 'i-lucide-hash' }];
    
  } else if (typeof jsonItem === 'boolean') {
    return [{ label: String(jsonItem), icon: 'i-lucide-binary' }];
    
  } else if (jsonItem === null) {
    return [{ label: String(jsonItem), icon: 'i-lucide-circle-slash-2' }];
    
  } else if (Array.isArray(jsonItem)) {
    const children = [];
    for (const arrayItem of Array.from(jsonItem)) {

      const treeItems = jsonToTreeItem(arrayItem);
      if (Object.prototype.toString.call(treeItems) === '[object Object]') {
        children.push(treeItems);
        
      } else {
        // Whenever the types are: string, number, null or bool.
        // We always return array of TreeItem.
        // We then need to return single TreeItem for the children.
        // example: {"name": ["programmer"]} 
        // results: {"label": "name", "children": [ {"label": "programmer"} ]}
        for (const innerItem of treeItems) {
          children.push(innerItem);
        }
      }
    }
    return children;

  } else {
    const children = [];
    for (const key of Object.keys(jsonItem)) {
      const value = (jsonItem as Record<string, any>)[key];

      let label = key;
      let suffix = '';
      let icon = 'i-boxicons-key';

      if (Object.prototype.toString.call(value) === '[object Object]') {
        icon = 'i-boxicons-bracket-curly';
        suffix = `(${Object.keys(value).length} keys)`
      }
      else if (Array.isArray(value)) {
        icon = 'i-boxicons-bracket';
        suffix = `(${value.length} items)`
      }
      else {
        icon = 'i-boxicons-key';
      }
      
      label = label + ' ' + suffix;
      
      children.push({ label, icon, children: jsonToTreeItem(value) });
    }
    return children;
  }
}

const parsedJson = JSON.parse(props.json);
const items = ref<TreeItem[]>(jsonToTreeItem(parsedJson));

</script>

<template>
  <UTree :items="items" />
</template>
