const fs = require('fs')

function p(line){
    return `| ${line} |`
}

class MdBuilder {
    data = [];
    handleRowAdd = null;
    
    addHeader(names) {
        this.data.push(p(names.join('|')))
        this.data.push(p(Array.from({length:names.length}, () => '---').join('|')))
        return this;
    }

    newLine() {
        this.data.push('')
        return this
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

    onRowAdded(cb) {
        this.handleRowAdd = cb;
        return this;
    }

    addRows(arrayOfData) {
        const self = this;
        arrayOfData.forEach(x => {
            self.addRow(self.handleRowAdd(x))
        })
        return this;
    }

    toFile(filePath){
        fs.writeFileSync(filePath, this.data.join('\n'))
    }
}

module.exports = {
    MdBuilder
}