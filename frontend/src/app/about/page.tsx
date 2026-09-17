import Link from "next/link";
import { 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  Thermometer, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle,
  Award,
  BadgePercent,
  Sparkles,
  MapPin,
  FileText
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About JPureva | Trust-as-a-Service & Verified Raw B2B Sourcing",
  description: "JPureva connects Farmer Producer Organizations (FPOs), NABL Accredited Labs, and Hotels/Restaurants to eliminate food adulteration at the source with 100% pure raw food materials.",
};

const qualityStages = [
  {
    stage: "Stage 1",
    title: "Pre-Harvest Field Monitoring",
    subtitle: "EXIF Geotagged Field Lock",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    color: "from-emerald-500/20 to-emerald-700/10 text-emerald-400 border-emerald-500/30",
    badge: "Anti-Chemical Lock",
    description: "Farmers upload EXIF-locked, time-stamped geotagged smartphone photographs of growing crops. The system verifies natural maturation timelines, systematically preventing artificial chemical ripening or illegal growth-hormone injections."
  },
  {
    stage: "Stage 2",
    title: "Post-Harvest IoT Cold Chain",
    subtitle: "Sensor-Monitored Transit & Storage",
    icon: Thermometer,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    color: "from-cyan-500/20 to-cyan-700/10 text-cyan-400 border-cyan-500/30",
    badge: "Biological Shield",
    description: "Ambient storage and refrigerated cold chain transits are continuously logged using networked IoT heat and moisture sensors, actively preventing fungal, bacterial, and moisture degradation during transport."
  },
  {
    stage: "Stage 3",
    title: "NABL Laboratory Validation",
    subtitle: "Scientific Chemical & Biological Audit",
    icon: FlaskConical,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    color: "from-purple-500/20 to-purple-700/10 text-purple-400 border-purple-500/30",
    badge: "100% Pure Certificate",
    description: "Every consolidated batch undergoes strict testing at NABL-accredited partner facilities for Protein %, Fat %, Moisture %, and 0% Adulterant screening (Urea, Lead, Pesticides, Formalin). Dynamically calculates batch shelf-life."
  }
];

const fpoPartners = [
  {
    name: "Jaipur Farmers Producer Org",
    location: "Chomu, Rajasthan",
    focus: "Organic Raw Vegetables & Garlic",
    certificate: "FPO-RAJ-2026-081",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Alwar Dairy Farmers Cooperative",
    location: "Alwar, Rajasthan",
    focus: "100% Pure A2 Dairy & Paneer",
    certificate: "FPO-RAJ-2026-012",
    image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Nashik Horticultural FPO",
    location: "Nashik, Maharashtra",
    focus: "Desi Tomatoes & Export Onions",
    certificate: "FPO-MAH-2026-044",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Lakadong Turmeric Growers",
    location: "Jaintia Hills, Meghalaya",
    focus: "5.2% High-Curcumin Turmeric",
    certificate: "FPO-MEG-2026-004",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
  }
];

const revenueStreams = [
  { stream: "Verified Raw Ingredient Sales", share: "65%", type: "Primary Supply Margins", desc: "Wholesale procurement directly from verified FPOs delivered to B2B hospitality clients with verified safety markup." },
  { stream: "SaaS Subscriptions", share: "15%", type: "Predictable Software ARR", desc: "Cloud platform for restaurants (Basic ₹2k/mo, Pro ₹5k/mo, Enterprise ₹10k/mo) for inventory, demand forecasting & compliance." },
  { stream: "NABL Laboratory Testing", share: "7%", type: "Transaction-Based Fees", desc: "Third-party testing services for adulteration, heavy metals, and microbiological screening with platform commission." },
  { stream: "JPureva QR Trust Badge", share: "5%", type: "Annual Subscription", desc: "Verified branding subscription for restaurants displaying live QR codes on table standees and digital delivery menus." },
  { stream: "Enterprise Analytics & Data", share: "5%", type: "Data Intelligence", desc: "Aggregated, anonymized intelligence on regional food demand, quality trends, and seasonal yield forecasting." },
  { stream: "Certification & Audit Services", share: "3%", type: "Project Contracting", desc: "FSSAI, HACCP, and ISO 22000 compliance training, food safety audits, and documentation support." },
];

