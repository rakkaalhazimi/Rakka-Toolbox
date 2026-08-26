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
    
    return count;
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
    <div class="flex flex-wrap gap-2">
      <AllianceSegments
        v-for="(value, key) in alliancesCount"
        :key="key"
        :segments="value.requiredToActivate" 
        :completed="value.count" 
        :imageUrl="`${allianceDir}/${value.imageUrl}`" />
    </div>
    
    <!-- Choosen Operators -->
    <div class="grid grid-cols-4 gap-2 max-w-md">
      <div 
        v-for="(_, index) in maxOperatorDeploy" 
        :key="index"
        class="
          aspect-square 
          flex justify-center items-center 
          bg-primary
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
      variant="solid"
      @click="handleClearOperators"
    >
      Clear
    </UButton>
    
    <!-- Alliances -->
    <ul class="flex flex-wrap gap-2">
      <li v-for="item in alliances" class="shrink-0">
        <img
          :key="item.name"
          :alt="item.imageUrl"
          :src="`${allianceDir}/${item.imageUrl}`"
          :width="allianceIconSizePx"
          :height="allianceIconSizePx"
          class="bg-red-400 cursor-pointer"
          @click="() => handleChangeAlliance(item.name)"
        /> 
      </li>
    </ul>
    
    <!-- Alliances Content -->
    <ul class="flex flex-col gap-y-2">
      <template v-for="item in alliances" :key="item.name">
        <li v-if="item.name === currentAliance">
          <!-- Alliances Summary -->
          <h3>{{ item.name }}</h3>
          <p class="whitespace-pre-line">{{ item.desc }}</p>
          
          <!-- Operators -->
          <ul class="flex flex-wrap gap-2">
            <li v-for="operator in item.operators" class="shrink-0">
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