import { Card } from "@/components/ui/card";
import { Box, Palette, Sparkles, Truck } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Box,
      title: "Custom Box Design",
      description:
        "Tailor-made packaging solutions designed specifically for your products and brand identity.",
    },
    {
      icon: Palette,
      title: "Premium Finishes",
      description:
        "Choose from foil stamping, embossing, spot UV, and more to create stunning packaging.",
    },
    {
      icon: Sparkles,
      title: "Brand Enhancement",
      description:
        "Elevate your brand with packaging that tells your story and captivates customers.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick turnaround times without compromising on quality, ensuring your products reach market faster.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comprehensive Packaging Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            From concept to delivery, we provide end-to-end packaging services
            that exceed expectations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
