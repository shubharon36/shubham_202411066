import { NextResponse } from "next/server"
import { faker } from "@faker-js/faker"
import type { Product } from "@/app/types"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Generate consistent mock data
const seed = faker.string.alphanumeric(12)

function generateMockProducts(count: number): Product[] {
  const categories = ["Electronics", "Home", "Sports", "Furniture", "Books"]
  const products: Product[] = []
  for (let i = 0; i < count; i++) {
    products.push({
      id: faker.string.uuid(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 10, max: 2000 })),
      category: faker.helpers.arrayElement(categories),
      imageUrl: `https://picsum.photos/seed/${seed}-${i}/640/480`,
      description: faker.commerce.productDescription(),
    })
  }
  return products
}

// Create once per runtime
const ALL_PRODUCTS = generateMockProducts(100)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Query params
  const query = (searchParams.get("query") ?? "").toLowerCase()
  const category = searchParams.get("category") ?? ""
  const sort = searchParams.get("sort") ?? "price_desc"
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") ?? "12", 10)
  const id = searchParams.get("id")

  if (id) {
    const product = ALL_PRODUCTS.find((p) => p.id === id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ product })
  }

  // Filter
  let filtered = ALL_PRODUCTS
  if (query) filtered = filtered.filter((p) => p.name.toLowerCase().includes(query))
  if (category) filtered = filtered.filter((p) => p.category === category)

  // Sort on the server
  filtered = filtered.sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "name_asc":
        return a.name.localeCompare(b.name)
      case "name_desc":
        return b.name.localeCompare(a.name)
      default:
        return b.price - a.price
    }
  })

  // Paginate
  const start = (page - 1) * limit
  const end = page * limit
  const slice = filtered.slice(start, end)

  return NextResponse.json({
    products: slice,
    totalPages: Math.ceil(filtered.length / limit),
    totalProducts: filtered.length,
    sortedBy: sort,
  })
}
