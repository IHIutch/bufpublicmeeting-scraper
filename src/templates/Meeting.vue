<template>
  <div>
    <h1 class="text-3xl">{{ $page.meeting.id }}</h1>
    <div v-for="(link, index) in $page.meeting.internalLinks" :key="index">
      <a class="text-green-500 hover:underline" :href="link.linkUrl">{{
        link.linkText
      }}</a>
    </div>
  </div>
</template>

<page-query>
  query Meeting ($id: ID) {
    meeting (id: $id) {
      id,
      internalLinks{
        linkText,
        linkUrl
      }
    }
  }
</page-query>

<script>
import MeetingsData from "@/data/meetings.json";

export default {
  name: "MeetingTemplate",
  data() {
    return {};
  }
};
</script>
