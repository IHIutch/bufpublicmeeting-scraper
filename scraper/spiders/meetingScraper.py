import scrapy
import copy


class MeetingsSpider(scrapy.Spider):

    name = "meetings"
    start_urls = [
        'http://buffalony.iqm2.com/Citizens/Calendar.aspx?From=1/1/1900&To=12/31/9999'
    ]

    id = ''

    def parse_meeting(self, response):
        obj = response.meta['obj']

        obj['internalLinks'] = []
        for download in response.css('table#MeetingDetail td.Title'):
            linksText = download.css('a::text').getall()
            linksUrl = download.css('a::attr(href)').getall()

            count = 0
            for link in linksText:
                obj['internalLinks'].append({
                    'linkText': linksText[count] if linksText[0] else '',
                    'linkUrl': linksUrl[count] if linksUrl[0] else '',
                })
                count += 1

        yield obj

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

            if meetingLink is not None:
                yield response.follow(
                    meetingLink, callback=self.parse_meeting, meta={'obj': obj})

# Run with `scrapy runspider scraper.py -t json -o - > src/data/meetings.json` in the terminal
