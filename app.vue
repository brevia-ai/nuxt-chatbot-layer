<template>
  <ElementLoader v-if="isBusy" />
  <ChatZone v-else :collection />
</template>

<script lang="ts" setup>
const isLoading = ref(true);
const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);
const input = ref<HTMLElement | null>(null);

onBeforeMount(async () => {
  const uuid = '';
  isBusy.value = true;
  const data = await $fetch(`/api/brevia/collections?uuid=${uuid}`);
  collection.value = data;
  isBusy.value = false;
});

watch(isBusy, (val) => {
  if (!val) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});
</script>
