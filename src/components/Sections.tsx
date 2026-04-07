
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Check, Star } from "lucide-react";

export function IngredientsSection() {
  const ingredients = [
    { name: "Chicory Root", benefit: "Prebiotic fiber for gut health" },
    { name: "Jerusalem Artichoke", benefit: "Inulin source for healthy bacteria" },
    { name: "Kudzu Root", benefit: "Traditional root for balanced wellness" },
    { name: "Cassava Fiber", benefit: "Gentle plant-based prebiotic" },
    { name: "Marshmallow Root", benefit: "Soothing properties for digestion" },
    { name: "Calendula Flower", benefit: "Antioxidant support" },
  ];

  return (
    <section id="ingredients" className="py-24 bg-black relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">REAL INGREDIENTS. <br /><span className="text-primary">REAL BENEFITS.</span></h2>
            <p className="text-white/60 mb-8 max-w-md">We combined prebiotics, botanicals, and plant fiber to create a delicious soda that’s actually good for you. No secrets, just science.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ingredients.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <div className="mt-1 p-0.5 bg-primary/20 rounded-full text-primary">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-white/40">{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square">
            <img 
              src="https://picsum.photos/seed/ingredients/800/800" 
              alt="Ingredients" 
              className="rounded-2xl object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              data-ai-hint="botanical ingredients"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function NutritionSection() {
  return (
    <section id="nutrition" className="py-24 bg-neutral-950 relative z-10 border-y border-white/5">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-4xl font-headline font-bold mb-12 uppercase tracking-tight">The Nutrition Facts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Sugars", val: "2-5g", sub: "Naturally occurring" },
            { label: "Fiber", val: "9g", sub: "Prebiotic power" },
            { label: "Calories", val: "35-50", sub: "Per can" },
          ].map((stat) => (
            <div key={stat.label} className="p-8 border border-white/10 rounded-2xl bg-black/40">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-5xl font-headline font-bold text-white mb-2">{stat.val}</h3>
              <p className="text-primary text-xs font-bold">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: "Sarah J.", rating: 5, text: "The Guava flavor is literally life-changing. I can't believe it only has 3g of sugar!" },
    { name: "Marcus T.", rating: 5, text: "Finally, a soda that doesn't make me feel bloated. Strawberry is my go-to." },
    { name: "Elena R.", rating: 4, text: "Love the brand aesthetic and the flavors are spot on. Can't wait for more variants." },
  ];

  return (
    <section id="reviews" className="py-24 bg-black relative z-10">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-headline font-bold text-center mb-16 uppercase">What People Are Saying</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Card key={i} className="bg-neutral-900 border-none">
              <CardHeader>
                <div className="flex gap-1 mb-4 text-primary">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <CardTitle className="text-lg font-headline">{review.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm leading-relaxed italic">"{review.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "What are prebiotics?", a: "Prebiotics are a type of fiber that feed the good bacteria in your gut." },
    { q: "Is Olipop gluten-free?", a: "Yes, all of our flavors are gluten-free and non-GMO." },
    { q: "How much sugar is in each can?", a: "Most of our flavors contain between 2g and 5g of natural sugar." },
  ];

  return (
    <section id="faq" className="py-24 bg-neutral-950 relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="text-4xl font-headline font-bold text-center mb-12 uppercase">FAQ</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left font-headline hover:no-underline hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/50">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-24 bg-black border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h2 className="text-3xl font-headline font-bold tracking-tighter mb-6">OLIPOP<span className="text-primary">.</span></h2>
            <p className="text-white/40 max-w-sm mb-8">Elevating the classic soda experience with functional ingredients that support your digestive health.</p>
            <div className="flex gap-6">
              {["Instagram", "Twitter", "Facebook"].map(social => (
                <a key={social} href="#" className="text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors">{social}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ingredients</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-xs text-white/20">
          <p>© {new Date().getFullYear()} Olipop Odyssey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
