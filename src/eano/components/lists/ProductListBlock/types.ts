/** Single color dot shown under the product card */
export interface ProductColor {
  id: string | number
  hex: string       // e.g. "#ff0000"
  label?: string    // e.g. "Red"
}

/** Product item structure required by ProductListBlock */
export interface ProductListItem {
  id: string | number
  name: string
  subtitle?: string           // e.g. "256 GB | 512 GB"
  imageUrl: string
  price: number               // current price
  oldPrice?: number           // crossed-out price
  currency?: string           // default: "$"
  rating?: number             // 0–5, default: 5
  soldCount?: number          // e.g. 3523
  colors?: ProductColor[]
  badge?: string              // e.g. "New", "Hot"
}
