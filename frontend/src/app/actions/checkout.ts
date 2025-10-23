"use server"
import { z } from "zod"
import type { CartItem } from "@/app/types"

const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  name: z.string().min(2, { message: "Please enter your full name." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "Please enter a city." }),
  zip: z.string().min(3, { message: "Please enter a valid ZIP code." }),
  cartItems: z.string().transform((str) => JSON.parse(str) as CartItem[]),
  cartTotal: z.string().transform((str) => Number.parseFloat(str)),
})

export async function checkoutAction(_prevState: any, formData: FormData) {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
    cartItems: formData.get("cartItems"),
    cartTotal: formData.get("cartTotal"),
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0]
    return { message: firstError ?? "Invalid data." }
  }

  const { email, name, address, city, zip, cartItems, cartTotal } = parsed.data

  console.log("--- PROCESSING CHECKOUT ---", { email, name, address, city, zip, cartTotal, items: cartItems })

  await new Promise((r) => setTimeout(r, 1000))

  return {
    success: true,
    orderId: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
  }
}
