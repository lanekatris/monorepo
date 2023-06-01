const csv=require('csvtojson')
const fs = require('fs')

function p(line){
    return `| ${line} |`
}

function c(line){
    return line.replace(/\n/g, '').replace(/\|/g, '')
}

function u(line) {
    return `[Link](${line})`
}

function i(line){
    return `![](${line})`
}

function d(line){
    const date = new Date(Date.parse(line))
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

const sourceFile = '../../data/raindrop-source-2023-05-30.csv'
const targetGeneratedFile = '../../data/raindrop-generated-2023-05-30.json'
const targetObsidianFile = 'C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\Raindrop IO.md'
const publicUrlPrefix = 'https://github.com/lanekatris/monorepo/tree/main/data'

async function go() {
    const jsonArray=await csv().fromFile(sourceFile);
    jsonArray.sort((a,b) => Date.parse(b.created) - Date.parse(a.created))
    console.log(jsonArray[0])
    const headers = Object.keys(jsonArray[0]).map(x => x.charAt(0).toUpperCase() + x.slice(1))
    const fileArray = [`**Updated**: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, '', `> You can go [here](${publicUrlPrefix}) to view raw data files in various formats`, '',  p(headers.join('|'))]
    const belowHeaders = Array.from({length: headers.length}, (v, i) => '---').join('|')
    fileArray.push(p(belowHeaders))

    jsonArray.forEach(x => {
        const idk = [c(x.title),c(x.description),u(x.url),x.folder,x.tags,d(x.created),i(x.cover)] //x.highlights
        fileArray.push(p(idk.join('|')))
    })

    const fileContents = fileArray.join('\n')
    fs.writeFileSync(targetObsidianFile, fileContents)
    fs.writeFileSync(targetGeneratedFile, JSON.stringify(jsonArray, null, 2))
}

go();

