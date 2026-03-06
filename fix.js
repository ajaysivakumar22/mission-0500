const fs = require('fs');
let content = fs.readFileSync('src/app/admin/AdminDashboardClient.tsx', 'utf8');
content = content.replace(/\\\\\/g, '\');
content = content.replace(/\\\/g, '\');
fs.writeFileSync('src/app/admin/AdminDashboardClient.tsx', content);
