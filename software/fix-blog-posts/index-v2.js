const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { format } = require('date-fns');

const directoryPath = '/home/lane/Documents/lkat-vault/Public/Blog'; // Replace with your actual directory path

const processFile = (filePath) => {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the frontmatter and content using gray-matter
    const { data, content } = matter(fileContent);

    // Extract the date from the filename
    const dateMatch = filePath.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[0] : null;

    // Extract the title from the filename
    const title = path.basename(filePath, path.extname(filePath)).replace(date, '').trim();

    // Update or create date and title in the frontmatter
    data.date = date || format(new Date(), 'yyyy-MM-dd');
    data.title = title || 'Untitled';

    // Stringify the updated frontmatter and content
    const updatedFileContent = matter.stringify(content, data);

    // Write the updated content back to the file
    // fs.writeFileSync(filePath, updatedFileContent, 'utf8');

    // console.log(`Processed: ${filePath}`);
    console.log({filePath,updatedFileContent})
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
};

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

processFilesInDirectory(directoryPath);
