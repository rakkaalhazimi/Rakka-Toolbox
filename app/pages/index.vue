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
            spotlight
            to="/url-shorthener"
          />

          <UPageCard
            title="Audio Trimmer"
            description="Trim and cut audio files with precision. Remove unwanted sections and save your edited audio easily."
            icon="i-lucide-audio-lines"
            highlight
            spotlight
            to="/audio-trimmer"
          />

          <UPageCard
            title="JSON Viewer"
            description="Visualize and format your JSON data with ease. Paste and explore structured data beautifully."
            icon="i-lucide-braces"
            to="/json-viewer"
          />

          <UPageCard
            title="T-shirt Mockup"
            description="Create realistic custom T-shirt that match with your logo."
            icon="i-lucide-shirt"
            to="/tshirt-mockup"
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
