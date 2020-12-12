const { writeFileSync } = require('fs')
const { resolve } = require('path')

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const write = (path, contents) => writeFileSync(path, contents, 'utf-8')

const days = Array.from(Array(365)).map((_, index) => {
  const baseDate = new Date(2021, 0, 1)
  baseDate.setDate(baseDate.getDate() + index)
  const date = baseDate.toISOString().slice(0, 10)
  return { date, amount: random(0, 65) }
})

write(resolve(__dirname, './data.json'), JSON.stringify(days))
