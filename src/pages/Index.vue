<template>
  <Layout>
    <div
      class="border rounded p-4 mb-4"
      v-for="(meeting, idx) in meetings"
      :key="idx"
    >
      <div class="flex">
        <div>
          <h1 class="h3">{{ meeting.subject }}</h1>
        </div>
      </div>
      <div class="flex mb-3">
        <div>
          <span class="text-muted font-weight-bold">
            {{ meeting.date }}
          </span>
        </div>
        <div class="d-flex align-items-center justify-content-end flex-grow-1">
          <a
            href="#"
            class="inline-flex px-2"
            v-for="(link, idx) in meeting.links"
            :key="idx"
          >
            {{ link }}
          </a>
        </div>
      </div>
      <p v-html="meeting.details"></p>
    </div>
  </Layout>
</template>

<script>
import Meetings from "@/data/meetings.json";

export default {
  metaInfo: {
    title: "Hello, world!"
  },
  data() {
    return {
      meetings: Meetings
    };
  }
};
</script>
