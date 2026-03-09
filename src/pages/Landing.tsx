import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  GraduationCap,
  HeartPulse,
  TrendingUp,
  Landmark,
  Zap,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NeuralBackground from "@/components/NeuralBackground";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Advanced ML models for classification, regression, clustering & forecasting." },
  { icon: BarChart3, title: "Real-time Insights", desc: "Interactive dashboards with live KPI tracking and visual analytics." },
  { icon: Zap, title: "Instant Decisions", desc: "Generate intelligent recommendations with confidence scoring in seconds." },
  { icon: Shield, title: "Enterprise Security", desc: "Role-based access, audit logs, and encrypted data storage." },
];

const domains = [
  { icon: GraduationCap, name: "Education", desc: "Student performance prediction & dropout risk scoring.", color: "from-primary to-cyan-400" },
  { icon: HeartPulse, name: "Healthcare", desc: "Diagnosis assistance & treatment recommendation scoring.", color: "from-emerald-400 to-success" },
  { icon: TrendingUp, name: "Business", desc: "Sales forecasting, churn prediction & analytics.", color: "from-secondary to-purple-400" },
  { icon: Landmark, name: "Finance", desc: "Risk assessment & fraud detection scoring.", color: "from-warning to-amber-400" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col">
        <NeuralBackground />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="font-heading text-xl font-bold text-foreground">NeuralDecide</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">Sign Up</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Decision Intelligence</span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Decisions Powered by{" "}
              <span className="text-gradient">Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform raw data into actionable insights with advanced machine learning.
              Make confident decisions across Education, Healthcare, Business & Finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow px-8 text-base">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 px-8 text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 pb-10 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Why <span className="text-gradient">NeuralDecide</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enterprise-grade AI analysis with an interface anyone can use.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={item} className="glass-card-hover p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Domain Cards */}
      <section className="py-24 px-6 md:px-12 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Built for Every Domain
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Specialized AI models and insights tailored to your industry.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {domains.map((d) => (
              <motion.div key={d.name} variants={item} className="glass-card-hover p-8 group cursor-pointer">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <d.icon className="h-7 w-7 text-background" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-2 text-foreground">{d.name}</h3>
                <p className="text-muted-foreground">{d.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass-card p-12 md:p-16 gradient-border"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Make Smarter Decisions?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of analysts using AI-powered intelligence to drive results.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow px-10 text-base">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-foreground">NeuralDecide</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 NeuralDecide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
