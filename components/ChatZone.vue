<template>
  <div ref="headerSlot">
    <slot name="chatbot-header">
      <!--Fallback-->
      <button class="absolute z-50 bg-primary text-white rounded-md p-2 hover:border-white border-2 border-transparent right-2 top-2" @click="refreshChat">
        <Icon name="ph:arrow-counter-clockwise-bold" class="text-white hover:transform hover:-rotate-180 duration-300" height="25" width="25" />
      </button>
    </slot>
  </div>
  <div v-if="dialog">
    <div ref="dialogZone" class="pt-6 pb-4 space-y-3 h-dynamic sm:h-dynamic-sm px-4 sm:px-6 w-full overflow-y-auto">
      <div class="flex flex-col space-y-6 pb-4">
        <div
          v-for="(item, i) in dialog"
          :key="i"
          class="chat-balloon space-y-2"
          :class="{
            'bg-danger text-white': item.error,
            'chat-balloon-right': item.who == userNick,
            'chat-balloon-left': item.who != userNick,
          }"
          @mouseover="
            showResponseMenu = true;
            hovered = i;
          "
          @mouseleave="showResponseMenu = false"
        >
          <div class="flex space-x-3 justify-between">
            <p class="text-base uppercase font-bold">{{ item.who }}</p>
            <div class="chat-balloon-status" :class="{ busy: isBusy && i === dialog.length - 1 }" />
          </div>
          <div class="break-words rich-text" v-html="formatResponse(item.message, responseFormat)" />
          <!--MENU DI AZIONI CHAT -->
          <div
            v-if="chatActions && !isBusy && showResponseMenu && hovered === i && hovered != 0 && item.who != userNick && !item.error"
            class="bg-neutral-600 px-2 py-0.5 absolute -bottom-5 right-4 z-50 rounded-md flex flex-row"
          >
            <div class="px-1.5 pb-1" :class="item.evaluation == null ? 'hover:bg-neutral-500 hover:rounded-md cursor-pointer' : ''">
              <Icon v-if="item.evaluation == true" name="ph:thumbs-up-fill" class="text-[--color-text-success]" />
              <Icon v-else-if="item.evaluation == false" name="ph:thumbs-down-fill" class="text-[--color-text-error]" />
              <Icon v-else name="ph:thumbs-up-fill" class="text-white" @click="openFeedback(item, true)" />
            </div>
            <div v-if="item.evaluation == null" class="px-1.5 pb-1 hover:bg-neutral-500 hover:rounded-md cursor-pointer">
              <Icon name="ph:thumbs-down-fill" class="text-white" @click="openFeedback(item, false)" />
            </div>
            <slot name="extra-icons" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="space-y-2 bottom-3 left-0 absolute px-4 grow w-full bg-transparent overflow-hidden">
    <!-- SUGGESTED QUESTIONS -->
    <div v-if="exampleQuestions?.length != 0" class="flex flex-row grow max-h-24 gap-x-2 justify-start overflow-x-auto overflow-y-hidden w-auto">
      <button
        v-for="(q, i) in exampleQuestions"
        :key="i"
        class="button bg-primary text-white whitespace-nowrap rounded-md p-2 hover:opacity-90 disabled:cursor-wait"
        :disabled="isBusy || messagesLeft == 0"
        @click="submitExample(q)"
      >
        {{ q }}
      </button>
    </div>
    <div class="flex space-x-2">
      <input
        ref="input"
        v-model.trim="prompt"
        type="text"
        class="grow text-lg p-2 rounded border border-neutral-800 disabled:bg-neutral-100 disabled:border-neutral-300 shadow-md disabled:shadow-none"
        :disabled="isBusy || messagesLeft == 0"
        @keydown.enter="submit"
      />
      <button class="bg-primary text-white rounded-md px-4 py-2 hover:opacity-85 disabled:cursor-wait" :disabled="isBusy || messagesLeft == 0" @click="submit">
        <Icon name="ph:paper-plane-right-fill" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { formatResponse, llmResponseFormat } = useResponseFormat();

const props = defineProps({
  collection: {
    type: Object as PropType<{ name?: string; uuid?: string; cmetadata?: any }>,
    default: () => ({ name: '', uuid: '', cmetadata: {} }),
  },
  isDemoChatbot: { type: Boolean, default: false },
  isEmbedded: { type: Boolean, default: false },
  startMessage: { type: String, default: '' },
  exampleQuestions: { type: Array as PropType<string[]>, default: () => [] },
  maxMessages: { type: Number, default: 0 },
  chatActions: { type: Boolean, default: true },
  userNick: { type: String, default: 'YOU' },
  botName: { type: String, default: 'ASSISTANT' },
});

interface DialogItem {
  who: string;
  message: string;
  evaluation: any;
  uuid: string;
  error: boolean;
}

const headerSlot = ref();
const headerHeight = ref(0);
const dialogZone = ref();
const isBusy = ref(false);
const prompt = ref('');
const input = ref<HTMLElement | null>(null);
const dialog = ref<DialogItem[]>([]);
const docs = ref<any>([]);
const historyId = ref('');
const canSeeDocs = ref(false);
const session = useCookie('session');
const messagesLeft = ref(props.maxMessages || 100);
let docsJsonString = '';
let responseEnded = false;
let currIdx = 0;

const hovered = ref(-1);
const showResponseMenu = ref(true);

let collectionName = '';
const responseFormat = ref('text');

onBeforeMount(async () => {
  if (props.startMessage) {
    dialog.value.push(formatDialogItem(props.botName, props.startMessage, null, ''));
  }
  collectionName = props.collection.name || '';
  responseFormat.value = llmResponseFormat(props.collection.cmetadata?.qa_completion_llm);
  if (session.value) {
    await loadPreviousMessages(session.value);
  } else {
    session.value = crypto.randomUUID();
  }
  isBusy.value = false;
});

