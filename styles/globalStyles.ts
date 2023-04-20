import { FontFace } from '@interfaces/fonts'

export function createFontFace({ name, fontStyle, fontWeight, src }: FontFace): string {
  return `
    @font-face{
      font-family: "${name}";
      font-display: auto;
      src: ${src.map(({ url, format }) => `url(${url})${format ? ` format("${format}")` : ''}`).join(', ')};
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
    }
  `
}
