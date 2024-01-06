
// const fs = require('fs/promises');


// (async() => {
//
//   const files = await fs.readdir('/home/lane/Documents/lkat-vault/Public/Blog')
//
//
//
//   console.log(files)
// })()
//



const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const extractDateFromPath = (filePath) => {
  // Extract just the filename from the path
  const fileName = filePath.split('/').pop();

  // Use the same regular expression to match the date pattern in the filename
  const regex = /^(\d{4}-\d{2}-\d{2})/;
  const match = fileName.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null; // Return null if no match is found
  }
};

const extractFilenameWithoutDate = (filePath) => {
  // Extract just the filename from the path
  const fileName = filePath.split('/').pop();

  // Use the same regular expression to match the date pattern in the filename
  const regex = /^(\d{4}-\d{2}-\d{2})/;
  const match = fileName.match(regex);

  if (match && match[1]) {
    // Extract the rest of the filename without the date
    const restOfFilename = fileName.replace(regex, '').trim().replace('.md','');
    return restOfFilename;
  } else {
    return null; // Return null if no date match is found
  }
};

const directoryPath = '/home/lane/Documents/lkat-vault/Public/Blog'; // Replace with your actual directory path

// Get today's date in the format you want
// const todayDate = format(new Date(), 'yyyy-MM-dd');

// Function to process a single file
const processFile = (filePath) => {
  try {
    // Read the file content
    let fileContent = fs.readFileSync(filePath, 'utf8');

    const todayDate = extractDateFromPath(filePath)
    if (!todayDate) throw new Error('no worky ' + filePath)

    const justTitle = extractFilenameWithoutDate(filePath)
    if (!justTitle) throw new Error('2222 no worky ' + filePath)

    // Check if the file already has frontmatter
    if (!fileContent.startsWith('---')) {
      // If not, add frontmatter with the date attribute
      fileContent = `---\ndate: ${todayDate}\n---\n${fileContent}`;
    } else {
      // If frontmatter already exists, update the date attribute
      fileContent = fileContent.replace(/date:.*\n/, `date: ${todayDate}\n`);
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent, 'utf8');
    // console.log(filePath)
    // console.log(fileContent)
    console.log({filePath, todayDate, justTitle})

    // console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
};

// Function to process all files in a directory
const processFilesInDirectory = (directoryPath) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // Check if it's a file (not a directory)
      if (fs.statSync(filePath).isFile()) {
        processFile(filePath);
      }
    });
  });
};

// Start processing files in the specified directory
processFilesInDirectory(directoryPath);