export default function AboutPage() {
  return (
    <div className="flex-1 space-y-20 pb-24">
      {/* Navigation Header */}
      <header className="glass-panel sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-primary">
            <ShieldCheck size={28} className="text-primary" />
            <span>JPureva</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <Link href="/" className="text-foreground-secondary transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/about" className="text-primary font-semibold">
              About JPureva
            </Link>
            <Link href="/products" className="text-foreground-secondary transition-colors hover:text-foreground">
              B2B Marketplace (50+ Items)
            </Link>
            <Link href="/hotel/subscription" className="text-foreground-secondary transition-colors hover:text-foreground">
              SaaS Plans
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/products" variant="accent" size="sm">
              Procure Raw Produce
            </Button>
          </div>
        </div>
      </header>

      {/* Visual Hero Banner with High Impact Farm Image Overlay */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 bg-glow-hero">
        <div className="absolute inset-0 z-0 opacity-15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
            alt="Farm Hero"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-light shadow-soft">
            <Sparkles size={14} /> Trust-as-a-Service Infrastructure
          </div>

          <h1 className="font-heading text-4xl leading-[1.1] font-extrabold text-foreground sm:text-6xl">
            Monetizing Food Trust: <br />
            <span className="text-gradient-emerald">100% Pure Raw Sourcing</span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground-secondary">
            JPureva turns invisible food safety into verifiable, revenue-generating science. 
            We bypass punitive kitchen audits by controlling physical raw materials directly at the agricultural source — supplying unadulterated raw produce, grains, spices, and dairy directly to hotels and restaurants.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button href="/products" variant="accent" size="lg" className="shadow-glow-accent">
              Explore 50+ Verified Raw Materials <ArrowRight size={18} className="ml-1" />
            </Button>
            <Button href="/hotel/subscription" variant="outline" size="lg">
              View SaaS Trust Badge Plans
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 gap-4 rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-md sm:grid-cols-4 shadow-lifted">
            <div className="text-center">
              <div className="font-heading text-3xl font-extrabold text-primary">100%</div>
              <div className="mt-1 text-xs font-semibold text-foreground-secondary">Pure Raw Farm Produce</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-extrabold text-accent-light">3-Stage</div>
              <div className="mt-1 text-xs font-semibold text-foreground-secondary">EXIF, IoT & NABL Lock</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-extrabold text-primary">+15-20%</div>
              <div className="mt-1 text-xs font-semibold text-foreground-secondary">Menu Price Premium</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-extrabold text-emerald-400">0%</div>
              <div className="mt-1 text-xs font-semibold text-foreground-secondary">Adulterant Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Uncompromising Raw Guarantee Section with Kitchen Chef Image */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-surface shadow-lifted">
          <div className="grid lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <CheckCircle2 size={16} /> Our Uncompromising Raw Guarantee
              </div>

              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                We Supply Only 100% Pure Raw Materials. No Chopped or Pre-Cooked Items.
              </h2>

              <p className="text-sm leading-relaxed text-foreground-secondary">
                At JPureva, we believe kitchen chefs deserve complete culinary control over authentic ingredients. We supply strictly <strong className="text-foreground">100% unadulterated raw agricultural produce</strong> — fresh farm vegetables, whole grains, unpolished pulses, cold-pressed oils, pure whole spices, and raw A2 dairy. Every batch is NABL tested for protein %, fat %, moisture, and zero adulterants.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Zero Preservatives / Bleach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Verified FPO Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>NABL Chemical Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>IoT Cold Chain Monitored</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                alt="Chef in Kitchen"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* The Ecosystem Problem with Visual Comparison */}
      <section className="mx-auto max-w-6xl px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-light">Market Friction Analysis</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Ecosystem Dilemma: Invisible Trust
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-foreground-secondary">
            Standard delivery ratings reflect speed and packaging, while biological purity remains entirely hidden.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Card 1: Consumer Dilemma */}
          <Card className="overflow-hidden border-red-500/30 bg-surface">
            <div className="h-44 w-full relative overflow-hidden bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Food Delivery Rating"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              <div className="absolute top-4 left-4 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-400 backdrop-blur-md flex items-center gap-1.5">
                <AlertTriangle size={14} /> The Consumer&apos;s Dilemma
              </div>
            </div>

            <CardBody className="space-y-4 pt-2">
              <h3 className="font-heading text-xl font-bold text-foreground">1. The Rating Illusion</h3>
              <p className="text-xs leading-relaxed text-foreground-secondary">
                Consumers face persistent food safety anxiety. Standard 5-star delivery platform ratings reflect speed and packaging rather than biological purity. Sourcing and adulterant data remain hidden.
              </p>
            </CardBody>
          </Card>

          {/* Card 2: Merchant Price War */}
          <Card className="overflow-hidden border-amber-500/30 bg-surface">
            <div className="h-44 w-full relative overflow-hidden bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                alt="Chef in Kitchen"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              <div className="absolute top-4 left-4 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md flex items-center gap-1.5">
                <BadgePercent size={14} /> Honest Merchant&apos;s War
              </div>
            </div>

            <CardBody className="space-y-4 pt-2">
              <h3 className="font-heading text-xl font-bold text-foreground">2. Unfair Price Wars</h3>
              <p className="text-xs leading-relaxed text-foreground-secondary">
                Honest cafes and hotels spending heavily on genuine organic raw materials cannot prove their invisible efforts to diners, forcing them into brutal price wars with low-quality cheap operators.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* The 3-Stage Quality Lock with Real Images */}
      <section className="bg-surface-muted py-20 sm:py-28 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Proprietary Traceability Tech</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The Three-Stage Quality Lock
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-foreground-secondary">
              Our end-to-end framework verifies raw materials at every physical transition point from seed to hotel kitchen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {qualityStages.map((qs) => (
              <Card key={qs.stage} className="overflow-hidden border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted flex flex-col justify-between">
                <div>
                  <div className="h-48 w-full relative overflow-hidden bg-surface-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qs.image}
                      alt={qs.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 rounded-full bg-surface/80 border border-border px-3 py-1 text-[11px] font-bold text-foreground backdrop-blur-md">
                      {qs.stage}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {qs.badge}
                      </span>
                    </div>
                  </div>

                  <CardBody className="space-y-3">
                    <h3 className="font-heading text-lg font-bold text-foreground">{qs.title}</h3>
                    <p className="text-xs font-semibold text-primary">{qs.subtitle}</p>
                    <p className="text-xs leading-relaxed text-foreground-secondary">{qs.description}</p>
                  </CardBody>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner FPO Spotlight Section with Real Farm Photos */}
      <section className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Source Agricultural Network</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verified Farmer Producer Organizations (FPOs)
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-foreground-secondary">
            We contract directly with regional agricultural cooperatives, eliminating middlemen and guaranteeing 100% fair trade.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fpoPartners.map((fpo) => (
            <Card key={fpo.name} className="overflow-hidden border border-border bg-surface transition-all hover:-translate-y-1">
              <div className="h-40 w-full relative overflow-hidden bg-surface-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fpo.image} alt={fpo.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
              </div>
              <CardBody className="space-y-2 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-light flex items-center gap-1">
                  <MapPin size={12} /> {fpo.location}
                </span>
                <h3 className="font-heading text-base font-bold text-foreground leading-tight">{fpo.name}</h3>
                <p className="text-xs font-medium text-primary">{fpo.focus}</p>
                <p className="text-[10px] font-mono text-foreground-tertiary pt-1 border-t border-border">
                  Cert: {fpo.certificate}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Dynamic QR Trust Badge & Consumer Portal */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              <QrCode size={16} /> Direct Consumer Verification
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The Interactive JPureva Trust Badge
            </h2>
            <p className="text-sm leading-relaxed text-foreground-secondary">
              Hotels procuring JPureva verified raw materials receive dynamic QR Trust Badges for physical table standees, menus, and online delivery apps. 
              Diners scan the QR code to instantly inspect the exact farm origin, harvest time, cold-chain stability log, and NABL lab certificate of their food.
            </p>

            <div className="space-y-3 rounded-2xl border border-border bg-surface p-5 text-xs">
              <div className="flex items-center gap-3 font-semibold text-foreground">
                <CheckCircle2 size={18} className="text-primary" />
                <span>FPO Sourced: Jaipur Dairy Cooperative & Nashik Farms</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-foreground">
                <CheckCircle2 size={18} className="text-primary" />
                <span>Cold Storage IoT: Validated at 4°C Stability</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-foreground">
                <CheckCircle2 size={18} className="text-primary" />
                <span>NABL Lab Report: 0% Adulterants (0% Urea, Lead, Starch)</span>
              </div>
            </div>

            <div className="pt-2">
              <Button href="/hotel/subscription" variant="accent" size="lg">
                Activate Trust Badge For Your Restaurant <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <Card className="p-8 text-center border-primary/30 bg-gradient-to-br from-surface via-surface-muted to-surface shadow-lifted">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-surface shadow-inner">
              <QrCode size={96} className="text-primary" />
            </div>
            <div className="mt-6 font-heading text-xl font-bold text-foreground">Scan Live Trust Badge</div>
            <p className="mt-2 text-xs text-foreground-tertiary">
              Diners scan to view NABL lab reports, protein/fat parameters, and EXIF farm origin dates.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-accent-light">
              <Award size={16} /> Justifies +15% to 20% Menu Price Premium
            </div>
          </Card>
        </div>
      </section>

      {/* Revenue Model Breakdown */}
      <section className="bg-surface-muted py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-light">Financial Structure</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              JPureva Revenue Model & Target Mix
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-foreground-secondary">
              A hybrid B2B supply chain, SaaS, and food trust platform with high-margin recurring monetization.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted text-xs uppercase text-foreground-tertiary">
                  <tr>
                    <th className="px-6 py-4 font-bold">Revenue Stream</th>
                    <th className="px-6 py-4 font-bold">Revenue Model Type</th>
                    <th className="px-6 py-4 font-bold text-center">Target Share</th>
                    <th className="px-6 py-4 font-bold">Key Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {revenueStreams.map((rs, idx) => (
                    <tr key={rs.stream} className={idx % 2 === 0 ? "bg-surface" : "bg-surface-muted/30"}>
                      <td className="px-6 py-4 font-heading font-semibold text-foreground">{rs.stream}</td>
                      <td className="px-6 py-4 font-medium text-primary">{rs.type}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block rounded-full bg-accent/15 px-3 py-1 font-heading text-xs font-bold text-accent-light">
                          {rs.share}
                        </span>
                      </td>
                      <td className="px-6 py-4 leading-relaxed text-foreground-secondary">{rs.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-emerald-900 p-10 text-center text-on-primary shadow-glow-primary sm:p-16 space-y-6">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Supply 100% Pure Raw Materials to Your Kitchen?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-on-primary/80 leading-relaxed">
            Join 120+ pilot hotels, restaurants, and cloud kitchens procuring verified organic vegetables, grains, spices, and dairy with NABL certificates and MOQs.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button href="/products" variant="accent" size="lg" className="shadow-lifted">
              Procure Verified Raw Produce <ArrowRight size={18} />
            </Button>
            <Button href="/register/hotel" variant="outline" size="lg" className="border-on-primary/30 text-on-primary hover:bg-on-primary/10">
              Register as Hotel Buyer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
