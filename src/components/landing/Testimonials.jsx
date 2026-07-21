import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Wanjiku M.",
      location: "Nairobi",
      rating: 5,
      text: "Smart Laundry has been a game changer for me. Super convenient, on time and my clothes always come back fresh and clean!",
      avatar: "👩🏿",
    },
    {
      id: 2,
      name: "Brian K.",
      location: "Karaitina",
      rating: 5,
      text: "Excellent service! The pickup and delivery is so easy and the team is very professional.",
      avatar: "👨🏿",
    },
    {
      id: 3,
      name: "Amina H.",
      location: "Nyeri",
      rating: 5,
      text: "I love how they take care of my delicate fabrics. Highly recommend Smart Laundry!",
      avatar: "👩🏽",
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">What Our Customers Say</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Real reviews from real people.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.location}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 text-lg mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;