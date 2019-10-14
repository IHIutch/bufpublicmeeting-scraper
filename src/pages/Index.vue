<template>
  <Layout>
    <main v-for="(meeting, idx) in meetings" :key="idx">
      <template v-if="moment() < moment(meeting.date)">
        <div class="border rounded p-4 mb-4">
          <div class="flex">
            <h2 class="text-2xl font-medium">
              <g-link :to="meeting.meetingId" class="hover:underline">
                {{ meeting.meetingType }}
              </g-link>
            </h2>
          </div>
          <div class="flex mb-3">
            <div>
              <span class="text-muted font-weight-bold">
                {{ meeting.date | moment }}
              </span>
            </div>
          </div>
          <div>
            <div
              class="d-flex align-items-center justify-content-end flex-grow-1"
            >
              <a
                :href="link.linkUrl"
                class="inline-flex px-2 text-teal-700 hover:underline"
                v-for="(link, idx) in meeting.links"
                :key="idx"
              >
                {{ link.linkText }}
              </a>
            </div>
          </div>
          <p v-html="meeting.details"></p>
        </div>
      </template>
    </main>
  </Layout>
</template>

<script>
import MeetingsData from "@/data/meetings.json";
import moment from "moment";

export default {
  name: "Index",
  metaInfo: {
    title: "Hello, world!"
  },
  data() {
    return {
      meetings: []
    };
  },
  methods: {
    moment(value) {
      return moment(value);
    }
  },
  created() {
    MeetingsData.forEach(meeting => {
      let key = Object.keys(meeting)[0];
      // console.log(meeting[key]);
      this.meetings.push(meeting[key]);
    });
  },
  filters: {
    moment(value) {
      return moment(value).format("MMMM D, YYYY");
    }
  }
};
</script>
