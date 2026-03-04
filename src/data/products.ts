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
  {
    id: "coupling-flange",
    name: "Coupling Flange",
    mrp: 5500,
    manufacturingCost: 2800,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    dimensions: "250 × 250 × 60 mm",
    weight: "7.5 kg",
    material: "Forged Steel (EN8)",
    specs: ["Alignment Tolerance: 0.03 mm", "Surface Finish: Ra 1.2", "Bolt Circle: 200 mm PCD", "Torque Rating: 850 Nm"],
    rawMaterials: [
      { name: "EN8 Steel Forging", unit: "kg", perUnit: 11 },
      { name: "High-Tensile Bolts (M14)", unit: "pcs", perUnit: 6 },
      { name: "Rubber Bush", unit: "pcs", perUnit: 6 },
    ],
    machiningHoursPerUnit: 3.5,
    laborCostPerUnit: 700,
  },
  {
    id: "cylinder-liner",
    name: "Cylinder Liner",
    mrp: 7800,
    manufacturingCost: 4200,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    dimensions: "300 × 120 × 120 mm",
    weight: "9.4 kg",
    material: "Centrifugal Cast Iron",
    specs: ["Bore Finish: Ra 0.4", "Ovality: < 0.01 mm", "Hardness: 220-260 BHN", "Wall Thickness: 8 mm"],
    rawMaterials: [
      { name: "Centrifugal Cast Iron", unit: "kg", perUnit: 14 },
      { name: "Honing Stones", unit: "pcs", perUnit: 1 },
      { name: "O-Ring Seals", unit: "pcs", perUnit: 3 },
    ],
    machiningHoursPerUnit: 5,
    laborCostPerUnit: 950,
  },
  {
    id: "crankshaft",
    name: "Crankshaft",
    mrp: 18500,
    manufacturingCost: 10200,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
    dimensions: "800 × 150 × 150 mm",
    weight: "35 kg",
    material: "Micro-Alloy Forged Steel",
    specs: ["Journal Finish: Ra 0.2", "Dynamic Balancing: G2.5", "Hardness: 50-55 HRC (journals)", "Fillet Radius: R3 mm"],
    rawMaterials: [
      { name: "Forged Steel Billet", unit: "kg", perUnit: 50 },
      { name: "Counterweights", unit: "pcs", perUnit: 4 },
      { name: "Woodruff Key", unit: "pcs", perUnit: 2 },
    ],
    machiningHoursPerUnit: 12,
    laborCostPerUnit: 2200,
  },
  {
    id: "valve-body",
    name: "Valve Body",
    mrp: 9200,
    manufacturingCost: 5000,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ede4c68?w=400&h=300&fit=crop",
    dimensions: "280 × 220 × 180 mm",
    weight: "14 kg",
    material: "Stainless Steel (SS316)",
    specs: ["Pressure Rating: 25 bar", "Seat Leakage: Class VI", "End Connection: Flanged", "Cv Value: 120"],
    rawMaterials: [
      { name: "SS316 Casting", unit: "kg", perUnit: 20 },
      { name: "PTFE Seat Ring", unit: "pcs", perUnit: 1 },
      { name: "Stem Packing", unit: "sets", perUnit: 1 },
      { name: "Stud Bolts (M16)", unit: "pcs", perUnit: 8 },
    ],
    machiningHoursPerUnit: 6,
    laborCostPerUnit: 1100,
  },
  {
    id: "piston-assembly",
    name: "Piston Assembly",
    mrp: 6800,
    manufacturingCost: 3600,
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop",
    dimensions: "120 × 120 × 150 mm",
    weight: "4.2 kg",
    material: "Aluminium Alloy (LM25)",
    specs: ["Skirt Clearance: 0.05 mm", "Ring Groove: 3 compression + 1 oil", "Gudgeon Pin: Floating", "Coating: Graphite"],
    rawMaterials: [
      { name: "LM25 Aluminium", unit: "kg", perUnit: 6 },
      { name: "Piston Rings", unit: "sets", perUnit: 1 },
      { name: "Gudgeon Pin", unit: "pcs", perUnit: 1 },
      { name: "Circlips", unit: "pcs", perUnit: 2 },
    ],
    machiningHoursPerUnit: 3.5,
    laborCostPerUnit: 650,
  },
  {
    id: "gearbox-casing",
    name: "Gearbox Casing",
    mrp: 15000,
    manufacturingCost: 8200,
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=400&h=300&fit=crop",
    dimensions: "450 × 350 × 300 mm",
    weight: "28 kg",
    material: "Aluminium Alloy (A356)",
    specs: ["Bore Concentricity: 0.02 mm", "Oil Capacity: 4.5 L", "Noise Level: < 72 dB", "IP Rating: IP65"],
    rawMaterials: [
      { name: "A356 Aluminium Casting", unit: "kg", perUnit: 38 },
      { name: "Shaft Seals", unit: "pcs", perUnit: 3 },
      { name: "Inspection Cover Gasket", unit: "pcs", perUnit: 1 },
      { name: "Drain Plug", unit: "pcs", perUnit: 1 },
    ],
    machiningHoursPerUnit: 10,
    laborCostPerUnit: 1800,
  },
];

export const GST_RATE = 0.18;
export const MACHINING_RATE_PER_HOUR = 450;
