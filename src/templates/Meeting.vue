<template>
  <Layout>
    <main role="main">
      <h1 class="text-3xl">{{ title }}</h1>
      <div>{{ $page.meeting.date | dayjs }}</div>
      <div>{{ $page.meeting.details }}</div>
      <ul class="list-disc pl-4">
        <li v-for="(link, index) in $page.meeting.internalLinks" :key="index">
          <a
            class="text-teal-700 hover:text-teal-900 hover:underline"
            :href="link.linkUrl"
          >
            {{ link.linkText }}
          </a>
        </li>
      </ul>
    </main>
  </Layout>
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
  metaInfo() {
    return {
      title: this.title,
    };
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
