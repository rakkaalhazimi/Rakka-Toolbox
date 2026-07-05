<script lang="ts" setup>
  definePageMeta({
     middleware: async (to) => {
      // console.log('Code from: ', to.params.code);
      // console.log(to.params.code);
      const destinationTest = 'https://youtube.com';
      
      const { data } = await useFetch(`/api/url-shorthener/redirect?code=${to.params.code}`);
      const destination = data.value?.url;
      console.log(data.value?.url);
      
      if (!destination) {
        throw showError({
          status: 404,
          statusText: 'Page not found',
        });
      }
      
      navigateTo(destination, {redirectCode: 302, external: true});
     }
  });
</script>

<template>
</template>