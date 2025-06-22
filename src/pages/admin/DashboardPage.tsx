import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, XCircle, Gift } from 'lucide-react';

// --- Re-usable Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color, details }: { title: string, value: string, icon: React.ElementType, color: string, details: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <div className="ml-4">
            <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400">{details}</p>
        </div>
    </div>
);


// --- Feedback Distribution (Replaces Rating) ---
const FEEDBACK_LEVELS = [
    { name: 'Love it', value: 384, color: '#16a34a' },
    { name: 'Great', value: 145, color: '#0e7490' },
    { name: 'Okay', value: 24, color: '#eab308' },
    { name: 'Poor', value: 5, color: '#ea580c' },
    { name: 'Terrible', value: 1, color: '#dc2626' },
];

const FeedbackDistribution = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-gray-800 text-lg font-semibold mb-4">Feedback Breakdown</h4>
        <div className="space-y-3">
            {FEEDBACK_LEVELS.map((level) => (
                <div key={level.name} className="flex items-center">
                    <span className="text-sm text-gray-600 w-16">{level.name}</span>
                    <div className="w-full bg-gray-200 rounded-full h-4 mx-2">
                        <div
                            className="h-4 rounded-full"
                            style={{ width: `${(level.value / 400) * 100}%`, backgroundColor: level.color }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{level.value}</span>
                </div>
            ))}
        </div>
    </div>
);


// --- Recent Feedback (Replaces Recent Users) ---
const recentFeedbacks = [
    { id: 1, type: 'Good', comment: 'The food was amazing, especially the pasta!', user: 'isabella.c@example.com', status: 'Reviewed', time: '2 hours ago' },
    { id: 2, type: 'Bad', comment: 'Service was very slow, had to wait 30 mins for the bill.', user: 'mathilde.a@example.com', status: 'Pending', time: '5 hours ago' },
    { id: 3, type: 'Good', comment: 'Loved the ambiance and the coffee.', user: 'karla.s@example.com', status: 'Reviewed', time: '1 day ago' },
    { id: 4, type: 'Good', comment: 'Great value for money.', user: 'ida.j@example.com', status: 'Reviewed', time: '2 days ago' },
    { id: 5, type: 'Bad', comment: 'The music was too loud.', user: 'albert.a@example.com', status: 'Pending', time: '3 days ago' },
];

const RecentFeedback = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-gray-800 text-lg font-semibold">Recent Feedback</h4>
        <div className="mt-4 flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
                {recentFeedbacks.map((feedback) => (
                    <li key={feedback.id} className="py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                {feedback.type === 'Good' ? <ThumbsUp className="h-6 w-6 text-green-500" /> : <ThumbsDown className="h-6 w-6 text-red-500" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">{feedback.comment}</p>
                                <p className="truncate text-sm text-gray-500">{feedback.user}</p>
                            </div>
                            <div className='flex items-center text-sm'>
                                {feedback.status === 'Reviewed' ? <CheckCircle className='w-4 h-4 text-green-600 mr-1'/> : <XCircle className='w-4 h-4 text-yellow-600 mr-1'/>}
                                {feedback.status}
                            </div>
                            <div className="inline-flex items-center text-xs font-semibold text-gray-600">
                                {feedback.time}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


// --- Main Dashboard Page Component ---
const DashboardPage: React.FC = () => {
    return (
        <div>
            {/* Breadcrumbs */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Feedback System Overview</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                <StatCard title="Total Feedback" value="559" icon={MessageSquare} color="#3b82f6" details="+20.1% from last month" />
                <StatCard title="Positive Feedback" value="530" icon={ThumbsUp} color="#16a34a" details="94.8% of total" />
                <StatCard title="Offers Generated" value="247" icon={Gift} color="#8b5cf6" details="+12 since yesterday" />
                <StatCard title="Offers Redeemed" value="156" icon={CheckCircle} color="#16a34a" details="63.2% redemption rate" />
                
                {/* Recent Feedback List */}
                <div className="lg:col-span-4">
                    <RecentFeedback />
                </div>
                
                {/* Feedback Distribution */}
                <div className="lg:col-span-4">
                    <FeedbackDistribution />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 