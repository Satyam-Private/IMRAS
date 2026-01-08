import { useNavigate } from 'react-router-dom';
import {
    Package,
    BarChart3,
    Users,
    Warehouse,
    ArrowRight,
    CheckCircle2,
    Shield,
    Zap,
    TrendingUp
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Package,
            title: 'Smart Inventory Tracking',
            description: 'Real-time visibility across all warehouses with automated stock level monitoring.'
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Powerful insights and reporting to optimize your supply chain decisions.'
        },
        {
            icon: Users,
            title: 'Role-Based Access',
            description: 'Secure multi-user system with customizable permissions for your team.'
        },
        {
            icon: Warehouse,
            title: 'Multi-Warehouse Support',
            description: 'Manage multiple locations from a single unified dashboard.'
        }
    ];

    const benefits = [
        'Reduce stockouts by up to 35%',
        'Save 20+ hours per week on manual tracking',
        'Real-time inventory accuracy',
        'Seamless team collaboration'
    ];

    return (
        <div className="marketing">
            <div className="min-h-screen bg-gradient-hero">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-display font-bold text-foreground">IMRAS</span>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity duration-200"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium text-sm mb-6">
                                <Zap className="w-4 h-4" />
                                Streamline Your Inventory Operations
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
                                Inventory Management &<br />
                                <span className="text-primary">Resource Allocation System</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                                Take control of your warehouse operations with real-time tracking,
                                intelligent analytics, and seamless team collaboration.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-accent-foreground bg-gradient-accent rounded-xl shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="w-5 h-5 text-accent" />
                                    <span className="text-sm">Enterprise-grade security</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            {[
                                { value: '0%', label: 'Uptime SLA' },
                                { value: '0+', label: 'Warehouses' },
                                { value: '0+', label: 'Item tracked' },
                                { value: '24/7', label: 'Assistance' }

                            ].map((stat, index) => (
                                <div key={index} className="text-center p-6 bg-card rounded-xl shadow-card border border-border">
                                    <div className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
                                Everything You Need to Manage Inventory
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Powerful features designed to streamline your warehouse operations and boost efficiency.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-6 bg-background rounded-xl border border-border hover:border-accent/50 hover:shadow-elevated transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gradient-accent group-hover:scale-110 transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                                    </div>
                                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                                    <TrendingUp className="w-4 h-4" />
                                    Why Choose IMRAS
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                                    Transform Your Inventory Operations
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Join hundreds of businesses that have revolutionized their warehouse management with our comprehensive solution.
                                </p>
                                <ul className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-accent" />
                                            </div>
                                            <span className="text-foreground font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-accent opacity-10 rounded-2xl blur-3xl" />
                                <div className="relative bg-card rounded-2xl border border-border shadow-elevated p-8">
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Inventory Accuracy', value: 99, color: 'bg-accent' },
                                            { label: 'Order Fulfillment', value: 95, color: 'bg-primary' },
                                            { label: 'Stock Optimization', value: 88, color: 'bg-accent' }
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-foreground font-medium">{item.label}</span>
                                                    <span className="text-muted-foreground">{item.value}%</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                                        style={{ width: `${item.value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-4xl">
                        <div className="relative overflow-hidden bg-gradient-primary rounded-2xl p-8 sm:p-12 text-center">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDE0di0yaDIyem0wLTR2Mkg0di0yaDMyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                            <div className="relative">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-4">
                                    Ready to Optimize Your Inventory?
                                </h2>
                                <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                                    Start managing your warehouse operations more efficiently today.
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-accent-foreground bg-gradient-accent rounded-xl shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Access Your Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            {/* Brand */}
                            <div className="md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <span className="text-xl font-display font-bold text-foreground">IMRAS</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Streamline your inventory operations with our comprehensive management solution.
                                </p>
                            </div>

                            {/* Product */}
                            <div>
                                <h4 className="font-display font-semibold text-foreground mb-4">Product</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Updates</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
                                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Status</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} IMRAS. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;