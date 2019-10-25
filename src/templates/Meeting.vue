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
  query Meeting ($path: String) {
    meeting (path: $path) {
      id,
      internalLinks{
        linkText,
        linkUrl
      }
    }
  }
</page-query>

<script>
export default {
  name: "MeetingTemplate",
  data() {
    return {};
  }
};
</script>
