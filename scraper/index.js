const fs = require('fs')
const puppeteer = require('puppeteer')

;(async () => {
  const url =
    'http://buffalony.iqm2.com/Citizens/Calendar.aspx?From=1/1/2021&To=12/31/2021'
  const browser = await puppeteer.launch({
    // headless: false,
  })
  const page = await browser.newPage()

  await page.goto(url)
  await page.waitForSelector('#ContentPlaceholder1_pnlMeetings')

  const meetings = await page.$$eval('.Row.MeetingRow', (meeting) => {
    return meeting.map((el) => {
      const path = el.querySelector('.RowLink a').href
      const id = path.split('ID=')[1]

      const dataDetailsEl = el.querySelector('.RowTop .RowLink a')
      const date = dataDetailsEl.textContent
      const details = dataDetailsEl.getAttribute('title')

      const groupTypeEl = el.querySelector('.RowBottom .RowDetails')
      const [group, type] = groupTypeEl.textContent.split(' - ')

      const links = Array.from(el.querySelectorAll('.MeetingLinks a')).map(
        (el) => {
          return {
            text: el.textContent,
            path: el.href,
          }
        }
      )

      return {
        id,
        path,
        date,
        details,
        group,
        type,
        links,
      }
    })
  })

  // Save extracted items to a file.
  await fs.writeFile(
    './data/meetings.json',
    JSON.stringify(meetings, null, 2),
    (err) => (err ? console.log(err) : null)
  )

  await browser.close()
})()
