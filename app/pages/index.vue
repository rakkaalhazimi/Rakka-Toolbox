<script lang="ts" setup>
  
</script>

<template>
  <div>
    <UPageHero
      title="Rakka Toolbox"
      description="Bunch of tools that Rakka use as Software Engineer."
    >
      <UContainer>
        <UPageGrid>
          <UPageCard
            title="URL Shortener"
            description="Generate clean, shareable short links with fast redirects and easy URL management."
            icon="i-lucide-link"
            highlight 
            spotlight
            to="/url-shorthener"
          />

          <UPageCard
            title="Coming Soon"
            description="A collection of text formatting and productivity utilities to speed up your everyday workflow."
            icon="i-lucide-wrench"
          />

          <UPageCard
            title="Coming Soon"
            description="More handy developer and utility tools are on the way. Stay tuned for future updates."
            icon="i-lucide-sparkles"
          />
        </UPageGrid>
      </UContainer>
    </UPageHero>
    
  </div>
</template>
