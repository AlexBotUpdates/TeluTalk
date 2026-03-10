import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, Mic, Brain, Flame } from "lucide-react";

const features = [
  { icon: Volume2, title: "Listen", desc: "Hear authentic Telugu pronunciation" },
  { icon: Mic, title: "Speak", desc: "Practice speaking with voice recognition" },
  { icon: Brain, title: "Learn", desc: "Match meanings and build vocabulary" },
  { icon: Flame, title: "Streak", desc: "Stay motivated with daily streaks & XP" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mx-auto shadow-lg">
            <span className="text-5xl">తె</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-foreground mb-4"
        >
          Learn Telugu
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-md mb-10"
        >
          Speak and understand Telugu through fun, bite-sized lessons. No reading or writing required!
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="btn-duo-primary text-lg px-10 py-4"
        >
          Start Learning — It's Free
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl w-full"
        >
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 border border-border text-center">
              <f.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
