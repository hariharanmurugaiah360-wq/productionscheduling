import { type Product } from "@/data/products";
import { Box, Ruler, Weight, Wrench } from "lucide-react";

interface Props {
  product: Product;
}

const ProductPreview = ({ product }: Props) => {
  return (
    <div className="card-industrial overflow-hidden animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-foreground">{product.name}</h3>
          <p className="text-2xl font-bold text-primary mt-1">₹{product.mrp.toLocaleString("en-IN")}</p>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="h-4 w-4 text-primary" />
            <span>{product.dimensions}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Weight className="h-4 w-4 text-primary" />
            <span>{product.weight}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Box className="h-4 w-4 text-primary" />
            <span>{product.material}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> Specifications
          </h4>
          <ul className="space-y-1">
            {product.specs.map((spec) => (
              <li key={spec} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
