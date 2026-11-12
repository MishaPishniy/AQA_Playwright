export function parsePrice(priceText: string): number {
  const priceWithoutDollar = priceText.replace('$', '');

  const price = Number(priceWithoutDollar.trim());

  return price;
}
