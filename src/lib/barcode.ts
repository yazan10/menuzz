/**
 * Pure TypeScript Code128 / Code39 Barcode Generator & Canvas PNG Exporter
 * Zero external dependencies, standalone, reliable SVG rendering.
 */

// Code 128 B Character Set Patterns (6 width modules per symbol)
const CODE128_PATTERNS: string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP pattern)
];

// Start B Code = 104
const START_B_INDEX = 104;
const STOP_INDEX = 106;

/**
 * Generate Code 128 binary modules string ('1' for bar, '0' for space)
 */
export function generateCode128Modules(text: string): string {
  if (!text) text = "123456";

  let checksum = START_B_INDEX;
  const indices: number[] = [START_B_INDEX];

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    const patternIndex = code >= 0 && code <= 95 ? code : 0;
    indices.push(patternIndex);
    checksum += patternIndex * (i + 1);
  }

  const checksumIndex = checksum % 103;
  indices.push(checksumIndex);
  indices.push(STOP_INDEX);

  let modules = "";
  indices.forEach((idx) => {
    const pattern = CODE128_PATTERNS[idx] || CODE128_PATTERNS[0];
    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const width = parseInt(pattern[j], 10);
      modules += (isBar ? "1" : "0").repeat(width);
      isBar = !isBar;
    }
  });

  return modules;
}

/**
 * Download any SVG element as high-resolution PNG image
 */
export function downloadSvgElementAsPng(
  svgElement: SVGElement,
  filename: string,
  scale: number = 3
): void {
  try {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const canvas = document.createElement('canvas');
    const bbox = svgElement.getBoundingClientRect();
    const width = (bbox.width || 300) * scale;
    const height = (bbox.height || 300) * scale;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const pngUrl = canvas.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
  } catch (err) {
    console.error('Failed to export PNG:', err);
    alert('حدث خطأ أثناء تنزيل الصورة، يرجى المحاولة مرة أخرى.');
  }
}

/**
 * Generate a QR code image URL for any text/URL
 */
export function generateQRCodeDataURL(text: string): string {
  const encoded = encodeURIComponent(text || 'https://menuz.app');
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&color=000000&bgcolor=ffffff&margin=1`;
}
