const { writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')
const pug = require('pug')

const read = (path) => readFileSync(path, 'utf-8')
const write = (path, contents) => writeFileSync(path, contents, 'utf-8')

const days = Array.from(Array(365)).map((_, index) => {
  const baseDate = new Date(2021, 0, 1)
  baseDate.setDate(baseDate.getDate() + index)
  const date = baseDate.toISOString().slice(0, 10)
  return { date, amount: (index % 5) * 15 }
})

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

const html = pug.renderFile(resolve(__dirname, './index.pug'), {
  self: true,
  days,
  getCellColorClasses,
  legend,
})
// console.log(html)
write(resolve(__dirname, '../build/index.html'), html)
console.log('HTML successfully generated.')
