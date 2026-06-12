const CEDI_PREFIX = "GH₵"

export function formatPrice(price) {
  if (price == null || price === "") return ""

  const str = String(price).trim()
  if (/GH₵|GHS/i.test(str)) return str

  const amount = str.replace(/^\$/, "").trim()
  return `${CEDI_PREFIX} ${amount}`
}

export function normalizePrice(price) {
  if (price == null || price === "") return ""
  return formatPrice(price)
}
