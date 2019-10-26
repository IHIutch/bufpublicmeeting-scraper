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
              <label
                class="cursor-pointer hover:underline flex items-center py-1"
              >
                <input
                  class="mr-2"
                  type="radio"
                  name="sorting"
                  :value="{ value: 'date', direction: 'asc' }"
                  v-model="orderBy"
                  @change="updateRouteQuery()"
                />
                <span>Meeting Date (Asc)</span></label
              >
            </div>
            <div>
              <label
                class="cursor-pointer hover:underline flex items-center py-1"
              >
                <input
                  class="mr-2"
                  type="radio"
                  name="sorting"
                  :value="{ value: 'date', direction: 'desc' }"
                  v-model="orderBy"
                  @change="updateRouteQuery()"
                />
                <span>Meeting Date (Desc)</span></label
              >
            </div>
            <div>
              <label
                class="cursor-pointer hover:underline flex items-center py-1"
              >
                <input
                  class="mr-2"
                  type="radio"
                  name="sorting"
                  :value="{ value: 'meetingGroup.text', direction: 'asc' }"
                  v-model="orderBy"
                  @change="updateRouteQuery()"
                />
                <span>Meeting Name (Asc)</span></label
              >
            </div>
            <div>
              <label
                class="cursor-pointer hover:underline flex items-center py-1"
              >
                <input
                  class="mr-2"
                  type="radio"
                  name="sorting"
                  :value="{ value: 'meetingGroup.text', direction: 'desc' }"
                  v-model="orderBy"
                  @change="updateRouteQuery()"
                />
                <span>Meeting Name (Desc)</span></label
              >
            </div>
          </fieldset>
        </div>
        <div class="border rounded p-3 mb-4">
          <label
            for="showPrevious"
            class="cursor-pointer hover:underline flex items-center py-1"
          >
            <input
              class="mr-2 cursor-pointer"
              type="checkbox"
              name="showPrevious"
              id="showPrevious"
              :value="true"
              v-model="showPrevious"
            /><span>Show Past Meetings</span>
          </label>
        </div>
        <div class="border rounded p-3">
          <fieldset>
            <legend class="font-medium text-xl">Filter Meeting Type:</legend>
            <div v-for="(group, index) in filterGroups" :key="index">
              <label
                :for="index"
                class="cursor-pointer hover:underline flex items-center py-1"
              >
                <input
                  class="mr-2 cursor-pointer"
                  type="checkbox"
                  name="filtering"
                  :id="index"
                  :value="index"
                  v-model="filters"
                  @change="updateRouteQuery()"
                />
                <div>
                  <span class="mr-2">{{ group.text }}</span>
                  <span
                    class="text-white bg-blue-500 p-1 rounded-full text-xs font-medium"
                    >{{ group.values.length }}
                  </span>
                </div>
              </label>
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
              <g-link :to="meeting.path" class="hover:underline">
                {{ meeting.meetingGroup.text }} -
                {{ meeting.meetingType.text }}
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

<page-query>
query {
  allMeeting {
    edges {
      node {
        details,
        links{
          linkUrl,
          linkText
        }
        meetingGroup{
          text, 
          value
        },
        meetingType{
          text, 
          value
        },
        date,
        path
      }
    }
  }
}
</page-query>

<script>
import MeetingsData from "@/data/meetings.json";
import moment from "moment";
import _ from "lodash";

export default {
  name: "Index",
  metaInfo: {
    title: "Hello, world!"
  },
  data() {
    return {
      filters: [],
      showPrevious: false,
      orderBy: {}
    };
  },
  created() {
    this.orderBy = this.$route.query.orderBy
      ? {
          value: this.$route.query.orderBy[0],
          direction: this.$route.query.orderBy[1]
        }
      : { value: "date", direction: "asc" };
    this.filters = this.$route.query.filters ? this.$route.query.filters : [];
  },
  methods: {
    updateRouteQuery() {
      this.$router.replace({
        query: {
          filters: this.filters,
          orderBy: [this.orderBy.value, this.orderBy.direction]
        }
      });
    }
  },
  computed: {
    filterGroups() {
      let obj = {};
      this.$page.allMeeting.edges.forEach(meeting => {
        meeting = meeting.node;
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
      this.$page.allMeeting.edges.forEach(meeting => {
        arr.push(meeting.node);
      });
      if (!this.showPrevious) {
        arr = arr.filter(meeting => {
          return moment() < moment(meeting.date);
        });
      }
      if (this.filters.length > 0) {
        arr = arr.filter(meeting => {
          return this.filters.indexOf(meeting.meetingGroup.value) !== -1;
        });
      }
      arr = _.orderBy(arr, this.orderBy.value, this.orderBy.direction);
      return arr;
    }
  },
  filters: {
    moment(value) {
      return moment(value).format("MMMM D, YYYY - h:mmA");
    }
  }
};
</script>
