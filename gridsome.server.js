// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function(api) {
  api.loadSource(actions => {
    const MeetingsData = require("./src/data/meetings.json");

    const contentType = actions.addCollection({
      typeName: "Meeting"
    });

    MeetingsData.forEach(meeting => {
      let key = Object.keys(meeting)[0];
      meeting[key]["id"] = meeting[key].meetingId;
      meeting[key]["meetingGroup"] = [
        {
          value: meeting[key]["meetingGroup"]
            .split(" ")
            .join("-")
            .toLowerCase(),
          text: meeting[key]["meetingGroup"]
        }
      ];
      meeting[key]["meetingType"] = [
        {
          value: meeting[key]["meetingType"]
            .split(" ")
            .join("-")
            .toLowerCase(),
          text: meeting[key]["meetingType"]
        }
      ];
      meeting[key]["date"] = new Date(meeting[key]["date"]);

      // console.log(meeting[key]);

      contentType.addNode(meeting[key]);
    });
  }),
    api.createPages(({ createPage }) => {
      // Use the Pages API here: https://gridsome.org/docs/pages-api/
    });
};
