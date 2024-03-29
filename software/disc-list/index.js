const sourceFile = require('../../data/discs-source.json')
const {MdBuilder} = require('./md-builder')
const _ = require('lodash');
const jobs = require("./jobs");
const gearList = require("../../data/gear-list-disc-golf-source.json");

require('dotenv').config();

// console.log({startJob, finishJob})

(async () => {
    const job = await jobs.startJob('Disc Golf Inventory')
    console.log('Running...')

    const totalPrice = sourceFile.reduce((previous, current) => {
        return previous + (current.price || 0)
    }, 0)

    function serialize(disc) {
        return [disc.number, disc.brand, disc.model, disc.plastic, disc.status, disc.color, disc.created, disc.notes]
    }

    const builder = new MdBuilder();

    builder.addUpdatedRow().newLine()
    builder.addRawRow(`> Spent at least **~$${totalPrice}** on discs. Haven't captured all the discs I've had as well.`).newLine()

    const brands = _.groupBy(sourceFile, 'brand')
    builder.addRawRow('### Brand Stats').newLine()
    builder.addHeader(['Brand', 'Disc Count'])
    Object.keys(brands).forEach(brand => {
        builder.addRow([brand, brands[brand].length])
    })
    builder.newLine()

    const models = _.groupBy(sourceFile, 'model')
    builder.addRawRow('### Model Stats').newLine()
    builder.addHeader(['Model', 'Disc Count'])
    Object.keys(models).forEach(model => {
        builder.addRow([model, models[model].length])
    })
    builder.newLine()

    const colors = _.groupBy(sourceFile, 'color')
    builder.addRawRow('### Color Stats').newLine()
    builder.addHeader(['Color', 'Disc Count'])
    Object.keys(colors).forEach(color => {
        builder.addRow([color, colors[color].length])
    })
    builder.newLine()

    builder.addRawRow('### Discs').newLine()
    builder.addHeader(['Number', 'Brand', 'Model', 'Plastic' ,'Status', 'Color', 'Created', 'Notes'])
    sourceFile.forEach(disc => {
        builder.addRow(serialize(disc))
    })

    const toFilePath = process.platform === 'linux' ? '/home/lane/Documents/lkat-vault/Public/Disc List.md' : 'C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\Disc List.md'
    builder.toFile(toFilePath)

// Generate DG Gear List
    const gearList = require('../../data/gear-list-disc-golf-source.json')
    const {startJob} = require("./jobs");
    const gearTotalPrice = gearList.reduce((previous, current) => {
        return previous + (current.price || 0)
    }, 0)

    const gearListFilePath = process.platform === 'linux' ? '/home/lane/Documents/lkat-vault/Public/Disc Golf Gear List.md' : 'C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\Disc Golf Gear List.md'
    builder
        .reset()
        .addUpdatedRow()
        .addRawRow(`> Spent at least **~$${gearTotalPrice} on disc golf gear...`)
        .newLine()
        .addHeader(['Name', 'Price', 'Date'])
        .onRowAdded(gear => [gear.name, gear.price, gear.date])
        .addRows(gearList)
        .toFile(gearListFilePath)

    await jobs.finishJob(job.id)
    console.log('Done.')

})()
