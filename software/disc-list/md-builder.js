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

class MdBuilder {
    data = [];
    
    addHeader(names) {
        this.data.push(p(names.join('|')))
        this.data.push(p(Array.from({length:names.length}, () => '---').join('|')))
    }

    newLine() {
        this.data.push('')
    }

    addRow(arrayOfData) {
        this.data.push(p(arrayOfData.join('|')))
    }

    addRawRow(row) {
        this.data.push(row);
        return this;
    }

    addUpdatedRow() {
        this.data.push(`**Updated**: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        return this;
    }

    toFile(filePath){
        fs.writeFileSync(filePath, this.data.join('\n'))
    }
}

module.exports = {
    MdBuilder
}