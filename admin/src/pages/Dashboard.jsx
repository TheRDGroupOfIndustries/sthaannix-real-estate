import { motion } from "framer-motion";
import {
  Home,
  Activity,
  Users,
  Calendar,
  Eye,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Mock data - no backend calls
  const stats = {
    totalProperties: 24,
    activeListings: 18,
    totalViews: 1560,
    pendingAppointments: 5,
    recentActivity: [
      {
        description: "New property added by John Doe",
        timestamp: new Date().toISOString()
      },
      {
        description: "Appointment scheduled for 123 Main St",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    viewsData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Property Views',
          data: [120, 190, 300, 250, 200, 300],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        }
      ]
    },
    propertyTypeData: {
      labels: ['Residential', 'Commercial', 'Land'],
      datasets: [
        {
          data: [12, 5, 7],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b'
          ],
        }
      ]
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      }
    }
  };

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Home,
      color: "from-blue-500 to-blue-600",
      description: "Total properties listed"
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: Activity,
      color: "from-green-500 to-green-600",
      description: "Currently active listings"
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      description: "Property page views"
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
      description: "Awaiting confirmation"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-4 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your properties
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Property Views Analytics
            </h2>
            <div className="h-64">
              <Line data={stats.viewsData} options={chartOptions} />
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Property Types
            </h2>
            <div className="h-64">
              <Doughnut data={stats.propertyTypeData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;