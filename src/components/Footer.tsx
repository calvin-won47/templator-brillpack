import { useConfig } from "@/contexts/ConfigContext";

export const Footer = () => {
  const { basic, extra } = useConfig();
  const contact = extra?.contact;
  const legal = extra?.footer?.legal_text;
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{basic.app_name}</h3>
            <p className="text-primary-foreground/80">
              Brilliance in every box – creating custom packaging solutions that
              elevate your brand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Products
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-primary-foreground/80">Custom Design</li>
              <li className="text-primary-foreground/80">Premium Finishes</li>
              <li className="text-primary-foreground/80">Brand Enhancement</li>
              <li className="text-primary-foreground/80">Fast Delivery</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              {contact?.email ? <li>{contact.email}</li> : <li>info@brillpack.com</li>}
              {contact?.phone ? <li>{contact.phone}</li> : <li>+1 (555) 123-4567</li>}
              {contact?.address_lines?.length
                ? contact.address_lines.map((line, idx) => <li key={idx}>{line}</li>)
                : (
                  <>
                    <li>123 Packaging Lane</li>
                    <li>Business District, NY 10001</li>
                  </>
                )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>{legal || `© 2024 ${basic.app_name}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};
