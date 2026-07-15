import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, Mail, Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { branches, type Branch } from "@/data/branches";
import { cn } from "@/lib/utils";

// Custom branded SVG map pin — no external images needed
function createBranchIcon(isSelected: boolean) {
  const fill = isSelected ? "#b5852a" : "#3d2010";
  const dot = isSelected ? "#b5852a" : "none";
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44" style="filter:drop-shadow(0 2px 5px rgba(0,0,0,.35))">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 6.088 3.39 11.386 8.37 14.17L16 44l7.63-13.83C28.61 27.386 32 22.088 32 16 32 7.163 24.837 0 16 0z" fill="${fill}"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.92"/>
      <circle cx="16" cy="16" r="3.5" fill="${dot}"/>
    </svg>`,
    className: "",
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44],
  });
}

// Smooth fly-to when selectedBranch changes
function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.2, easeLinearity: 0.25 });
  }, [lat, lng, map]);
  return null;
}

export default function FindUs() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [selectedId, setSelectedId] = useState<number>(branches[0].id);
  const branchRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedBranch = branches.find((b) => b.id === selectedId) ?? branches[0];

  useEffect(() => {
    document.title = t("findUs.pageTitle");
  }, [t]);

  const handleSelectBranch = (branch: Branch, index: number) => {
    setSelectedId(branch.id);
    // Slight delay so MapFlyTo fires first
    setTimeout(() => {
      branchRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <div className="bg-secondary/30 border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t("findUs.title")}
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            {t("findUs.subtitle")}
          </p>
        </div>
      </div>

      {/* Map + Branch list */}
      <div className="flex flex-col lg:flex-row">
        {/* Map — isolate creates new stacking context so Leaflet z-indices stay contained */}
        <div className="isolate w-full lg:w-[55%] h-[45vh] lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] shrink-0">
          <MapContainer
            center={[selectedBranch.lat, selectedBranch.lng]}
            zoom={12}
            className="w-full h-full"
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
            />
            {branches.map((branch, idx) => (
              <Marker
                key={branch.id}
                position={[branch.lat, branch.lng]}
                icon={createBranchIcon(branch.id === selectedId)}
                eventHandlers={{ click: () => handleSelectBranch(branch, idx) }}
              />
            ))}
            <MapFlyTo lat={selectedBranch.lat} lng={selectedBranch.lng} />
          </MapContainer>
        </div>

        {/* Branch list */}
        <div className="w-full lg:w-[45%] p-4 sm:p-6 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)]">
          <p className="hidden lg:block text-xs text-muted-foreground pb-1">
            {t("findUs.selectOnMap")}
          </p>

          {branches.map((branch, index) => {
            const isSelected = branch.id === selectedId;
            return (
              <div
                key={branch.id}
                ref={(el) => { branchRefs.current[index] = el; }}
                onClick={() => handleSelectBranch(branch, index)}
                className={cn(
                  "bg-card border rounded-xl p-5 cursor-pointer transition-all duration-200 select-none",
                  isSelected
                    ? "border-primary shadow-md ring-1 ring-primary/20"
                    : "border-border hover:border-primary/40 hover:shadow-sm"
                )}
              >
                {/* Name + address */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-serif text-xl font-bold text-foreground leading-tight">
                        {isAr ? branch.nameAr : branch.nameEn}
                      </h2>
                      {isSelected && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
                      <span>{isAr ? branch.addressAr : branch.addressEn}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {/* Hours */}
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      {t("findUs.openingHours")}
                    </p>
                    <ul className="space-y-1 text-muted-foreground ps-5">
                      {branch.hours.map((h, i) => (
                        <li key={i}>
                          <span className="font-medium text-foreground/80">
                            {isAr ? h.daysAr : h.daysEn}:
                          </span>{" "}
                          {isAr ? h.hoursAr : h.hoursEn}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 text-muted-foreground">
                    <a
                      href={`tel:${branch.phone}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      {/* Phone numbers are always LTR */}
                      <span dir="ltr">{branch.phone}</span>
                    </a>
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors min-w-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{branch.email}</span>
                    </a>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {t("findUs.services")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(isAr ? branch.servicesAr : branch.servicesEn).map((service) => (
                      <span
                        key={service}
                        className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Directions button */}
                <div className="mt-4 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {t("findUs.getDirections")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
