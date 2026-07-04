export function formatQuantity(qty: { value?: number; unit: string }): string {
  if (qty.unit === "none") {
    return "";
  }
  if (qty.unit === "quantity") {
    return qty.value !== undefined && qty.value !== null
      ? `${Number(qty.value).toFixed(2)}`
      : "";
  }
  if (qty.value !== undefined && qty.value !== null) {
    return `${Number(qty.value).toFixed(2)} ${qty.unit}`.trim();
  }
  return qty.unit;
}
