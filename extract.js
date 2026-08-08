const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\Ricki\\.gemini\\antigravity-cli\\brain\\8b6a4cd1-e7a4-4eea-9923-51879decfe91\\.system_generated\\steps\\14\\content.md', 'utf-8');
const text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                 .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                 .replace(/<[^>]+>/g, ' ')
                 .replace(/\s+/g, ' ')
                 .trim();
console.log(text.substring(0, 3000));
