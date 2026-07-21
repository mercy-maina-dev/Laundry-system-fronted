import { ShieldCheck, Clock, Leaf } from "lucide-react";

const Stats = () => {
  const badges = [
    { icon: ShieldCheck, label: "Trusted & Reliable", desc: "Your clothes are in safe hands." },
    { icon: Clock, label: "On-Time Delivery", desc: "We value your time." },
    { icon: Leaf, label: "Eco Friendly", desc: "Gentle on clothes, kind to planet." },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {badges.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <item.icon className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-white">{item.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;