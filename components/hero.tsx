import Image from "next/image"

export function Hero() {
  return (
    <section className="relative bg-white text-black border-b border-gray-200">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex flex-col items-center">
            <Image src="/images/logo.png" alt="SGH Logo" width={100} height={100} className="mb-4" />
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">
              SELVA<span className="text-[#C62828]">GANAPATHI</span>
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-4">HYDRAULICS</h2>
          </div>

          <p className="text-lg lg:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Leading manufacturer of high-quality woodbreaker machines and hydraulic equipment. Serving industries with
            reliable, efficient, and durable machinery solutions.
          </p>
        </div>
      </div>
    </section>
  )
}
