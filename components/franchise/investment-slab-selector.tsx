"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvestmentSlabProps {
  onSelect: (slab: string) => void
  selectedSlab?: string
}

const INVESTMENT_SLABS = [
  {
    id: "slab-1",
    title: "₹10–15 Lakh",
    description: "Basic franchise package with essential services",
    features: ["District-level operations", "Basic training", "Standard marketing support"],
  },
  {
    id: "slab-2",
    title: "₹15–25 Lakh",
    description: "Enhanced franchise package with additional services",
    features: [
      "Extended district coverage",
      "Advanced training",
      "Premium marketing support",
      "Priority vendor access",
    ],
  },
  {
    id: "slab-3",
    title: "₹25–30 Lakh",
    description: "Premium franchise package with comprehensive services",
    features: [
      "Multi-district operations",
      "Executive training",
      "Exclusive marketing campaigns",
      "VIP vendor network",
      "Dedicated support team",
    ],
  },
]

export function InvestmentSlabSelector({ onSelect, selectedSlab }: InvestmentSlabProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Investment Slab</h2>
      <p className="text-muted-foreground">Choose the investment range that suits your business goals</p>

      <div className="grid gap-4 md:grid-cols-3">
        {INVESTMENT_SLABS.map((slab) => (
          <Card
            key={slab.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedSlab === slab.id && "border-primary ring-2 ring-primary/20",
            )}
            onClick={() => onSelect(slab.id)}
          >
            <CardHeader>
              <CardTitle>{slab.title}</CardTitle>
              <CardDescription>{slab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Features</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(slab.id)
                    }}
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <ul
                  className={cn("space-y-1 text-sm transition-all", expanded !== slab.id && "max-h-20 overflow-hidden")}
                >
                  {slab.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedSlab === slab.id ? "default" : "outline"}
                className="w-full"
                onClick={() => onSelect(slab.id)}
              >
                {selectedSlab === slab.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
