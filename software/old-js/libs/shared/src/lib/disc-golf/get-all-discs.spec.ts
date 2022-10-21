import {getAllDiscs} from './get-all-discs'
const fs = require('fs');
const path = require('path');

describe('get all discs', ()=>{
  it('should work', async () => {
    const html = fs.readFileSync(path.join(__dirname, 'dghtml.html'))
    expect(html).not.toBeNull()

    const response = await getAllDiscs(html);
    expect(response).not.toBeNull()

    expect(response.discs.length).toBeGreaterThan(0)
    response.discs.forEach(disc => {
      expect(disc.name).not.toBeNull()
      expect(disc.brand).not.toBeNull()
      expect(disc.category).not.toBeNull()
      expect(disc.fade).toBeGreaterThan(-10)
      expect(disc.glide).toBeGreaterThan(-10)
      expect(disc.speed).toBeGreaterThan(0)
      expect(disc.turn).toBeGreaterThan(-10)
    })
  })

  it('should create file', async () => {
    const response = await getAllDiscs();
    fs.writeFileSync(path.join(__dirname, 'output.json'), JSON.stringify(response, null, 2))
  })
  it('test aggregations', async () => {
    const html = fs.readFileSync(path.join(__dirname, 'dghtml.html'))

    const response = await getAllDiscs(html);


  })
})
