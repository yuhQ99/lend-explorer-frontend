function truncateAddress(address) {
    if (!address || address.length < 10) return address;
    const prefix = address.slice(0, 4);
    const suffix = address.slice(-4);
    return `${prefix}...${suffix}`;
  }

function formatNumberWithCommas(value, decimals = 2) {
    if (isNaN(value)) return '0.00';
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
}

export { truncateAddress, formatNumberWithCommas };