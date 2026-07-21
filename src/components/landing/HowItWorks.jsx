import { Smartphone, Truck, Sparkles, Home } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { icon: Smartphone, title: "Book Online", desc: "Schedule a pickup in safe hands." },
    { icon: Truck, title: "We Pickup", desc: "We pick up your laundry." },
    { icon: Sparkles, title: "We Clean", desc: "We wash, dry and care for your clothes." },
    { icon: Home, title: "We Deliver", desc: "Fresh, clean laundry delivered to you." },
  ];

  return (
    <section id="howitworks" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">How It Works</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Four simple steps to fresh, clean laundry.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition group">
              <div className="flex flex-col items-center text-center">
                <step.icon className="w-14 h-14 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;