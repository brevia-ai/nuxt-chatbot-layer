<template>
  <div class="flex flex-col h-[100vh]">
    <ElementLoader v-if="isBusy" :loader-dim="56" class="mx-auto my-auto"/>
    <ChatZone v-else ref="chatZone"
      :collection="collection"
      :start-message="startMessage()"
      :example-questions="exampleQuestions()"
    >
      <div class="w-full">
        <div class="flex items-center justify-between space-x-1 sm:space-x-1">
          <button class="text-white" @click="chatZone.refreshChat()">
            <Icon name="ph:arrow-counter-clockwise-bold" class="text-white hover:transform hover:-rotate-180 duration-300" height="25" width="25" />
          </button>
        </div>
      </div>
    </ChatZone>
  </div>
</template>

<script lang="ts" setup>
const chatZone = ref();
const isLoading = ref(true);
const collection = ref<{ name?: string; uuid?: string; cmetadata?: any }>({});
const isBusy = ref(false);

const uuid = useRuntimeConfig().public.collectionUuid;
isBusy.value = true;
const data = await $fetch(`/api/brevia/collections?uuid=${uuid}`);
collection.value = data;
isBusy.value = false;

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});

const title = collection.value.cmetadata?.title || collection.value.name;

const startMessage = () => {
  return `Welcome to ${title}! Ask me anything about ${title}.`;
};

const exampleQuestions = () => {
  return [
    `What is ${title} about?`,
    `What are the topics covered in ${title}?`
  ];
};
</script>
