/** All monetary values in the data set are held in USD millions. */

export const fmtM = (m: number): string =>
  `US$ ${m.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`

export const fmtFull = (m: number): string =>
  `US$ ${Math.round(m * 1_000_000).toLocaleString('en-US')}`

export const fmtPct = (n: number): string => `${n}%`
