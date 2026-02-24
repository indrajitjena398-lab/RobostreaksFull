const AboutPage = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About</h1>
          <p className="text-sm md:text-base tracking-[0.3em] text-white/70 uppercase">
            LEARN | INNOVATE | EXCEL
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-white/90 text-base md:text-lg leading-relaxed text-center">
            Robostreaks is a group of enthusiastic engineers, makers, and innovators driven by a shared passion for
            robotics. Founded to cultivate technical excellence and collaborative problem-solving, we bring together
            students who love building intelligent systems, competing in high-impact events, and pushing the boundaries
            of practical innovation. From hands-on workshops to national-level competitions, our journey is defined by
            continuous learning, creativity, and a commitment to engineering with purpose.
          </p>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Glimpses</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900">
              <img
                src="/assets/event/ideation.webp"
                alt="Robotics chassis and electronics"
                className="w-full h-full object-cover image-pop"
                loading="lazy"
              />
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#FEFCE8] flex items-center justify-center p-6">
              <img
                src="/assets/logo/Robostreaks Logo li.png"
                alt="Robostreaks official logo"
                className="max-h-full max-w-full object-contain image-pop"
                loading="lazy"
              />
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900">
              <img
                src="https://rakandesign.weebly.com/uploads/4/0/2/2/40226169/492827_orig.jpg"
                alt="Robot prototype with battery and circuit boards"
                className="w-full h-full object-cover image-pop"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
