"use client"
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Settings, 
  Users, 
  Megaphone,
  Clock,
  Calendar,
  ArrowRight,
  Bell,
  PieChart,
  TrendingUp,
  Eye,
  Target,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample data
  const campaignPerformanceData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 7000 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 8000 },
  ];
  
  const audienceData = [
    { name: 'Social Media', value: 40 },
    { name: 'Email', value: 25 },
    { name: 'Website', value: 20 },
    { name: 'Press', value: 15 },
  ];
  
  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444'];
  
  const notifications = [
    { id: 1, title: 'Campaign Completed', description: 'Q1 Marketing Campaign ended with 132% ROI', time: '10m ago', isNew: true },
    { id: 2, title: 'New Comment', description: 'Sarah left a comment on your latest press release', time: '1h ago', isNew: true },
    { id: 3, title: 'Meeting Reminder', description: 'Strategy meeting starts in 30 minutes', time: '2h ago', isNew: false },
  ];
  
  const campaigns = [
    { id: 1, name: 'Summer Promotion', status: 'Active', progress: 65, deadline: 'Jun 30', metrics: { reach: '45.3k', engagement: '8.7k', conversion: '3.2k' } },
    { id: 2, name: 'Product Launch', status: 'Planning', progress: 25, deadline: 'Jul 15', metrics: { reach: '12.1k', engagement: '2.3k', conversion: '850' } },
    { id: 3, name: 'Brand Awareness', status: 'Active', progress: 80, deadline: 'Jun 15', metrics: { reach: '78.2k', engagement: '15.4k', conversion: '5.1k' } },
    { id: 4, name: 'Customer Feedback', status: 'Completed', progress: 100, deadline: 'May 20', metrics: { reach: '32.6k', engagement: '7.9k', conversion: '2.8k' } },
  ];
  
  const renderColorfulLegend = (props: { payload: { color: string; value: string }[] }) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-300">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full"></span>
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-2 rounded-full">
                        {notifications.filter(n => n.isNew).length} new
                      </span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-3 border-b border-gray-200 dark:border-gray-700 ${notification.isNew ? 'bg-green-50 dark:bg-green-900/10' : ''}`}>
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center">
                      <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                  LR
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Lera</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="flex mt-6 border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'campaigns' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Campaigns
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'content' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'analytics' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Analytics
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Campaigns" 
            value="12" 
            change="+3"
            icon={<Megaphone size={24} className="text-green-600 dark:text-green-400" />}
            positive
          />
          <StatCard 
            title="Total Reach" 
            value="253.4k" 
            change="+15.2%"
            icon={<Eye size={24} className="text-green-600 dark:text-green-400" />}
            positive
          />
          <StatCard 
            title="Engagement Rate" 
            value="8.7%" 
            change="+2.1%"
            icon={<Target size={24} className="text-green-600 dark:text-green-400" />}
            positive
          />
          <StatCard 
            title="Pending Tasks" 
            value="8" 
            change="-3"
            icon={<CheckCircle size={24} className="text-green-600 dark:text-green-400" />}
            positive
          />
        </div>
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Performance Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Performance</h2>
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-700 dark:text-gray-300 px-2 py-1">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            <div className="p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10B981' }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Audience Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Audience Distribution</h2>
            </div>
            <div className="p-4 h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {audienceData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Campaign List */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Active Campaigns</h2>
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">New Campaign</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deadline</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metrics</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        campaign.status === 'Planning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{campaign.progress}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {campaign.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Reach</span>
                          <div className="font-medium text-gray-900 dark:text-white">{campaign.metrics.reach}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Engagement</span>
                          <div className="font-medium text-gray-900 dark:text-white">{campaign.metrics.engagement}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Conversion</span>
                          <div className="font-medium text-gray-900 dark:text-white">{campaign.metrics.conversion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Actions & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <QuickAction 
                icon={<Megaphone size={20} />} 
                title="New Campaign" 
                description="Create a new marketing campaign" 
              />
              <QuickAction 
                icon={<FileText size={20} />} 
                title="Content" 
                description="Manage your content library" 
              />
              <QuickAction 
                icon={<MessageSquare size={20} />} 
                title="Messages" 
                description="View and respond to inquiries" 
              />
              <QuickAction 
                icon={<Users size={20} />} 
                title="Team" 
                description="Manage team members" 
              />
            </div>
          </div>
          
          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Tasks</h2>
              <button className="text-sm text-green-600 dark:text-green-400 hover:underline">View all</button>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <TaskItem 
                  title="Review Q2 Campaign Strategy" 
                  date="Today, 2:00 PM" 
                  priority="high" 
                />
                <TaskItem 
                  title="Prepare Social Media Calendar" 
                  date="Tomorrow, 10:00 AM" 
                  priority="medium" 
                />
                <TaskItem 
                  title="Update Press Release Draft" 
                  date="Jun 8, 11:30 AM" 
                  priority="low" 
                />
                <TaskItem 
                  title="Team Meeting" 
                  date="Jun 10, 9:00 AM" 
                  priority="medium" 
                />
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, change, icon, positive = true }: { title: string; value: string; change: string; icon: React.ReactNode; positive?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium flex items-center`}>
          {positive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">since last month</span>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <button className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition duration-200">
      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-green-600 dark:text-green-400">
        {icon}
      </div>
      <div className="ml-3 text-left">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </button>
  );
}

function TaskItem({ title, date, priority }: { title: string; date: string; priority: 'high' | 'medium' | 'low' }) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  
  return (
    <li className="py-3">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="h-4 w-4 border-2 border-gray-300 dark:border-gray-600 rounded-sm mr-3"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
      <div className="ml-7 mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <Clock size={12} className="mr-1" />
        {date}
      </div>
    </li>
  );
}