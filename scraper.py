import scrapy
import logging

from scrapy.utils.log import configure_logging


class MeetingsSpider(scrapy.Spider):
    configure_logging(install_root_handler=False)
    logging.basicConfig(
        filename='log.txt',
        format='%(levelname)s: %(message)s',
        level=logging.INFO
    )

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

            obj['meetingType'] = meeting.css(
                'div.RowBottom div.RowDetails::text').get()

            obj['links'] = []

            for link in meeting.css('div.MeetingLinks'):
                obj['links'].append({
                    'linkText': link.css('div a::text').get(),
                    'linkUrl': link.css('div a::attr(href)').get()
                })
                # obj[self.id]['links'].append(temp)

            # if meetingLink is not None:
            #     yield response.follow(
            #         meetingLink, callback=self.parse_meeting)

            yield {
                self.id: obj
            }

# Run with `scrapy runspider scraper.py -t json -o - > src/data/meetings.json` in the terminal
