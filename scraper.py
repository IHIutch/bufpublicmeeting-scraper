import scrapy


class MeetingsSpider(scrapy.Spider):
    name = "meetings"
    start_urls = [
        'http://buffalony.iqm2.com/Citizens/Calendar.aspx'
    ]

    def parse(self, response):
        for meeting in response.css('div.MeetingRow'):
            yield {
                'date': meeting.css('div.RowTop div.RowLink a::text').get(),
                'details': meeting.css('div.RowTop div.RowLink a::attr(title)').get(),
                'subject': meeting.css('div.RowBottom div.RowDetails::text').get(),
                'links': meeting.css('div.MeetingLinks div a::text').getall(),
            }

# Run with `scrapy runspider scraper.py -o meetings.json` in the terminal
