import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DesignSystemGuide() {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colorPalette = {
    primary: {
      name: 'Coffee Brown',
      colors: [
        { name: 'Primary Dark', hex: '#4E342E', usage: 'Hover states, active buttons' },
        { name: 'Primary Main', hex: '#5C4033', usage: 'Main brand color, primary buttons, headers' },
        { name: 'Primary Light', hex: '#6D503B', usage: 'Alternative primary, buttons' },
      ]
    },
    secondary: {
      name: 'Warm Brown',
      colors: [
        { name: 'Secondary Dark', hex: '#795548', usage: 'Hover states' },
        { name: 'Secondary Main', hex: '#8B6B47', usage: 'Secondary buttons, badges' },
        { name: 'Secondary Light', hex: '#8D6E63', usage: 'Soft highlights' },
      ]
    },
    accent: {
      name: 'Gold Accent',
      colors: [
        { name: 'Accent Main', hex: '#C4A574', usage: 'Accent elements, special buttons' },
      ]
    },
    neutral: {
      name: 'Backgrounds & Text',
      colors: [
        { name: 'Background Cream', hex: '#F5F1ED', usage: 'Main background, card backgrounds' },
        { name: 'Background Warm', hex: '#FDFBF7', usage: 'Alternative light background' },
        { name: 'Background Gray', hex: '#F9FAFB', usage: 'Alternative neutral background' },
        { name: 'Text Dark', hex: '#1F2937', usage: 'Primary text (gray-800)' },
        { name: 'Text Medium', hex: '#4B5563', usage: 'Secondary text (gray-600)' },
        { name: 'Text Light', hex: '#6B7280', usage: 'Muted text (gray-500)' },
      ]
    },
    semantic: {
      name: 'Status Colors',
      colors: [
        { name: 'Success', hex: '#10B981', usage: 'Success messages, completed status' },
        { name: 'Warning', hex: '#F59E0B', usage: 'Warning messages, pending status' },
        { name: 'Error', hex: '#EF4444', usage: 'Error messages, danger buttons' },
        { name: 'Info', hex: '#3B82F6', usage: 'Info messages, processing status' },
      ]
    }
  };

  const typography = {
    fontFamilies: [
      {
        name: 'Playfair Display',
        type: 'Serif',
        usage: 'Headings, titles, brand elements',
        weights: ['400 (Regular)', '700 (Bold)'],
        import: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');",
        css: "font-family: 'Playfair Display', serif;"
      },
      {
        name: 'Inter',
        type: 'Sans-serif',
        usage: 'Body text, UI elements, buttons',
        weights: ['300 (Light)', '400 (Regular)', '500 (Medium)', '600 (Semibold)'],
        import: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');",
        css: "font-family: 'Inter', sans-serif;"
      }
    ],
    scale: [
      { name: 'Heading 1', size: '3xl', pixels: '30px', lineHeight: '1.2', weight: 'bold', family: 'Playfair Display' },
      { name: 'Heading 2', size: '2xl', pixels: '24px', lineHeight: '1.3', weight: 'bold', family: 'Playfair Display' },
      { name: 'Heading 3', size: 'xl', pixels: '20px', lineHeight: '1.4', weight: 'bold', family: 'Playfair Display' },
      { name: 'Body Large', size: 'lg', pixels: '18px', lineHeight: '1.6', weight: 'regular', family: 'Inter' },
      { name: 'Body Regular', size: 'base', pixels: '16px', lineHeight: '1.6', weight: 'regular', family: 'Inter' },
      { name: 'Body Small', size: 'sm', pixels: '14px', lineHeight: '1.5', weight: 'regular', family: 'Inter' },
      { name: 'Caption', size: 'xs', pixels: '12px', lineHeight: '1.4', weight: 'regular', family: 'Inter' },
    ]
  };

  const spacing = [
    { name: 'xs', value: '0.5rem', pixels: '8px', usage: 'Minimal padding, tight spacing' },
    { name: 'sm', value: '0.75rem', pixels: '12px', usage: 'Small gaps, compact layouts' },
    { name: 'md', value: '1rem', pixels: '16px', usage: 'Default spacing' },
    { name: 'lg', value: '1.5rem', pixels: '24px', usage: 'Section spacing' },
    { name: 'xl', value: '2rem', pixels: '32px', usage: 'Large gaps between sections' },
    { name: '2xl', value: '3rem', pixels: '48px', usage: 'Major section dividers' },
  ];

  const borderRadius = [
    { name: 'sm', value: '0.375rem', pixels: '6px', usage: 'Small elements' },
    { name: 'md', value: '0.5rem', pixels: '8px', usage: 'Default buttons, inputs' },
    { name: 'lg', value: '0.75rem', pixels: '12px', usage: 'Cards, containers' },
    { name: 'xl', value: '1rem', pixels: '16px', usage: 'Large cards' },
    { name: '2xl', value: '1.5rem', pixels: '24px', usage: 'Featured elements' },
    { name: 'full', value: '9999px', pixels: 'full', usage: 'Pills, badges, circular elements' },
  ];

  const shadows = [
    { name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', usage: 'Subtle elevation' },
    { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', usage: 'Cards, dropdowns' },
    { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', usage: 'Modals, popovers' },
    { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', usage: 'High elevation elements' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#5C4033' }}>
            <span className="text-4xl font-bold text-white">J</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Jagongan Coffee
          </h1>
          <p className="text-xl text-gray-600">Design System Guide</p>
          <p className="text-sm text-gray-500 mt-2">Panduan lengkap untuk konsistensi desain</p>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            🎨 Color Palette
          </h2>
          
          {Object.entries(colorPalette).map(([key, section]) => (
            <div key={key} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.colors.map((color, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div 
                      className="h-24 w-full"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{color.name}</p>
                          <p className="text-sm text-gray-600 font-mono">{color.hex}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(color.hex, `${key}-${idx}`)}
                          className="p-2 hover:bg-gray-100 rounded transition"
                        >
                          {copiedColor === `${key}-${idx}` ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Typography */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            ✍️ Typography
          </h2>
          
          {/* Font Families */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Font Families</h3>
            <div className="space-y-6">
              {typography.fontFamilies.map((font, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{font.name}</h4>
                      <p className="text-sm text-gray-600">{font.type}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {font.usage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Weights:</strong> {font.weights.join(', ')}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Import:</p>
                    <code className="text-xs text-gray-800 block break-all">{font.import}</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg mt-2">
                    <p className="text-xs text-gray-500 mb-1">CSS:</p>
                    <code className="text-xs text-gray-800">{font.css}</code>
                  </div>
                  <div className="mt-4 text-2xl" style={{ fontFamily: font.css.match(/'([^']+)'/)[1] }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Scale */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Type Scale</h3>
            <div className="space-y-4">
              {typography.scale.map((type, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">{type.name}</span>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>Size: {type.size}</span>
                      <span>({type.pixels})</span>
                      <span>Weight: {type.weight}</span>
                    </div>
                  </div>
                  <p 
                    className={`text-${type.size} font-${type.weight}`}
                    style={{ 
                      fontFamily: type.family === 'Playfair Display' ? 'Playfair Display, serif' : 'Inter, sans-serif',
                      lineHeight: type.lineHeight 
                    }}
                  >
                    Sample Text - {type.family}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            📏 Spacing System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spacing.map((space, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900">{space.name}</span>
                  <span className="text-sm text-gray-600">{space.pixels}</span>
                </div>
                <div className="bg-blue-100 rounded" style={{ height: space.value }}></div>
                <p className="text-xs text-gray-500 mt-2">{space.usage}</p>
                <code className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded mt-2 block">
                  {space.value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            ⭕ Border Radius
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {borderRadius.map((radius, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900">{radius.name}</span>
                  <span className="text-sm text-gray-600">{radius.pixels}</span>
                </div>
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-16 w-full"
                  style={{ borderRadius: radius.value }}
                ></div>
                <p className="text-xs text-gray-500 mt-2">{radius.usage}</p>
                <code className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded mt-2 block">
                  {radius.value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            🌑 Shadow System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shadows.map((shadow, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">{shadow.name}</span>
                  <span className="text-xs text-gray-500">{shadow.usage}</span>
                </div>
                <div 
                  className="bg-white p-6 rounded-lg"
                  style={{ boxShadow: shadow.value }}
                >
                  <p className="text-center text-gray-600">Shadow Preview</p>
                </div>
                <code className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded mt-3 block break-all">
                  {shadow.value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Component Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            🧩 Component Examples
          </h2>
          
          <div className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: '#5C4033' }}>
                  Primary Button
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: '#8B6B47' }}>
                  Secondary Button
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: '#C4A574' }}>
                  Accent Button
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold bg-white border-2 transition hover:bg-gray-50" style={{ borderColor: '#5C4033', color: '#5C4033' }}>
                  Outline Button
                </button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#5C4033' }}>
                  Category
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Success
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Error
                </span>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Card Title</h4>
                  <p className="text-gray-600">Card description with Inter font for body text.</p>
                </div>
                <div className="rounded-xl p-6 shadow-md" style={{ backgroundColor: '#F5F1ED' }}>
                  <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#5C4033' }}>Cream Card</h4>
                  <p className="text-gray-600">Card with brand background color.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            💡 Implementation Guide
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Import Fonts</h3>
              <p className="text-sm">Tambahkan di file CSS global atau component:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block mt-2 overflow-x-auto">
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
              </code>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Set Base Styles</h3>
              <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                body {'{'} font-family: 'Inter', sans-serif; {'}'}<br/>
                .font-serif {'{'} font-family: 'Playfair Display', serif; {'}'}
              </code>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Use Consistent Colors</h3>
              <p className="text-sm">Gunakan warna dari palette yang telah ditentukan untuk menjaga konsistensi brand.</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-2">4. Follow Spacing Rules</h3>
              <p className="text-sm">Gunakan spacing system untuk padding dan margin yang konsisten.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}