export const getOpenSeaUrl = (id: string) =>
  `https://opensea.io/assets/0xc2c747e0f7004f9e8817db2ca4997657a7746928/${id}?ref=${process.env.NEXT_PUBLIC_REF_ADDRESS}`;
