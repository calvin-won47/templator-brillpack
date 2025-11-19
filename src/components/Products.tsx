import { Button } from "@/components/ui/button";
import productsImage from "@/assets/products-showcase.jpg";
import { ArrowRight } from "lucide-react";

export const Products = () => {
  const productTypes = [
    { name: "Rigid Boxes", description: "Premium boxes for luxury products" },
    { name: "Folding Cartons", description: "Versatile and cost-effective" },
    { name: "Magnetic Boxes", description: "Elegant closure mechanisms" },
    { name: "Shoulder Boxes", description: "Sophisticated two-piece design" },
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold mb-4">
            Our Products
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our Box Styles
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our wide range of custom packaging solutions designed to
            showcase your products beautifully.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={productsImage}
              alt="Various custom packaging box styles and designs"
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4">
              {productTypes.map((product, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              ))}
            </div>
            <Button variant="default" size="lg" className="w-full sm:w-auto group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
