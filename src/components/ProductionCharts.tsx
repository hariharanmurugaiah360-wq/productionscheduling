import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

const productionData = [
  { month: "Aug", output: 420, capacity: 500 },
  { month: "Sep", output: 460, capacity: 500 },
  { month: "Oct", output: 380, capacity: 500 },
  { month: "Nov", output: 510, capacity: 550 },
  { month: "Dec", output: 480, capacity: 550 },
  { month: "Jan", output: 530, capacity: 550 },
  { month: "Feb", output: 490, capacity: 600 },
];


const dispatchData = [
  { name: "On Time", value: 68, color: "hsl(142, 76%, 36%)" },
  { name: "Delayed", value: 12, color: "hsl(0, 72%, 51%)" },
  { name: "In Transit", value: 20, color: "hsl(217, 91%, 50%)" },
];

const ProductionCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
      {/* Production Timeline */}
      <div className="lg:col-span-2 card-industrial p-6">
        <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          Production Capacity vs Output
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(215, 25%, 88%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="capacity" fill="hsl(215, 25%, 88%)" radius={[4, 4, 0, 0]} name="Capacity" />
              <Bar dataKey="output" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} name="Output" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dispatch Status */}
      <div className="card-industrial p-6">
        <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Dispatch Status
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dispatchData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {dispatchData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {dispatchData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name} ({d.value}%)
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductionCharts;
