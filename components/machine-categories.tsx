import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: "tractor",
    title: "Tractor Based Machines",
    description: "Heavy-duty machines designed to work with tractors for maximum power and field-ready wood processing",
    icon: Truck,
    image: "/images/machines/tractor.png",
    link: "/tractor-machines",
    buttonText: "View Tractor Based Machines",
  },
  {
    id: "electric",
    title: "Electric Motor Machines",
    description:
      "High-efficiency machines powered by electric motors for consistent performance and precise wood processing operations",
    icon: Zap,
    image: "/images/machines/electric.png",
    link: "/electric-machines",
    buttonText: "View Electric Motor Machines",
  },
  
]

export function MachineCategories() {
  return (
    <section id="machine-categories" className="py-8 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">Machine Categories</h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Choose from our range of electric and tractor-based hydraulic machines, each designed for specific
            applications and power requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="border-2 hover:border-[#C62828] transition-colors group overflow-hidden"
              >
                <div className="relative border-b border-gray-200">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 bg-[#C62828] rounded-full group-hover:scale-110 transition-transform border-2 border-white">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>

                <CardHeader className="text-center pb-3 border-b border-gray-100">
                  <CardTitle className="text-xl text-black">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm">{category.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <Link href={category.link}>
                    <Button className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white border border-[#C62828]">
                      {category.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
