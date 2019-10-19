<template>
  <Layout>
    <aside class="w-1/4 sticky top-0 h-screen overflow-y-scroll px-3">
      <div class="my-5">
        <h2 class="font-medium text-2xl mb-2">
          Sorting &amp; Filters
        </h2>
        <div class="border rounded p-3 mb-4">
          <fieldset>
            <legend class="font-medium text-xl">Sort by:</legend>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Name (Asc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Name (Desc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Date (Asc)</label>
            </div>
            <div>
              <input type="radio" name="sorting" />
              <label>Meeting Date (Desc)</label>
            </div>
          </fieldset>
        </div>
        <div class="border rounded p-3">
          <fieldset>
            <legend class="font-medium text-xl">Filter Meeting Type:</legend>
            <div v-for="(group, index) in filterGroups" :key="index">
              <input
                type="checkbox"
                name="filtering"
                :id="index"
                :value="index"
                v-model="filters"
              />
              <label :for="index" class="cursor-pointer hover:underline"
                >{{ group.text }}
              </label>
              <span
                class="text-white bg-blue-500 p-1 rounded-full text-xs font-medium"
                >{{ group.values.length }}
              </span>
            </div>
          </fieldset>
        </div>
      </div>
    </aside>
    <main class="w-3/4 ml-auto px-3">
      <div v-for="meeting in filteredMeetings" :key="meeting.meetingId">
        <div class="border rounded p-4 mb-4">
          <div class="flex">
            <h2 class="text-2xl font-medium">
              <g-link :to="meeting.meetingId" class="hover:underline">
                {{ meeting.meetingGroup.text }} - {{ meeting.meetingType }}
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
      </div>
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
      meetings: [],
      filters: []
    };
  },
  methods: {
    moment(value) {
      return moment(value);
    },
    shuffle() {
      this.filteredMeetings = _.shuffle(this.filteredMeetings);
    }
  },
  created() {
    MeetingsData.forEach(meeting => {
      let key = Object.keys(meeting)[0];
      meeting[key]["meetingGroup"] = {
        value: meeting[key]["meetingGroup"]
          .split(" ")
          .join("-")
          .toLowerCase(),
        text: meeting[key]["meetingGroup"]
      };
      this.meetings.push(meeting[key]);
    });
  },
  computed: {
    filterGroups() {
      let obj = {};
      this.meetings.forEach(meeting => {
        let groupIdx = meeting.meetingGroup.value;
        if (!Object.keys(obj).includes(groupIdx)) {
          obj[groupIdx] = {
            text: meeting.meetingGroup.text,
            values: []
          };
        }
        obj[groupIdx].values.push(meeting);
      });
      return obj;
    },
    filteredMeetings() {
      let arr = [];
      if (this.filters.length == 0) {
        arr = this.meetings.filter(meeting => {
          return moment() < moment(meeting.date);
        });
      } else {
        arr = this.meetings.filter(meeting => {
          return (
            this.filters.indexOf(meeting.meetingGroup.value) !== -1 &&
            moment() < moment(meeting.date)
          );
        });
      }
      return arr;
    }
  },
  filters: {
    moment(value) {
      return moment(value).format("MMMM D, YYYY");
    }
  }
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
