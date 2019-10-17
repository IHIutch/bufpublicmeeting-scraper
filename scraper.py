import scrapy
import copy


class MeetingsSpider(scrapy.Spider):

    name = "meetings"
    start_urls = [
        'http://buffalony.iqm2.com/Citizens/Calendar.aspx'
    ]

    id = ''

    # def parse_meeting(self, response):
    #     self.obj[self.id]['downloads'] = []
    #     for download in response.css('div#ContentPlaceholder1_pnlDownloads'):
    #         linkUrl = download.css('a.Link::attr(href)').get()
    #         linkText = download.css('a.Link::text').get()
    #         self.obj[self.id]['downloads'].append({
    #             'linkText': linkUrl,
    #             'linkUrl': linkText
    #         })

    # self.obj[self.id]['minutes'] = {
    #     'linkText': response.css('a.Link::attr(href)')
    #     'linkUrl': response.css('a.Link::text')
    # }

    def parse(self, response):

        for meeting in response.css('div.MeetingRow'):
            meetingLink = meeting.css(
                'div.RowTop div.RowLink a::attr(href)').get()
            self.id = meetingLink.split('ID=')[1]

            obj = {}

            obj['meetingId'] = self.id

            obj['meetingLink'] = meetingLink

            obj['date'] = meeting.css(
                'div.RowTop div.RowLink a::text').get()

            obj['details'] = meeting.css(
                'div.RowTop div.RowLink a::attr(title)').get()

            meetingTypeGroup = meeting.css(
                'div.RowBottom div.RowDetails::text').get()

            obj['meetingGroup'] = meetingTypeGroup.split(' - ')[0]

            obj['meetingType'] = meetingTypeGroup.split(' - ')[1]

            obj['links'] = []

            for link in meeting.css('div.MeetingLinks'):
                linksText = link.css('div a::text').getall(),
                linksUrl = link.css('div a::attr(href)').getall()

            count = 0
            for link in linksText[0]:
                obj['links'].append({
                    'linkText': linksText[0][count] if linksText[0] else '',
                    'linkUrl': linksUrl[count] if linksUrl[0] else '',
                })
                count += 1

                # obj[self.id]['links'].append(temp)

            # if meetingLink is not None:
            #     yield response.follow(
            #         meetingLink, callback=self.parse_meeting)

            yield {
                self.id: obj
            }

# Run with `scrapy runspider scraper.py -t json -o - > src/data/meetings.json` in the terminal
