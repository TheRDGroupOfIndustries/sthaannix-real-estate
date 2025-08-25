import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Revenue = () => {
//   const [revenueData, setRevenueData] = useState(null);

//   useEffect(() => {
//     const fetchRevenue = async () => {
//       try {
//         const res = await axios.get("/api/revenue");
//         setRevenueData(res.data);
//       } catch (err) {
//         console.error("Error fetching revenue:", err);
//       }
//     };
//     fetchRevenue();
//   }, []);

//   if (!revenueData) return <p className="text-center">Loading revenue...</p>;

  return (
    // <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    //   {/* Total Revenue Card */}
    //   <Card className="rounded-2xl shadow-md p-4">
    //     <CardContent>
    //       <h2 className="text-xl font-semibold">Total Revenue</h2>
    //       <p className="text-3xl font-bold mt-2">₹{revenueData.totalRevenue.toLocaleString()}</p>
    //     </CardContent>
    //   </Card>

    //   {/* Monthly Revenue Chart */}
    //   <Card className="rounded-2xl shadow-md p-4">
    //     <CardContent>
    //       <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
    //       <ResponsiveContainer width="100%" height={250}>
    //         <BarChart data={revenueData.monthlyRevenue}>
    //           <XAxis dataKey="month" />
    //           <YAxis />
    //           <Tooltip />
    //           <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </CardContent>
    //   </Card>
    // </div>
    <div>
        revenue
    </div>
  );
};

export default Revenue;
