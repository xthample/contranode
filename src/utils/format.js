export const formatBalance = (n, decimals = 2) =>
  n == null ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

export const shortAddress = (addr) =>
  !addr ? '' : addr.length > 18 ? `${addr.slice(0, 8)}...${addr.slice(-5)}` : addr

