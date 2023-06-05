const sourceFile = require('../../data/discs-source.json')
const {MdBuilder} = require('./md-builder')
const _ = require('lodash');

const totalPrice = sourceFile.reduce((previous, current) => {
    return previous + (current.price || 0)
}, 0)

function serialize(disc) {
    return [disc.number, disc.brand, disc.model, disc.status, disc.color, disc.created, disc.notes]
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
builder.addHeader(['Number', 'Brand', 'Model', 'Status', 'Color', 'Created', 'Notes'])
sourceFile.forEach(disc => {
    builder.addRow(serialize(disc))
})

builder.toFile('C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\Disc List.md')

// Generate DG Gear List
const gearList = require('../../data/gear-list-disc-golf-source.json')
const gearTotalPrice = gearList.reduce((previous, current) => {
    return previous + (current.price || 0)
}, 0)

builder
    .reset()
    .addUpdatedRow()
    .addRawRow(`> Spent at least **~$${gearTotalPrice} on disc golf gear...`)
    .newLine()
    .addHeader(['Name', 'Price', 'Date'])
    .onRowAdded(gear => [gear.name, gear.price, gear.date])
    .addRows(gearList)
    .toFile('C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\Disc Golf Gear List.md')