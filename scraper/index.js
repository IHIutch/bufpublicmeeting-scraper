const fs = require('fs')
const puppeteer = require('puppeteer')

;(async () => {
  const getInnerPageData = (path) =>
    new Promise((resolve, reject) => {
      try {
        ;(async () => {
          const newPage = await browser.newPage()
          await newPage.goto(path)

          // Debug
          newPage.on('console', (msg) => {
            for (let i = 0; i < msg._args.length; ++i)
              console.log(`${i}: ${msg._args[i]}`)
          })

          if (!(await newPage.$('table#MeetingDetail'))) resolve([])

          const internalLinks =
            (await newPage.$$eval(
              'table#MeetingDetail tr td.Title a',
              (rows) => {
                return rows.map((el) => {
                  // console.log(el.innerHTML)
                  return {
                    text: el.textContent,
                    path: el.href,
                  }
                })
              }
            )) || null
          resolve(internalLinks)
          await newPage.close()
        })()
      } catch (err) {
        reject(err)
      }
    })

  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  const url =
    'http://buffalony.iqm2.com/Citizens/Calendar.aspx?From=1/1/2021&To=12/31/2021'

  await page.goto(url)
  try {
    await page.waitForSelector('#ContentPlaceholder1_pnlMeetings')
  } catch (err) {
    console.log(err)
  }

  // Debug
  page.on('console', (msg) => {
    for (let i = 0; i < msg._args.length; ++i)
      console.log(`${i}: ${msg._args[i]}`)
  })

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

  for (const idx in meetings) {
    // console.log(idx)
    meetings[idx].internalLinks = await getInnerPageData(meetings[idx].path)
  }

  // Save extracted items to a file.
  await fs.writeFile(
    './data/meetings.json',
    JSON.stringify(meetings, null, 2),
    (err) => (err ? console.log(err) : null)
  )

  await browser.close()
})()
