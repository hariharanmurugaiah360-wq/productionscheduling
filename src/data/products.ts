export interface Product {
  id: string;
  name: string;
  mrp: number;
  manufacturingCost: number;
  image: string;
  dimensions: string;
  weight: string;
  material: string;
  specs: string[];
  rawMaterials: { name: string; unit: string; perUnit: number }[];
  machiningHoursPerUnit: number;
  laborCostPerUnit: number;
}

export const products: Product[] = [
  {
    id: "pump-housing",
    name: "Pump Housing",
    mrp: 8500,
    manufacturingCost: 4800,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    dimensions: "320 × 280 × 150 mm",
    weight: "12.5 kg",
    material: "Cast Iron (Grade 25)",
    specs: ["Pressure Rating: 16 bar", "Surface Finish: Ra 1.6", "Tolerance: ±0.05 mm", "Heat Treatment: Normalized"],
    rawMaterials: [
      { name: "Cast Iron", unit: "kg", perUnit: 18 },
      { name: "Copper Gasket", unit: "pcs", perUnit: 2 },
      { name: "Fasteners (M12)", unit: "pcs", perUnit: 8 },
    ],
    machiningHoursPerUnit: 4.5,
    laborCostPerUnit: 850,
  },
  {
    id: "gear-shaft",
    name: "Gear Shaft",
    mrp: 6200,
    manufacturingCost: 3200,
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=300&fit=crop",
    dimensions: "450 × 65 × 65 mm",
    weight: "8.2 kg",
    material: "EN24 Steel (Alloy Steel)",
    specs: ["Hardness: 58-62 HRC", "Surface Finish: Ra 0.8", "Tolerance: ±0.02 mm", "Gear Module: 3"],
    rawMaterials: [
      { name: "EN24 Steel Bar", unit: "kg", perUnit: 12 },
      { name: "Keyway Insert", unit: "pcs", perUnit: 1 },
    ],
    machiningHoursPerUnit: 6,
    laborCostPerUnit: 1100,
  },
  {
    id: "bearing-housing",
    name: "Bearing Housing",
    mrp: 4800,
    manufacturingCost: 2400,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
    dimensions: "200 × 200 × 120 mm",
    weight: "6.8 kg",
    material: "SG Iron (Ductile Iron)",
    specs: ["Bore Tolerance: H7", "Surface Finish: Ra 1.6", "Max RPM: 3000", "Sealing: Labyrinth"],
    rawMaterials: [
      { name: "SG Iron", unit: "kg", perUnit: 10 },
      { name: "Bearing (6310)", unit: "pcs", perUnit: 2 },
      { name: "Oil Seal", unit: "pcs", perUnit: 2 },
    ],
    machiningHoursPerUnit: 3,
    laborCostPerUnit: 600,
  },
  {
    id: "flywheel",
    name: "Flywheel Assembly",
    mrp: 12000,
    manufacturingCost: 6500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    dimensions: "500 × 500 × 80 mm",
    weight: "22 kg",
    material: "Cast Steel",
    specs: ["Balancing Grade: G6.3", "Max RPM: 1500", "Moment of Inertia: 2.5 kg·m²", "Hub Bore: H7"],
    rawMaterials: [
      { name: "Cast Steel", unit: "kg", perUnit: 30 },
      { name: "Balancing Weights", unit: "pcs", perUnit: 4 },
      { name: "Hub Bolts (M16)", unit: "pcs", perUnit: 6 },
    ],
    machiningHoursPerUnit: 8,
    laborCostPerUnit: 1500,
  },
];

export const GST_RATE = 0.18;
export const MACHINING_RATE_PER_HOUR = 450; // ₹ per hour
