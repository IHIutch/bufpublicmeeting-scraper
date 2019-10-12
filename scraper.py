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

    def parse_meeting(self, response):
        meetingTitle = response.css(
            'span#ContentPlaceholder1_lblMeetingGroup::text').get()

        return {'meetingTitle': meetingTitle}

    def parse(self, response):
        for meeting in response.css('div.MeetingRow'):
            links = []
            meetingLink = meeting.css(
                'div.RowTop div.RowLink a::attr(href)').get()
            date = meeting.css('div.RowTop div.RowLink a::text').get()
            details = meeting.css(
                'div.RowTop div.RowLink a::attr(title)').get()
            subject = meeting.css('div.RowBottom div.RowDetails::text').get()
            linkText = meeting.css(
                'div.MeetingLinks div a::text').getall()
            linkHref = meeting.css(
                'div.MeetingLinks div a::attr(href)').getall()

            links.append({
                'text': linkText,
                'link': linkHref
            })

            if meetingLink is not None:
                yield response.follow(
                    meetingLink, callback=self.parse_meeting)

            yield {
                'meetingLink': meetingLink,
                'date': date,
                'details': details,
                'subject': subject,
                'links': links,
            }

# Run with `scrapy runspider scraper.py -t json -o - > src/data/meetings.json` in the terminal
