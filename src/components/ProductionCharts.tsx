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

      {/* Machine Loading */}
      <div className="lg:col-span-3 card-industrial p-6">
        <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          Machine Loading Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {machineData.map((machine) => (
            <div key={machine.name} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(215, 25%, 88%)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={machine.utilization > 90 ? "hsl(0, 72%, 51%)" : machine.utilization > 75 ? "hsl(38, 92%, 50%)" : "hsl(142, 76%, 36%)"}
                    strokeWidth="3"
                    strokeDasharray={`${machine.utilization}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                  {machine.utilization}%
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{machine.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionCharts;