onMounted(() => {
  nextTick(() => dialogZone.value.scrollTo({ top: dialogZone.value.scrollHeight, behavior: 'smooth' }));
  if (headerSlot) {
    headerHeight.value = headerSlot.value.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${headerHeight.value}px`);
  }
});

watch(isBusy, (val) => {
  if (!val) {
    setTimeout(() => {
      input.value?.focus();
    }, 100);
  }
});

watch(messagesLeft, (newVal) => {
  if (newVal <= 0) {
    dialog.value.push(formatDialogItem(props.botName, 'Hai esaurito il numero di messaggi per questa sessione', null, undefined, true));
  }
});

// methods
const formatDialogItem = (who: string, message: string, evaluation: any, uuid = '', error = false): DialogItem => {
  return {
    who,
    message,
    evaluation,
    uuid,
    error,
  };
};

const submit = async () => {
  if (!prompt.value) return;

  isBusy.value = true;
  nextTick(() => dialogZone.value.scrollTo({ top: dialogZone.value.scrollHeight, behavior: 'smooth' }));
  dialog.value.push(formatDialogItem(props.userNick, prompt.value, null));
  dialog.value.push(formatDialogItem(props.botName, '', null));
  currIdx = dialog.value.length - 1;

  try {
    await streamingFetchRequest();
    if (props.maxMessages) {
      messagesLeft.value = messagesLeft.value - 1;
    }
    isBusy.value = false;
  } catch (error) {
    isBusy.value = false;
    showErrorInDialog(currIdx);
    console.log(error);
  }
};

const streamingFetchRequest = async () => {
  const question = prompt.value;
  prompt.value = '';
  docs.value = [];
  historyId.value = '';
  docsJsonString = '';
  responseEnded = false;
  canSeeDocs.value = false;
  const response = await fetch('/api/brevia/chat', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'X-Chat-Session': session.value || '',
    },
    body: JSON.stringify({
      question,
      collection: collectionName,
      source_docs: true,
      streaming: true,
    }),
  });

  const reader = response?.body?.getReader();
  if (reader) {
    for await (const chunk of readChunks(reader)) {
      const text = new TextDecoder().decode(chunk);
      handleStreamText(text);
    }
    parseDocsJson();
  }
};

const readChunks = (reader: ReadableStreamDefaultReader) => {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
};

const handleStreamText = (text: string) => {
  if (text.includes('[{"chat_history_id":') || text.includes('[{"page_content":')) {
    const idx1 = text.indexOf('[{"chat_history_id":');
    const idx2 = text.indexOf('[{"page_content":');
    const idx = Math.max(idx1, idx2);
    dialog.value[currIdx].message += text.slice(0, idx);
    responseEnded = true;
    docsJsonString += text.slice(idx);
  } else if (responseEnded) {
    docsJsonString += text;
  } else if (text.startsWith('{"error":')) {
    try {
      const err = JSON.parse(text);
      console.error(`Error response from API "${err?.error}"`);
      showErrorInDialog(currIdx);
    } catch (e) {
      return console.error(e);
    }
  } else {
    dialog.value[currIdx].message += text;
    nextTick(() => dialogZone.value.scrollTo({ top: dialogZone.value.scrollHeight, behavior: 'smooth' }));
  }
};

const parseDocsJson = () => {
  try {
    if (!docsJsonString) {
      console.error('No docs found in response');
      dialog.value[currIdx].error = true;
      return;
    }
    const parsed = JSON.parse(docsJsonString);
    if (parsed?.[0]?.chat_history_id) {
      const item = parsed?.shift() || {};
      historyId.value = item?.chat_history_id || '';
    }
    docs.value = parsed;
    canSeeDocs.value = true;
  } catch (e) {
    return console.error(e);
  }
};

const showErrorInDialog = (index: number) => {
  const dialogItem = formatDialogItem(props.botName, 'Qualcosa è andato storto', true);

  if (index) {
    dialog.value[index] = dialogItem;
    return;
  }

  dialog.value.push(dialogItem);
};

const submitExample = (question: string) => {
  if (messagesLeft.value <= 0) {
    return;
  }
  prompt.value = question;
  submit();
};

const loadPreviousMessages = async (id: any) => {
  try {
    const data: any = await $fetch(`/api/brevia/chat_history?session_id=${id}&collection=${collectionName}`);
    const loadedDialog: DialogItem[] = [];
    for (let i = data.data.length - 1; i >= 0; i--) {
      loadedDialog.push(formatDialogItem(props.userNick, data.data[i].question, data.data[i].user_evaluation, data.data[i].uuid));
      loadedDialog.push(formatDialogItem(props.botName, data.data[i].answer, data.data[i].user_evaluation, data.data[i].uuid));
    }
    dialog.value.push(...loadedDialog);
    const mUsed = dialog.value.filter((el) => el.who == props.userNick).length;
    if (props.maxMessages) {
      messagesLeft.value = props.maxMessages - mUsed;
    }
  } catch (error) {
    console.error(error);
  }
};

const refreshChat = () => {
  session.value = crypto.randomUUID();
  dialog.value = [];
  if (props.startMessage) {
    dialog.value.push(formatDialogItem(props.botName, props.startMessage, null, ''));
  }
  if (props.maxMessages) {
    messagesLeft.value = props.maxMessages;
  }
};

defineExpose({
  refreshChat,
});

const openFeedback = (item: any, evaluation: boolean) => {
  // TBD - remove console.log
  console.log(item, evaluation);
};
</script>
