import { CheckCircle } from "lucide-react";
import teamImage from "@/assets/team-collaboration.jpg";
import { useConfig } from "@/contexts/ConfigContext";

export const About = () => {
  const { extra } = useConfig();
  const features = extra?.about?.features || [
    "Custom design and branding solutions",
    "High-quality materials and finishes",
    "Fast turnaround times",
    "Competitive pricing for all order sizes",
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={teamImage}
                alt="Professional team collaborating on custom packaging solutions"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
              {extra?.about?.heading || "Who We Are"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {extra?.about?.subheading || "Delivering Excellence in Custom Packaging"}
            </h2>
            <p className="text-lg text-muted-foreground">
              For over a decade, BrillPack has delivered custom packaging that
              protects your products and elevates your brand. We combine
              innovation, quality, and personalized service to create packaging
              solutions that make your products stand out.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-foreground text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
