import service1 from "../../assets/images/service1.png";
import service2 from "../../assets/images/service2.png";
import service3 from "../../assets/images/service3.png";
import service4 from "../../assets/images/service4.png";
import service5 from "../../assets/images/service5.png";
import service6 from "../../assets/images/service6.png";

const Services = () => {
  const services = [
    { id: 1, img: service1, alt: "Wash & Fold Service" },
    { id: 2, img: service2, alt: "Dry Cleaning Service" },
    { id: 3, img: service3, alt: "Dry Clean & Press Service" },
    { id: 4, img: service4, alt: "Shoe Clean & Press Service" },
    { id: 5, img: service5, alt: "Pickup & Delivery Service" },
    { id: 6, img: service6, alt: "Linen & Home Care Service" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="services" className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Our Services</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Laundry & More, We Do It All</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <img src={service.img} alt={service.alt} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <button onClick={() => scrollTo("contact")} className="px-5 py-2 bg-white text-gray-900 rounded-full font-medium text-sm hover:bg-gray-100 transition">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button onClick={() => scrollTo("contact")} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-md hover:shadow-lg">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;