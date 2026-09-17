"use client";

import { X, ShieldCheck, Download, Award, Thermometer, Calendar, Leaf, CheckCircle2, FileText } from "lucide-react";
import type { RawProduct } from "@/lib/data/products";

interface LabReportModalProps {
  product: RawProduct | null;
  onClose: () => void;
}

export function LabReportModal({ product, onClose }: LabReportModalProps) {
  if (!product) return null;

  const lab = product.labDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/25 bg-surface shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-surface-muted via-surface-muted to-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">NABL Official Test Certificate</h3>
              <p className="text-xs text-foreground-tertiary">Certificate ID: {lab.nablReportNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-foreground-tertiary hover:bg-surface-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {/* Produce Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-muted p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light">Verified Item</span>
              <h4 className="font-heading text-xl font-bold text-foreground">{product.name}</h4>
              <p className="text-xs text-foreground-secondary">{product.hindiName}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-bold text-primary">
                {lab.purityPercentage}% Biological Purity
              </span>
              <p className="mt-1 text-[11px] text-foreground-tertiary">Tested: {lab.testedDate}</p>
            </div>
          </div>

          {/* FPO Origin & EXIF Lock */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Leaf size={14} /> FPO Farm Source
              </div>
              <p className="font-bold text-foreground">{product.fpoSource.name}</p>
              <p className="text-foreground-tertiary">{product.fpoSource.location}</p>
              <p className="text-[10px] font-mono text-foreground-tertiary pt-1">ID: {product.fpoSource.certificateId}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-accent-light">
                <Thermometer size={14} /> Storage & Shelf Life
              </div>
              <p className="font-bold text-foreground">{product.shelfLife}</p>
              <p className="text-foreground-tertiary">Max Expiry: {product.expiryDays} Days from harvest</p>
              <p className="text-[10px] text-primary font-semibold pt-1">IoT Cold Chain Verified</p>
            </div>
          </div>

          {/* Chemical Safety & Adulterant Screening (100% Zero Adulterant Guarantee) */}
          <div className="rounded-xl border border-primary/25 bg-primary/10 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Chemical & Adulterant Safety Screening
              </span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-extrabold">PASSED 100%</span>
            </div>
            <p className="text-xs font-semibold text-primary font-mono leading-relaxed">
              ✓ {lab.adulterants}
            </p>
          </div>

          {/* Nutritional Breakdown Table */}
          <div>
            <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <FileText size={14} className="text-primary" /> Certified Nutritional & Quality Parameters (per 100g / unit)
            </h5>

            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-surface-muted p-3 text-center">
                <span className="text-[10px] font-semibold text-foreground-tertiary uppercase">Protein</span>
                <p className="font-heading text-base font-bold text-primary mt-1">{lab.protein}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-3 text-center">
                <span className="text-[10px] font-semibold text-foreground-tertiary uppercase">Fat Content</span>
                <p className="font-heading text-base font-bold text-accent-light mt-1">{lab.fat}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-3 text-center">
                <span className="text-[10px] font-semibold text-foreground-tertiary uppercase">Carbohydrates</span>
                <p className="font-heading text-base font-bold text-foreground mt-1">{lab.carbohydrates}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-3 text-center">
                <span className="text-[10px] font-semibold text-foreground-tertiary uppercase">Moisture Level</span>
                <p className="font-heading text-base font-bold text-primary mt-1">{lab.moisture}</p>
              </div>
            </div>
          </div>

          {/* Official Stamp & Download Action */}
          <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
            <div className="flex items-center gap-2 text-foreground-tertiary">
              <Award className="text-accent" size={18} />
              <span>Verified by NABL Accredited FoodSafe Partner Labs</span>
            </div>
            <button
              onClick={() => alert(`Downloading official PDF Certificate: ${lab.nablReportNo}`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              <Download size={14} /> Download Certificate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
