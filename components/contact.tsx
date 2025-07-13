import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MapPin } from "lucide-react"

export function Contact() {
  return (
    <section className="py-8 bg-black text-white border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 border-b border-gray-700 pb-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Get In Touch</h2>
          <p className="text-gray-300 text-base max-w-2xl mx-auto">
          Ready to discuss your hydraulic machinery needs? Contact us for quotations, technical support, or any inquiries about our products. We also offer a wide range of services to support your operations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-6 border border-gray-700 rounded-lg p-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#C62828] border-b border-gray-700 pb-2">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
                    <div className="bg-[#C62828] p-3 rounded-full border border-gray-600">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone Numbers</h4>
                      <p className="text-gray-300">75026 21020</p>
                      <p className="text-gray-300">74026 21020</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-[#C62828] p-3 rounded-full border border-gray-600">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-gray-300">
                        487, Gandhi Nagar Road,
                        <br />
                        Kunnathur - 638 103,
                        <br />
                        Tamil Nadu, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-[#C62828]">Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300 pt-4">
                <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-[#C62828] rounded-full" />
                  <span>25+ Years of Experience</span>
                </div>
                <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-[#C62828] rounded-full" />
                  <span>Quality Components</span>
                </div>
                <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-[#C62828] rounded-full" />
                  <span>Pan-India Service Network</span>
                </div>
                <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-[#C62828] rounded-full" />
                  <span>Competitive Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C62828] rounded-full" />
                  <span>After-Sales Support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
