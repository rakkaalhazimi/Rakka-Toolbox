<script lang="ts" setup>
  import allianceJson from '~/assets/arknights-stronghold/alliance.json';
  import { type Alliance, type Operator, AllianceEnum } from '~/types/arknights';
  
  const allianceDir = '/arknights-protocol/alliances';
  const operatorDir = '/arknights-protocol/operators-II';
  
  const maxOperatorDeploy = 8;
  const allianceIconSizePx = 45;
  const operatorIconSizePx = 90;
  
  const alliances = allianceJson as Alliance[];
  
  const currentAliance = ref<AllianceEnum>(AllianceEnum.YAN);
  const selectedOperators = ref<Operator[]>([]);
  
  // Map Operator with Alliance
  // Ex: Grain Buds => [Yan, Agile]
  const allianceMap = computed(() => {
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
  // Ex: Leizi, Grain Buds => {Yan: 2, Agile: 1}
  const alliancesCount = computed(() => {
    const listAlli = selectedOperators.value.flatMap(item => {
      const a = allianceMap.value.get(item.name);
      return a ?? [];
    });
    
    const count = listAlli.reduce<Record<AllianceEnum, number>>((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<AllianceEnum, number>);
    
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
    {{ alliancesCount }}
    <img src="/arknights-protocol/alliances/Agile_Alliance.webp" />
    
    <div class="relative h-100">
      <div class="absolute arc-diff"></div>
    </div>
    
    <div class="relative h-100">
      <div class="absolute arc-segment"></div>
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

<style>
.arc {
  --a: 170deg; /* control the progression */
  width: 250px;
  aspect-ratio: 1;
  padding: 40px; /* the border thickness */
  box-sizing: border-box;
  border-radius: 50%;
  background: #c0d860;
  mask:
    linear-gradient(#0000 0 0) content-box intersect,
    conic-gradient(
      #0000 0deg 5deg,
      #000 5deg 175deg,
      #0000 175deg 185deg, 
      #000 185deg 355deg,
      #0000 355deg 360deg
    );
    /* conic-gradient(#000 var(--a),#0000 0); */
}

/* HTML: <div class="arc"></div> */
.arc-segment {
  --segments: 3;
  --gap: 4deg;
  --b: 10px;

  width: 250px;
  aspect-ratio: 1;
  padding: var(--b);
  box-sizing: border-box;
  border-radius: 50%;
  background: #c0d860;

  mask:
    linear-gradient(#0000 0 0) content-box intersect,
    repeating-conic-gradient(
      #aaa 0 calc(360deg / var(--segments) - var(--gap)),
      #0000 0 calc(360deg / var(--segments))
    );
}

.arc-diff {
  --b: 40px;
  --gap: 6deg;

  width: 250px;
  aspect-ratio: 1;
  padding: var(--b);
  box-sizing: border-box;
  border-radius: 50%;

  background: conic-gradient(
    #22c55e 0deg 114deg,
    transparent 114deg 120deg,

    #71717a 120deg 234deg,
    transparent 234deg 240deg,

    #71717a 240deg 354deg,
    transparent 354deg 360deg
  );

  mask:
    linear-gradient(#0000 0 0) content-box intersect,
    conic-gradient(
      #000 0deg 114deg,
      #0000 114deg 120deg,
      #000 120deg 234deg,
      #0000 234deg 240deg,
      #000 240deg 354deg,
      #0000 354deg 360deg
    );
}
</style>