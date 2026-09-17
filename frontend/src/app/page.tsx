import Link from "next/link";
import { 
  Leaf, 
  FlaskConical, 
  Truck, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Award,
  ShoppingBag,
  Thermometer,
  MapPin,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const featuredCategories = [
  {
    title: "Fresh Organic Vegetables",
    hindi: "जैविक सब्जियां (15+ Items)",
    description: "Unpeeled raw potatoes, red vine tomatoes, tender bhindi, carrots, garlic bulbs, ginger root, spinach.",
    moq: "MOQ 15 - 50 kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    icon: Leaf,
    href: "/products?category=vegetables"
  },
  {
    title: "Grains, Flours & Pulses",
    hindi: "अनाज व दालें (10+ Items)",
    description: "Whole wheat Aata, 1121 Aged Basmati Rice, unpolished Moong, Toor, Chana & Urad dal, Besan.",
    moq: "MOQ 30 - 100 kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    href: "/products?category=grains-pulses"
  },
  {
    title: "Whole & Ground Spices",
    hindi: "शुद्ध मसाले (10+ Items)",
    description: "High-curcumin Haldi, cold-milled Dhaniya, stemless Mirch powder, whole Cumin, Peppercorns, Elaichi.",
    moq: "MOQ 2 - 15 kg",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    href: "/products?category=spices"
  },
  {
    title: "Pure Dairy & Cold-Pressed Oils",
    hindi: "डेयरी व तेल (8+ Items)",
    description: "100% pure Paneer, A2 Cow Milk, Vedic Bilona Ghee, Kachi Ghani Mustard Oil, Sesame & Coconut oil.",
    moq: "MOQ 5 - 20 L/kg",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    icon: ShieldCheck,
    href: "/products?category=dairy-oils"
  }
];

const steps = [
  {
    title: "Stage 1: Pre-Harvest EXIF Lock",
    description: "FPO farmers upload geotagged, time-stamped smartphone photographs tracking natural crop growth, preventing chemical ripeners.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    icon: Leaf,
  },
  {
    title: "Stage 2: IoT Sensor Cold Chain",
    description: "Storage and transit temperature/humidity are continuously logged via IoT sensors to prevent bacterial and fungal decay.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    icon: Thermometer,
  },
  {
    title: "Stage 3: NABL Lab Certification",
    description: "Batch testing for protein, fat, carbohydrates, moisture, and 0% adulterant screening (urea, lead, pesticides, formalin).",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    icon: FlaskConical,
  },
];

const stats = [
  { label: "Pure Raw Food Catalog", value: "52 Items" },
  { label: "Active FBO Hotel Partners", value: "120+" },
  { label: "NABL Adulteration Guarantee", value: "0% Adulterants" },
  { label: "Menu Pricing Premium", value: "+15% to 20%" },
];

export default function LandingPage() {
  return (
    <div className="flex-1">
      {/* Navigation Header */}
      <header className="glass-panel sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary">
            <ShieldCheck size={28} className="text-primary" />
            <span>JPureva</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <Link href="/" className="text-primary font-semibold">
              Home
            </Link>
            <Link href="/about" className="text-foreground-secondary transition-colors hover:text-foreground">
              About JPureva
            </Link>
            <Link href="/products" className="text-foreground-secondary transition-colors hover:text-foreground">
              B2B Marketplace (50+ Items)
            </Link>
            <Link href="/browse" className="text-foreground-secondary transition-colors hover:text-foreground">
              Live Marketplace
            </Link>
            <Link href="/hotel/subscription" className="text-foreground-secondary transition-colors hover:text-foreground">
              SaaS Plans
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-semibold text-foreground-secondary hover:text-foreground hidden sm:block">
              Log in
            </Link>
            <Button href="/products" variant="accent" size="sm">
              Explore 50+ Products
            </Button>
          </div>
        </div>
      </header>

      {/* Visual Hero Section with Background Photo */}
      <section className="bg-glow-hero relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80"
            alt="Organic Produce Market"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 shadow-soft">
            <ShieldCheck size={14} /> Trust-As-A-Service & Pure B2B Sourcing
          </div>

          <h1 className="mx-auto max-w-4xl text-balance font-heading text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-6xl">
            Farm to Kitchen, Verified. <br />
            <span className="text-gradient-emerald">100% Pure Raw Food Materials</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground-secondary">
            JPureva connects Farmer Producer Organizations (FPOs), NABL-accredited Labs, and Hotels/Restaurants — supplying unadulterated raw produce, grains, spices, and dairy with Minimum Order Quantities (MOQ) and QR Trust Badges.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button href="/products" variant="accent" size="lg" className="shadow-glow-accent">
              <ShoppingBag size={18} className="mr-1" /> Browse 50+ B2B Products
            </Button>
            <Button href="/about" variant="outline" size="lg">
              Read JPureva Story & Vision <ArrowRight size={16} />
            </Button>
          </div>

          {/* Guaranteed Pure Raw Notice Banner */}
          <div className="pt-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-surface/90 px-6 py-3 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lifted">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>Strictly 100% Pure Raw Food Produce. No chopped veggies, no pre-cooked kits, zero artificial additives.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured 50+ B2B Products Category Showcase with Photo Cards */}
      <section className="mx-auto max-w-6xl px-6 py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Direct Hotel Sourcing</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              50+ Pure Raw Food Materials & Staples
            </h2>
            <p className="mt-2 text-sm text-foreground-secondary">
              Procure directly from verified FPOs with explicit Minimum Order Quantities (MOQ) and NABL lab test certificates.
            </p>
          </div>
          <Button href="/products" variant="outline" size="sm">
            View All 50+ Products <ArrowRight size={14} />
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((c) => (
            <Card key={c.title} className="overflow-hidden border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lifted group flex flex-col justify-between">
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 rounded-full bg-accent/90 border border-accent-light/30 px-2.5 py-0.5 text-[10px] font-bold uppercase text-on-accent shadow">
                    {c.moq}
                  </div>
                </div>

                <CardBody className="space-y-2 p-4">
                  <h3 className="font-heading text-base font-bold text-foreground leading-tight">{c.title}</h3>
                  <p className="text-xs font-medium text-primary">{c.hindi}</p>
                  <p className="text-xs leading-relaxed text-foreground-secondary line-clamp-2">{c.description}</p>
                </CardBody>
              </div>

              <div className="p-4 pt-0">
                <Link href={c.href} className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline pt-2 border-t border-border w-full justify-between">
                  <span>Explore Category</span> <ArrowRight size={12} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works: 3-Stage Quality Lock with Real Images */}
      <section className="bg-surface-muted py-20 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-light">Scientific Verification</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How JPureva Locks Quality
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-foreground-secondary">
              From EXIF pre-harvest photos to IoT cold chain sensors and NABL chemical lab testing.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="overflow-hidden border border-border bg-surface text-center space-y-4 transition-all hover:-translate-y-1">
                <div className="h-44 w-full relative overflow-hidden bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
                    Stage {i + 1}
                  </div>
                </div>

                <CardBody className="p-5 pt-0 space-y-2">
                  <h3 className="font-heading text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-foreground-secondary">{s.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button href="/about" variant="outline" size="sm">
              Read Detailed Traceability Framework <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-semibold text-accent-light">
              <QrCode size={16} /> Restaurant Trust Badge
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dynamic QR Code For Hotel Menus & Tables
            </h2>
            <p className="leading-relaxed text-foreground-secondary text-sm">
              Every hotel procuring JPureva verified raw materials receives a QR Trust Badge. 
              Diners scan the QR code to view live farm origin photos, cold chain history, and NABL lab reports (Protein %, Fat %, 0% Adulterants), justifying up to a 20% menu premium.
            </p>
            <div className="pt-2">
              <Button href="/about" variant="accent" size="sm">
                Learn About Trust Badges <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          <Card className="p-8 text-center border-primary/30 shadow-lifted">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-surface-muted">
              <QrCode size={80} className="text-primary/60" />
            </div>
            <p className="mt-4 text-xs font-semibold text-foreground">Scan Live QR Code</p>
            <p className="mt-1 text-[11px] text-foreground-tertiary">Displays Farm Origin & Lab Certificate to Diners</p>
          </Card>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-emerald-900 py-16 text-on-primary sm:py-20 shadow-glow-primary">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl font-extrabold tracking-tight text-accent-light sm:text-4xl">{s.value}</div>
              <div className="mt-2 text-xs font-medium text-on-primary/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-foreground-tertiary space-y-2">
          <p className="font-heading text-sm text-foreground">JPureva — Monetizing Food Trust</p>
          <p>© {new Date().getFullYear()} JPureva Agritech & Food Safety SaaS. 100% Pure Raw Sourcing.</p>
        </div>
      </footer>
    </div>
  );
}
