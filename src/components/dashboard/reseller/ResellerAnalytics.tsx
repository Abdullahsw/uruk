import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for charts
const salesData = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 5800 },
  { month: "Mar", sales: 7400 },
  { month: "Apr", sales: 6800 },
  { month: "May", sales: 9200 },
  { month: "Jun", sales: 10500 },
  { month: "Jul", sales: 11200 },
  { month: "Aug", sales: 9800 },
  { month: "Sep", sales: 12400 },
  { month: "Oct", sales: 14200 },
  { month: "Nov", sales: 15800 },
  { month: "Dec", sales: 18400 },
];

const categoryData = [
  { category: "Electronics", sales: 42000 },
  { category: "Fashion", sales: 28000 },
  { category: "Home & Kitchen", sales: 19500 },
  { category: "Beauty", sales: 15000 },
  { category: "Sports", sales: 12500 },
];

const ResellerAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
            <SelectItem value="alltime">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,856.78</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +18.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$72.68</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              +5.3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.42%</div>
            <p className="text-xs text-amber-500 flex items-center mt-1">
              -0.8% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
                <CardDescription>
                  Monthly revenue for the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {/* In a real app, you would use a chart library like recharts or chart.js */}
                  <div className="h-full w-full flex items-end justify-between gap-2">
                    {salesData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-primary rounded-t w-8"
                          style={{ height: `${(item.sales / 20000) * 100}%` }}
                        />
                        <span className="text-xs mt-2">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {/* Simplified pie chart representation */}
                  <div className="h-full w-full flex flex-col justify-center space-y-4">
                    {categoryData.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {item.category}
                          </span>
                          <span className="text-sm">
                            ${item.sales.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${(item.sales / 42000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Your best performing products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Premium Wireless Headphones",
                    sales: 156,
                    revenue: 20280,
                  },
                  { name: "Smart Watch Series 5", sales: 98, revenue: 17640 },
                  {
                    name: "Portable Bluetooth Speaker",
                    sales: 142,
                    revenue: 11360,
                  },
                  {
                    name: "Noise Cancelling Earbuds",
                    sales: 112,
                    revenue: 10080,
                  },
                  {
                    name: "Smartphone Stabilizer Gimbal",
                    sales: 86,
                    revenue: 8600,
                  },
                ].map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-500">
                        {product.sales} sold
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>${product.revenue.toLocaleString()}</span>
                      <span>
                        {((product.revenue / 67960) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${(product.revenue / 20280) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {/* Simplified line chart */}
                  <div className="h-full w-full flex items-end justify-between gap-2">
                    {[
                      { month: "Jan", customers: 24 },
                      { month: "Feb", customers: 32 },
                      { month: "Mar", customers: 42 },
                      { month: "Apr", customers: 38 },
                      { month: "May", customers: 56 },
                      { month: "Jun", customers: 64 },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-blue-500 rounded-t w-8"
                          style={{ height: `${(item.customers / 70) * 100}%` }}
                        />
                        <span className="text-xs mt-2">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Returning customer rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full flex flex-col justify-center items-center">
                  {/* Simplified donut chart */}
                  <div className="relative h-40 w-40 rounded-full border-8 border-primary">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">68%</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      68% of your customers made repeat purchases
                    </p>
                    <p className="text-sm font-medium mt-2">
                      +12% from previous period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: "Direct", visitors: 4256, percentage: 42 },
                    {
                      source: "Organic Search",
                      visitors: 2845,
                      percentage: 28,
                    },
                    { source: "Social Media", visitors: 1523, percentage: 15 },
                    { source: "Referral", visitors: 982, percentage: 10 },
                    { source: "Email", visitors: 512, percentage: 5 },
                  ].map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-sm">
                          {source.visitors.toLocaleString()} visitors
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {source.percentage}% of total traffic
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  What devices your customers are using
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-6 w-full">
                    {[
                      {
                        device: "Mobile",
                        percentage: 68,
                        color: "bg-blue-500",
                      },
                      {
                        device: "Desktop",
                        percentage: 24,
                        color: "bg-green-500",
                      },
                      {
                        device: "Tablet",
                        percentage: 8,
                        color: "bg-amber-500",
                      },
                    ].map((device, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-4">
                          <div className="absolute inset-0 rounded-full border-8 border-gray-100" />
                          <div
                            className={`absolute inset-0 rounded-full border-8 ${device.color}`}
                            style={{
                              clipPath: `polygon(0 0, 100% 0, 100% ${device.percentage}%, 0 ${device.percentage}%)`,
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {device.percentage}%
                            </span>
                          </div>
                        </div>
                        <span className="font-medium">{device.device}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerAnalytics;
