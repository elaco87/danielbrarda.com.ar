const fs = require('fs');
const path = require('path');

// Simulate the data loading
const propertiesDataContent = fs.readFileSync(path.join(__dirname, 'js/propertiesData.js'), 'utf8');
// Extract the array using regex or eval (safer to just clean the string)
// The file starts with "const propertiesData = " and likely ends with ";"
const jsonString = propertiesDataContent
    .replace('const propertiesData =', '')
    .trim()
    .replace(/;$/, '');

try {
    const data = JSON.parse(jsonString);
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }
    fs.writeFileSync('data/properties.json', JSON.stringify(data, null, 2));
    console.log(`Successfully migrated ${data.length} properties to data/properties.json`);
} catch (error) {
    console.error('Error parsing JSON:', error);
}
