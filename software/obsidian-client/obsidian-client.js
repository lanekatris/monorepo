const baseUrl = 'http://localhost:8080'

const config = {
  disableMonitors: 'disable-monitors',
  enableMonitors: 'enable-monitors',
  sleep: 'sleep',
  discList: 'disc-list',
  recentGymUsers: 'recent-gym-users',
  raindropIo: 'raindrop-io',
  deployObsidianClient: 'deploy-obsidian-client',
  udiscScorecards: 'udisc-scorecards',
}

const idk = {}

Object.keys(config).forEach(key => {
  const url = `${baseUrl}/${config[key]}`
  idk[key] = async ({ obsidian }) => {
    new obsidian.Notice(`Invoking ${key} with ${url}`)
    const result = await fetch(url);
    const text = await result.text()
    console.log(text)
    new obsidian.Notice(`Done ${key}`)
  }
})

idk.refreshAll = async ({ obsidian }) => {
  new obsidian.Notice(`Refreshing all.`)
  const commands = ['discList', 'recentGymUsers', 'raindropIo', 'udiscScorecards', 'deployObsidianClient']

  for (const command of commands) {
    await idk[command]({ obsidian })
  }

  new obsidian.Notice(`Done refreshing all.`)
}

idk.climbedToday = async (one,two,three,four) =>{
  console.log({one,two,three,four})
  const d = moment().format('YYYY-MM-DD')
  const path = `/Adventures/${d} Indoor Climbing.md`
  one.app.vault.create(path, `
---
title: Indoor Climbing
allDay: true
date: ${d}
completed: null
---

`)
}

idk.discGolfedToday = async (one,two,three,four) => {
  console.log({one,two,three,four})
  const d = moment().format('YYYY-MM-DD')
  const path = `/Adventures/${d} Disc Golf.md`
  one.app.vault.create(path, `
---
title: Disc Golf 
allDay: true
date: ${d}
completed: null
---

`)
}

module.exports = idk