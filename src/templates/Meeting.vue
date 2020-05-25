<template>
  <main role="main" class="container mx-auto">
    <h1 class="text-3xl">{{ title }}</h1>
    <div>{{ $page.meeting.date | dayjs }}</div>
    <div>{{ $page.meeting.details }}</div>
    <div v-for="(link, index) in $page.meeting.internalLinks" :key="index">
      <a class="text-green-500 hover:underline" :href="link.linkUrl">{{
        link.linkText
      }}</a>
    </div>
  </main>
</template>

<page-query>
  query Meeting ($path: String) {
    meeting (path: $path) {
      id,
      date,
      details,
      meetingGroup{
        text
      },
      meetingType{
        text
      },
      internalLinks{
        linkText,
        linkUrl
      }
    }
  }
</page-query>

<script>
import dayjs from "dayjs";

export default {
  name: "MeetingTemplate",
  data() {
    return {};
  },
  computed: {
    title() {
      return `${this.$page.meeting.meetingGroup.text} - ${
        this.$page.meeting.meetingType.text
      }`;
    },
  },
  filters: {
    dayjs(value) {
      return dayjs(value).format("MMMM D, YYYY - h:mmA");
    },
  },
};
</script>
