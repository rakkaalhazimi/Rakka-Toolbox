<script lang="ts" setup>
  import allianceJson from '~/assets/arknights-stronghold/alliance.json';
  import { type Alliance, type Operator, AllianceCount, AllianceEnum } from '~/types/arknights';
  
  
  const allianceDir = '/arknights-protocol/alliances';
  const operatorDir = '/arknights-protocol/operators-II';
  
  const maxOperatorDeploy = 8;
  const allianceIconSizePx = 45;
  const operatorIconSizePx = 90;
  
  const alliances = allianceJson as Alliance[];
  
  const currentAliance = ref<AllianceEnum>(AllianceEnum.YAN);
  const selectedOperators = ref<Operator[]>([]);
  
  
  function getAllianceByName(name: AllianceEnum) {
    const index = alliances.findIndex((item, _) => item.name === name);
    return alliances[index];
  }
  
  // Map Operator with Alliance
  // Ex: Grain Buds => [Yan, Agile]
  const operatorMap = computed(() => {
    const map = new Map<string, AllianceEnum[]>();
    
    for (const item of alliances) {
      for (const operator of item.operators) {
        
        if (!map.has(operator.name)) {
          map.set(operator.name, []);
        }
        
        map.get(operator.name)?.push(item.name);
      }
    }
    return map;
  });
  
  // Count all availables Alliances
  // Ex: 
  // Leizi, Grain Buds 
  // => 
  // {
  //  Yan: {count: 2, requiredToActivate: 3}, 
  //  Agile: {count: 1, requiredToActivate: 3}
  // }
  const alliancesCount = computed(() => {
    const listAlli = selectedOperators.value.flatMap(item => {
      const a = operatorMap.value.get(item.name);
      return a ?? [];
    });
    
    const count = listAlli.reduce<Record<AllianceEnum, AllianceCount>>((acc, curr) => {
      if (acc[curr]) {
        const currentCount = acc[curr];
        currentCount.count += 1;
      } else {
        const alli = getAllianceByName(curr);
        const alliCount = new AllianceCount();
        alliCount.requiredToActivate = alli?.operatorsToActivate || 1;
        alliCount.imageUrl = alli?.imageUrl || '';
        acc[curr] = alliCount;
      }
      return acc;
    }, {} as Record<AllianceEnum, AllianceCount>);
  
  // Sort by the most alliance count first
  const sortedCount = Object.fromEntries(
    Object.entries(count).sort((a, b) => b[1].count - a[1].count)
  );
    
    return sortedCount;
  });
  
  
  const handleChangeAlliance = (name: AllianceEnum) => {
    currentAliance.value = name;
  };
  
  const handleDeselectOperator = (operator: Operator) => {
    selectedOperators.value = selectedOperators.value.filter((item) => item.name !== operator.name);
  };
  
  const handleChooseOperator = (operator: Operator) => {
    const exist = selectedOperators.value.find((item) => item.name === operator.name);
    if (exist) {
      handleDeselectOperator(operator);
      return;
    }
    if (selectedOperators.value.length >= maxOperatorDeploy) return;
    selectedOperators.value.push(operator);
  };
  
  const handleClearOperators = () => {
    selectedOperators.value = [];
  };

</script>

<template>
  
  <UContainer>
    
    <!-- Activated Alliances -->
    <h3 class="mt-2 text-left">Active Alliances</h3>
    <div class="
      overflow-x-scroll no-scrollbar 
      flex gap-x-8 my-2 mx-auto max-w-md h-[80px]
    ">
      <AllianceSegments
        v-for="(value, key) in alliancesCount"
        :key="key"
        :segments="value.requiredToActivate" 
        :completed="value.count" 
        :imageUrl="`${allianceDir}/${value.imageUrl}`"
        :name="key"
        class="shrink-0"
      />
    </div>
    
    <USeparator />
    
    <!-- Choosen Operators -->
    <div class="my-4">
      <h3 class="mb-2 text-left">Choosen Operators</h3>
      <div class="grid grid-cols-4 gap-2 mx-auto mb-4 max-w-md">
        <div 
          v-for="(_, index) in maxOperatorDeploy" 
          :key="index"
          class="
            aspect-square 
            flex justify-center items-center 
            bg-neutral-500
          "
          :class="{'cursor-pointer': selectedOperators[index]}"
        >
          <template v-if="selectedOperators[index]">
            <img 
              :src="`${operatorDir}/${selectedOperators[index].imageUrl}`"
              :alt="selectedOperators[index].name"
              @click="() => handleDeselectOperator(selectedOperators[index]!)"
            />
          </template>
        </div>
      </div>
      <UButton 
        variant="outline"
        color="error"
        class="block mx-auto cursor-pointer"
        @click="handleClearOperators"
      >
        Clear
      </UButton>
    </div>
    
    <USeparator />
    
    <!-- Alliances -->
    <h3 class="mt-4 mb-2 text-left">Alliances</h3>
    <ul class="overflow-x-scroll no-scrollbar flex items-center gap-2 mb-4 h-[80px]">
      <li v-for="item in alliances" class="shrink-0">
        <img
          :key="item.name"
          :alt="item.imageUrl"
          :src="`${allianceDir}/${item.imageUrl}`"
          :width="allianceIconSizePx"
          :height="allianceIconSizePx"
          class="rounded-full bg-neutral-700 cursor-pointer"
          :class="{'outline-2 outline-primary/75': item.name === currentAliance}"
          @click="() => handleChangeAlliance(item.name)"
        /> 
      </li>
    </ul>
    
    <!-- Alliances Content -->
    <ul class="flex flex-col gap-y-2">
      <template v-for="item in alliances" :key="item.name">
        <li v-show="item.name === currentAliance">
          <!-- Alliances Summary -->
          <!-- <h3>{{ item.name }}</h3> -->
          <UAccordion :items="[{label: item.name, ...item}]">
            <template #content="{ item }">
              <p class="text-sm whitespace-pre-line">{{ item.desc }}</p>
            </template>
          </UAccordion>
          
          <!-- <p class="whitespace-pre-line">{{ item.desc }}</p> -->
          
          <!-- Operators -->
          <ul class="grid grid-cols-4 gap-2">
            <li 
              v-for="operator in item.operators" 
              class="aspect-square flex justify-center items-center"
            >
              <img
                :key="operator.name"
                :alt="operator.name"
                :src="`${operatorDir}/${operator.imageUrl}`"
                :width="operatorIconSizePx"
                :height="operatorIconSizePx"
                class="bg-blue-400 cursor-pointer"
                @click="() => handleChooseOperator(operator)"
              />
            </li>
          </ul>
          
        </li>
        
      </template>
    </ul>
    
  </UContainer>
  
  
</template>