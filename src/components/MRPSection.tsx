import { type Product, MACHINING_RATE_PER_HOUR } from "@/data/products";
import { Cog, Clock, Users, IndianRupee } from "lucide-react";

interface Props {
  product: Product;
  quantity: number;
}

const MRPSection = ({ product, quantity }: Props) => {
  const totalMachiningHours = product.machiningHoursPerUnit * quantity;
  const machiningCost = totalMachiningHours * MACHINING_RATE_PER_HOUR;
  const totalLaborCost = product.laborCostPerUnit * quantity;
  const totalRawMaterialCost = product.manufacturingCost * quantity * 0.45; // ~45% of mfg cost
  const totalManufacturingCost = machiningCost + totalLaborCost + totalRawMaterialCost;

  return (
    <div className="card-industrial p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2 mb-5">
        <Cog className="h-5 w-5 text-primary" />
        Material Requirement Planning (MRP)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Raw Materials */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Raw Materials Required
          </h3>
          <div className="space-y-2">
            {product.rawMaterials.map((rm) => (
              <div key={rm.name} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{rm.name}</span>
                <span className="font-semibold text-foreground">
                  {(rm.perUnit * quantity).toLocaleString("en-IN")} {rm.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Machining */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" /> Machining
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours/Unit</span>
              <span className="font-semibold text-foreground">{product.machiningHoursPerUnit} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Hours</span>
              <span className="font-semibold text-foreground">{totalMachiningHours} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Machining Cost</span>
              <span className="font-semibold text-primary">₹{machiningCost.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Labor */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-warning" /> Labor
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost/Unit</span>
              <span className="font-semibold text-foreground">₹{product.laborCostPerUnit.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Labor</span>
              <span className="font-semibold text-primary">₹{totalLaborCost.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Total Manufacturing */}
        <div className="rounded-xl gradient-industrial p-4 text-primary-foreground">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5" /> Total Manufacturing Cost
          </h3>
          <p className="text-3xl font-bold font-heading">₹{totalManufacturingCost.toLocaleString("en-IN")}</p>
          <p className="text-xs mt-2 opacity-80">
            Per unit: ₹{(totalManufacturingCost / quantity).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MRPSection;
