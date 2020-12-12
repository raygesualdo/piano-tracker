require('dotenv').config()
const { writeFileSync, existsSync: exists } = require('fs')
const { resolve } = require('path')
const pug = require('pug')

const write = (path, contents) => writeFileSync(path, contents, 'utf-8')

const formatDate = (isoDate) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getCellColorClasses = (time) => {
  if (!time) return 'bg-gray-100 border border-gray-300'
  if (time < 20) return 'bg-green-200'
  if (time < 40) return 'bg-green-400'
  if (time < 60) return 'bg-green-600'
  return 'bg-green-900'
}

const legend = [
  [0, 'No time recorded'],
  [15, 'Less than 20 minutes'],
  [30, 'Less than 40 minutes'],
  [45, 'Less than 60 minutes'],
  [60, '60 minutes or more'],
]

// Execute
;(async function () {
  const days = await getDays()
  const html = pug.renderFile(resolve(__dirname, './index.pug'), {
    self: true,
    days,
    getCellColorClasses,
    legend,
    formatDate,
  })
  write(resolve(__dirname, '../build/index.html'), html)
  console.log('HTML successfully generated.')
})()

async function getDays() {
  if (exists(resolve(__dirname, './data.json'))) {
    return require(resolve(__dirname, './data.json'))
  }
  return fetchData()
}

async function fetchData() {
  const url = process.env.DATASOURCE_URL
  try {
    const response = await getJSON(url)
    return response.values.map(([date, amount = 0]) => ({
      date,
      amount: Number.parseInt(amount, 10),
    }))
  } catch (error) {
    throw new Error(error)
  }
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const https = require('https')

    https.get(url, (res) => {
      res.setEncoding('utf8')
      let body = ''

      res.on('data', (data) => {
        body += data
      })

      res.on('end', () => {
        body = JSON.parse(body)
        resolve(body)
      })

      res.on('error', (err) => {
        reject(err)
      })
    })
  })
}
