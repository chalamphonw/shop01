const fs = require('fs');
const path = require('path');

// สร้าง SVG placeholder สำหรับแต่ละประเภทสินค้า
const templates = {
  solar: {
    color1: '#FF6B35',
    color2: '#F7931E',
    icon: '☀️',
    text: 'Solar Panel'
  },
  battery: {
    color1: '#4ECDC4',
    color2: '#44A08D',
    icon: '🔋',
    text: 'Battery'
  },
  inverter: {
    color1: '#5D5FEF',
    color2: '#3D3FB8',
    icon: '⚡',
    text: 'Inverter'
  },
  bracket: {
    color1: '#95A5A6',
    color2: '#7F8C8D',
    icon: '🔧',
    text: 'Bracket'
  },
  software: {
    color1: '#9B59B6',
    color2: '#8E44AD',
    icon: '💻',
    text: 'Software'
  },
  energy: {
    color1: '#E74C3C',
    color2: '#C0392B',
    icon: '⚙️',
    text: 'Energy Mgmt'
  },
  support: {
    color1: '#3498DB',
    color2: '#2980B9',
    icon: '🛠️',
    text: 'Support'
  },
  gateway: {
    color1: '#1ABC9C',
    color2: '#16A085',
    icon: '🌐',
    text: 'Gateway'
  },
  switch: {
    color1: '#34495E',
    color2: '#2C3E50',
    icon: '🔌',
    text: 'Switch'
  },
  wifi: {
    color1: '#E67E22',
    color2: '#D35400',
    icon: '📡',
    text: 'WiFi'
  },
  fiber: {
    color1: '#27AE60',
    color2: '#229954',
    icon: '🔗',
    text: 'Fiber Cable'
  }
};

function createSVG(template, variation, width = 800, height = 600) {
  const gradient = variation % 2 === 0 ? template.color1 : template.color2;
  const textColor = '#FFFFFF';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${variation}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${template.color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${template.color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad${variation})"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="120" fill="${textColor}" text-anchor="middle" opacity="0.9">
    ${template.icon}
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${textColor}" text-anchor="middle" opacity="0.8">
    ${template.text}
  </text>
  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle" opacity="0.6">
    View ${variation}
  </text>
</svg>`;
}

function createPDF(title) {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 100
>>
stream
BT
/F1 24 Tf
50 700 Td
(${title} - Technical Datasheet) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
465
%%EOF`;
}

const uploadsDir = path.join(__dirname, 'uploads');

// สร้างรูปภาพสำหรับแต่ละสินค้า
const imageMap = [
  { prefix: 'solar1', template: 'solar' },
  { prefix: 'battery1', template: 'battery' },
  { prefix: 'inverter1', template: 'inverter' },
  { prefix: 'bracket1', template: 'bracket' },
  { prefix: 'software1', template: 'software' },
  { prefix: 'energy-software', template: 'energy' },
  { prefix: 'support-service', template: 'support' },
  { prefix: 'gateway1', template: 'gateway' },
  { prefix: 'switch1', template: 'switch' },
  { prefix: 'wifi-extender', template: 'wifi' },
  { prefix: 'fiber-cable', template: 'fiber' }
];

console.log('Creating product images...');

imageMap.forEach(({ prefix, template }) => {
  for (let i = 1; i <= 4; i++) {
    const filename = `${prefix}-${i}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    const svg = createSVG(templates[template], i);
    fs.writeFileSync(filepath, svg);
    console.log(`✓ Created ${filename}`);
  }
});

console.log('\nCreating datasheets...');

const datasheets = [
  'solar-panel-datasheet.pdf',
  'battery-datasheet.pdf',
  'inverter-datasheet.pdf',
  'bracket-datasheet.pdf',
  'software-license-datasheet.pdf',
  'energy-management-datasheet.pdf',
  'support-service-datasheet.pdf',
  'gateway-datasheet.pdf',
  'switch-datasheet.pdf',
  'wifi-extender-datasheet.pdf',
  'fiber-cable-datasheet.pdf'
];

datasheets.forEach(filename => {
  const title = filename.replace('-datasheet.pdf', '').replace(/-/g, ' ').toUpperCase();
  const filepath = path.join(uploadsDir, filename);
  const pdf = createPDF(title);
  fs.writeFileSync(filepath, pdf);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All files created successfully!');
