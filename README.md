## Hashmask Tools

TODO

- read contract https://etherscan.io/address/0xc2c747e0f7004f9e8817db2ca4997657a7746928#readContract
  - save masks owned by nftx and nft20 - using balanceOf and then tokenOfOwnerByIndex
  - run analytics on number of addresses, get top 50 mask owners - using ownerOf
- think about separate page for nftx and nft20 funds with links to where to buy the tokens
- add page with links to similar projects, marketplaces etc.
- add price and score filters (premium)
- add 2 category collections - planets and egyptian signs
- use more traits from spreadsheet (backgrounds)
- show in mask item if in collection or has similar images or in NTFX fund
- run image comparison
- show when prices were last updated

### Scripts

Run multiple image comparison scripts with

```
yarn concurrently "yarn script scripts/findSimilarImagesNative.ts" "yarn script scripts/findSimilarImagesNative.ts 2" "yarn script scripts/findSimilarImagesNative.ts 4"
```

### Subcategories of explicit traits

Level 1: Category (e.g. animal mask)
Level 2: Individual within category (e.g. wolf or dragon mask)
Level 3: Different variations of individuals (e.g. red wolf or ice dragon)

### Resources

Hashmasks Provenance Record

- https://www.thehashmasks.com/provenance.html

NTFX fund MASK

- https://nftx.org/#/fund/20
- https://app.sushi.com/token/0x0fe629d1e84e171f8ff0c1ded2cc2221caa48a3f
- nftx owner address 0xaf93fcce0548d3124a5fc3045adaf1dde4e8bf7e

NFT20 another fund

- https://nft20.io/asset/0xc2BdE1A2fA26890c8E6AcB10C91CC6D9c11F4a73
- fund asset owner 0xc2BdE1A2fA26890c8E6AcB10C91CC6D9c11F4a73

Similar projects

- https://thehashnames.com/#/dashboard
- https://maskinson.netlify.app/
- https://maskinson.netlify.app/analytics.html - Analytics
- https://www.hashmaskfinder.com/
- https://maskswap.xyz/#/
- https://hashyverse.com/events
- https://maskradar.yobalabs.com/

Rarity scores

- https://rarity.studio/mask.html

MaskDAO

- https://www.maskdao.art/

Google docs with data

- Rarest_Hashmasks - https://docs.google.com/spreadsheets/u/0/d/1r0FxPrtRy7QSruLvlUzNdtcgcU6aN6vEy8HmjXn3qHE/htmlview#
- https://docs.google.com/spreadsheets/d/1ha1KdYY3vCpAEcGqpTXv_U9PI6GhPoJs5-a1k6wuBzU/edit#gid=282814562
- https://docs.google.com/spreadsheets/d/1rLagIfx4dSU_4ZbhuRxTjPYg0A5-ZQC8PIhLs29srwI/edit#gid=282814562
- greek symbols https://docs.google.com/document/d/1TbFNJ5bcWT1efeTM_LplRQ6BrdmuNzM9kkSB7T11op0/edit

Subgraph

- https://thegraph.com/explorer/subgraph/tibike6/hashmasks
