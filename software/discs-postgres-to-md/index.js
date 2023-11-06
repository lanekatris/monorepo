// Let's create some md files to mess with in obsidian
const fs = require("fs");
const discs = require("./discs.json");
const format = require("date-fns/format");

// const disc = discs[0];
//
// const file = `---
// date: ${format(new Date(disc.updated_at), "yyyy-M-dd")}
// brand: ${disc.brand}
// disc_id: "${disc.id}"
// model: ${disc.model}
// plastic: ${disc.plastic}
// color: ${disc.color}
// status: ${disc.status}
// ---
//
// ${disc.notes}
// `;
//
// console.log(file);
//
// fs.writeFileSync(
//   "C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Apps\\Discs\\idk.md",
//   file
// );

discs.forEach((disc) => {
  const file = `---
date: ${format(new Date(disc.updated_at), "yyyy-M-dd")}
brand: ${disc.brand}
disc_id: "${disc.id}"
model: ${disc.model}
plastic: ${disc.plastic}
color: ${disc.color}
status: ${disc.status}
---

${disc.notes}
`;

  // console.log(file);
  console.log("wirting file " + disc.id);

  fs.writeFileSync(
    `C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Apps\\Discs\\${disc.id} - ${disc.model}.md`,
    file
  );
});
