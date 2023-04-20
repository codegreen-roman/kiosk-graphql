export interface FontSrc {
  url: string
  format?: string
}

export interface FontFace {
  name: string
  src: FontSrc[]
  fontWeight: number
  fontStyle: string
}
