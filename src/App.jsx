import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle, Loader2, BookOpen, Home, Video, Award, Bell, LogOut, Menu, X, Play, Clock, Users, Star, TrendingUp, Search, Plus, ChevronRight } from 'lucide-react';

// ============================================================================
// API CONFIGURATION & SERVICES
// ============================================================================

const API_BASE_URL = 'http://localhost:9191/valido/auth';

const api = {
    login: async ({ email, password }) => {
        console.log('🔵 Attempting login for:', email);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log('🔵 Response status:', response.status);
        const data = await response.json();
        console.log('🔵 Full response data:', data);
        if (!response.ok) throw new Error(data.message || `Login failed with status ${response.status}`);
        return data;
    },

    signup: async ({ firstName, lastName, email, password, phoneNumber }) => {
        console.log('🔵 Attempting signup for:', email);
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, phoneNumber })
        });
        const data = await response.json();
        console.log('🔵 Signup response:', data);
        if (!response.ok) throw new Error(data.message || 'Signup failed');
        return data;
    },

    verifyOtp: async ({ email, otp }) => {
        console.log('🔵 Verifying OTP for:', email);
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        console.log('🔵 OTP verification response:', data);
        if (!response.ok) throw new Error(data.message || 'OTP verification failed');
        return data;
    }
};

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const Alert = ({ variant = 'error', children }) => {
    const styles = {
        error: { container: 'bg-red-50 border-red-200 text-red-800', icon: <AlertCircle className="w-5 h-5 text-red-600" /> },
        success: { container: 'bg-green-50 border-green-200 text-green-800', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
        info: { container: 'bg-blue-50 border-blue-200 text-blue-800', icon: <AlertCircle className="w-5 h-5 text-blue-600" /> }
    };
    return (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${styles[variant].container}`}>
            {styles[variant].icon}
            <div className="flex-1">{children}</div>
        </div>
    );
};

const InputField = ({ icon: Icon, label, error, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const Button = ({ children, loading, onClick, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    return (
        <button
            className={`w-full py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]}`}
            disabled={loading}
            onClick={onClick}
            {...props}
        >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {children}
        </button>
    );
};

// ============================================================================
// MOCK COURSE DATA
// ============================================================================

const COURSES = [
    {
        id: 1, title: "Full Stack Web Development", description: "Master React, Node.js, MongoDB and build real-world projects",
        instructor: "Sarah Johnson", duration: "12 weeks", students: 2543, rating: 4.8,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
        progress: 65, lessons: 156, category: "Development", enrolled: true
    },
    {
        id: 2, title: "Data Science & AI", description: "Learn Python, Machine Learning, Deep Learning from scratch",
        instructor: "Michael Chen", duration: "16 weeks", students: 1832, rating: 4.9,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        progress: 30, lessons: 203, category: "Data Science", enrolled: true
    },
    {
        id: 3, title: "UI/UX Design Masterclass", description: "Create stunning interfaces with Figma and modern design principles",
        instructor: "Emma Williams", duration: "8 weeks", students: 3421, rating: 4.7,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        progress: 85, lessons: 94, category: "Design", enrolled: true
    },
    {
        id: 4, title: "Mobile App Development", description: "Build iOS and Android apps with React Native",
        instructor: "David Lee", duration: "10 weeks", students: 1654, rating: 4.6,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        progress: 0, lessons: 128, category: "Mobile", enrolled: false
    },
    {
        id: 5, title: "Digital Marketing Pro", description: "SEO, Social Media, Content Strategy and Analytics",
        instructor: "Lisa Anderson", duration: "6 weeks", students: 2876, rating: 4.5,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        progress: 0, lessons: 72, category: "Marketing", enrolled: false
    },
    {
        id: 6, title: "Cloud Computing AWS", description: "Master AWS services, DevOps and Cloud Architecture",
        instructor: "James Wilson", duration: "14 weeks", students: 1987, rating: 4.8,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
        progress: 0, lessons: 167, category: "Cloud", enrolled: false
    }
];

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

const LoginPage = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleLogin = async () => {
        console.log('🟢 Login button clicked');
        if (!email || !password) {
            setAlert({ type: 'error', message: 'Please fill in all fields' });
            return;
        }
        setLoading(true);
        setAlert(null);

        try {
            const result = await api.login({ email, password });
            console.log('🟢 Login result received:', result);

            if (result.token) {
                console.log('✅ Token found! Length:', result.token.length);
                const userData = {
                    userId: result.userId,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName
                };
                console.log('✅ Storing user data:', userData);
                setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
                setTimeout(() => {
                    console.log('✅ Navigating to dashboard');
                    onNavigate('dashboard', userData);
                }, 1000);
            } else {
                console.error('❌ No token field in response');
                setAlert({ type: 'error', message: 'Login failed - no token received from server' });
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setAlert({ type: 'error', message: err.message || 'Login failed. Please check your credentials.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                {alert && <div className="mb-6"><Alert variant={alert.type}>{alert.message}</Alert></div>}

                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>Debug:</strong> Open browser console (F12) for detailed logs
                </div>

                <div onKeyPress={(e) => e.key === 'Enter' && handleLogin()}>
                    <InputField icon={Mail} label="Email" type="email" placeholder="Enter your email"
                                value={email} onChange={(e) => setEmail(e.target.value.trim())} autoComplete="email" />
                    <InputField icon={Lock} label="Password" type="password" placeholder="Enter your password"
                                value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                    <Button onClick={handleLogin} loading={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </div>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <span onClick={() => onNavigate('signup')} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

const SignupPage = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phoneNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
            setAlert({ type: 'error', message: 'Please fill in all required fields' });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setAlert({ type: 'error', message: 'Passwords do not match' });
            return false;
        }
        if (formData.password.length < 6) {
            setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setAlert({ type: 'error', message: 'Please enter a valid email' });
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        setAlert(null);
        if (!validateForm()) return;
        setLoading(true);

        try {
            const result = await api.signup({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phoneNumber: formData.phoneNumber.trim() || null
            });
            console.log('✅ Signup successful:', result);
            setAlert({ type: 'success', message: 'Account created! Check your email for OTP.' });
            setTimeout(() => onNavigate('verify-otp', formData.email.trim()), 1500);
        } catch (err) {
            console.error('❌ Signup error:', err);
            setAlert({ type: 'error', message: err.message || 'Signup failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-600 mt-2">Sign up to get started</p>
                </div>

                {alert && <div className="mb-6"><Alert variant={alert.type}>{alert.message}</Alert></div>}

                <div onKeyPress={(e) => e.key === 'Enter' && handleSignup()}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField icon={User} label="First Name" type="text" placeholder="First name"
                                    value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                        <InputField icon={User} label="Last Name" type="text" placeholder="Last name"
                                    value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                    </div>
                    <InputField icon={Mail} label="Email" type="email" placeholder="Enter your email"
                                value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <InputField icon={Phone} label="Phone Number (Optional)" type="tel" placeholder="Enter phone number"
                                value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />
                    <InputField icon={Lock} label="Password" type="password" placeholder="Create a password"
                                value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
                    <InputField icon={Lock} label="Confirm Password" type="password" placeholder="Confirm your password"
                                value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
                    <Button onClick={handleSignup} loading={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </div>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <span onClick={() => onNavigate('login')} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
};

const VerifyOtpPage = ({ email, onNavigate }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) {
            setAlert({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
            return;
        }
        setLoading(true);
        setAlert(null);

        try {
            const result = await api.verifyOtp({ email, otp });
            console.log('✅ OTP verified:', result);
            setAlert({ type: 'success', message: 'Email verified successfully!' });
            setTimeout(() => onNavigate('login'), 1500);
        } catch (err) {
            console.error('❌ OTP verification error:', err);
            setAlert({ type: 'error', message: err.message || 'Invalid OTP. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Verify Email</h2>
                    <p className="text-gray-600 mt-2">We sent a code to</p>
                    <p className="text-green-600 font-semibold break-all">{email}</p>
                </div>

                {alert && <div className="mb-6"><Alert variant={alert.type}>{alert.message}</Alert></div>}

                <div onKeyPress={(e) => e.key === 'Enter' && handleVerify()}>
                    <InputField label="Enter OTP" type="text" placeholder="Enter 6-digit code"
                                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
                    <Button onClick={handleVerify} loading={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Button>
                </div>

                <p className="text-center mt-6 text-gray-600">
                    <span onClick={() => onNavigate('login')} className="text-gray-700 cursor-pointer hover:underline">
                        ← Back to Login
                    </span>
                </p>
            </div>
        </div>
    );
};

const DashboardPage = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [courses, setCourses] = useState(COURSES);
    const [searchQuery, setSearchQuery] = useState('');

    const enrolledCourses = courses.filter(c => c.enrolled);
    const availableCourses = courses.filter(c => !c.enrolled);
    const avgProgress = enrolledCourses.length > 0
        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
        : 0;

    const handleEnroll = (courseId) => {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: true, progress: 0 } : c));
    };

    const filteredCourses = availableCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const CourseCard = ({ course, showEnroll = false }) => (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                        {course.category}
                    </span>
                </div>
                {course.enrolled && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white text-sm mb-2">
                            <span className="font-semibold">{course.progress}% Complete</span>
                            <span className="text-xs">{Math.round(course.lessons * course.progress / 100)}/{course.lessons} lessons</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                                 style={{ width: `${course.progress}%` }} />
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{course.lessons}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{course.rating}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {course.instructor.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{course.instructor}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {course.students} students
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {showEnroll ? (
                        <button onClick={() => handleEnroll(course.id)}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" />
                            Enroll Now
                        </button>
                    ) : (
                        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                            <Play className="w-5 h-5" />
                            Continue Learning
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const HomeView = () => (
        <div className="space-y-8">
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Welcome back, {user.firstName}! 👋
                    </h1>
                    <p className="text-xl text-white/90 mb-6">
                        Continue your learning journey and achieve your goals
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        Explore Courses
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                    <BookOpen className="w-64 h-64" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-semibold">Enrolled Courses</h3>
                        <BookOpen className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-5xl font-bold text-gray-900 mb-2">{enrolledCourses.length}</p>
                    <p className="text-sm text-gray-500">Active enrollments</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-semibold">Avg Progress</h3>
                        <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                    <p className="text-5xl font-bold text-gray-900 mb-2">{avgProgress}%</p>
                    <p className="text-sm text-gray-500">Keep it up!</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 font-semibold">Certificates</h3>
                        <Award className="w-10 h-10 text-purple-600" />
                    </div>
                    <p className="text-5xl font-bold text-gray-900 mb-2">2</p>
                    <p className="text-sm text-gray-500">Earned so far</p>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Continue Learning</h2>
                    <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                        View All
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.slice(0, 3).map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );

    const MyCoursesView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900">My Courses</h1>
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold">
                    {enrolledCourses.length} enrolled
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );

    const BrowseView = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Browse All Courses</h1>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input type="text" placeholder="Search for courses, topics, or instructors..."
                           value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} showEnroll={true} />
                ))}
            </div>
        </div>
    );

    const ProgressView = () => (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">Your Progress</h1>
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-8">Course Progress Overview</h2>
                <div className="space-y-8">
                    {enrolledCourses.map(course => (
                        <div key={course.id} className="border-b pb-8 last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-6 mb-4">
                                <img src={course.thumbnail} alt={course.title} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{course.title}</h3>
                                    <p className="text-gray-600">{course.instructor}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-bold text-blue-600">{course.progress}%</span>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500"
                                     style={{ width: `${course.progress}%` }} />
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                                <span>{Math.round(course.lessons * course.progress / 100)} of {course.lessons} lessons completed</span>
                                <span>{course.duration} total</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const NotificationsView = () => {
        const notifications = [
            { id: 1, type: 'success', title: 'Course Completed! 🎉', message: 'You completed "UI/UX Design Masterclass"', time: '2 hours ago' },
            { id: 2, type: 'info', title: 'New Lesson Available', message: 'Check out the new lesson in Full Stack Development', time: '5 hours ago' },
            { id: 3, type: 'success', title: 'Certificate Earned 🏆', message: 'Your certificate for Data Science is ready to download', time: '1 day ago' },
            { id: 4, type: 'info', title: 'Assignment Due Soon', message: 'Mobile App Development assignment due in 2 days', time: '2 days ago' }
        ];

        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div key={notif.id} className="bg-white rounded-2xl shadow-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                notif.type === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                            }`}>
                                <Bell className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{notif.title}</h3>
                                <p className="text-gray-600 mb-2">{notif.message}</p>
                                <p className="text-sm text-gray-400">{notif.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <HomeView />;
            case 'courses': return <MyCoursesView />;
            case 'browse': return <BrowseView />;
            case 'progress': return <ProgressView />;
            case 'notifications': return <NotificationsView />;
            default: return <HomeView />;
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen flex flex-col transition-transform duration-300 shadow-2xl`}>
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <BookOpen className="w-7 h-7 transform -rotate-3" />
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    EDUCONNECT
                                </h2>
                                <p className="text-xs text-gray-400">Learn Without Limits</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-blue-100">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                    {[
                        { id: 'home', label: 'Dashboard', icon: Home },
                        { id: 'courses', label: 'My Courses', icon: BookOpen },
                        { id: 'browse', label: 'Browse', icon: Search },
                        { id: 'progress', label: 'Progress', icon: TrendingUp },
                        { id: 'notifications', label: 'Notifications', icon: Bell }
                    ].map(item => (
                        <button key={item.id}
                                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                                    activeTab === item.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50 scale-105'
                                        : 'hover:bg-gray-700/50'
                                }`}>
                            <item.icon className="w-6 h-6" />
                            <span className="font-semibold text-lg">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button onClick={() => onNavigate('login')}
                            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-red-600/90 transition-all duration-300 group">
                        <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-lg">Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="md:hidden bg-white border-b px-4 py-4 flex items-center justify-between shadow-lg">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <Menu className="w-7 h-7" />
                    </button>
                    <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        EDUCONNECT
                    </h1>
                    <div className="w-7" />
                </div>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    {renderContent()}
                </main>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
};

const App = () => {
    const [currentRoute, setCurrentRoute] = useState('login');
    const [routeData, setRouteData] = useState(null);

    const navigate = (route, data = null) => {
        console.log('🟡 Navigating to:', route, 'with data:', data);
        setCurrentRoute(route);
        setRouteData(data);
    };

    const renderRoute = () => {
        switch (currentRoute) {
            case 'login': return <LoginPage onNavigate={navigate} />;
            case 'signup': return <SignupPage onNavigate={navigate} />;
            case 'verify-otp': return <VerifyOtpPage email={routeData} onNavigate={navigate} />;
            case 'dashboard': return <DashboardPage user={routeData} onNavigate={navigate} />;
            default: return <LoginPage onNavigate={navigate} />;
        }
    };

    return <>{renderRoute()}</>;
};

export default App