// src/pages/HomePage.tsx

import Hero from "@/components/sections/Hero";
import AboutPage from "@/pages/AboutPage";
import EventsPreview from "@/components/sections/EventsPreview";
// import SponsorsSection from "@/components/sections/SponsorsSection";
import Footer from "@/components/layout/Footer";

interface MemberItem {
  name: string;
  role: string;
  image?: string;
}

const teamMembers: MemberItem[] = [
  { name: "Om Pratyush Nayak", role: "Co-ordinator", image: "https://media.licdn.com/dms/image/v2/D4E03AQFfneWL8RzMgg/profile-displayphoto-shrink_400_400/B4EZXYm2.cH0Ak-/0/1743095821859?e=1773273600&v=beta&t=ztj2-05BpBpnUM5OvxH_HOePP-m8qgpEULRWIvEF7rY" },
  { name: "Neha Sabat", role: "Co-Ordinator", image: "https://media.licdn.com/dms/image/v2/D5603AQHari0vn-tQHw/profile-displayphoto-scale_400_400/B56ZmZBrpGI0Ak-/0/1759208982192?e=1773273600&v=beta&t=UB0sB_lA3HJn8_ETtxvkFcjNSw1HUH95by8nInfCHbE" },
  { name: "Ankush Sahoo", role: "Event Manager, Coding Head", image: "https://media.licdn.com/dms/image/v2/D5603AQE8ptLzOYbcGg/profile-displayphoto-shrink_400_400/B56ZafyUHeHsAk-/0/1746437491531?e=1773273600&v=beta&t=Yp7pW9PZrgXbCpHZoBuCWx4oGwJ2Qa5B2xIa3MyUCZk" },
  { name: "Aditya Prasad Singh Samanta", role: "Core Member, Media Marketing", image: "https://media.licdn.com/dms/image/v2/D5603AQHN4ZSm6qQnLQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714373939735?e=1773273600&v=beta&t=5cxEKaTXoeP4rXh0eiDCxXPjVd1YtsxNgQuT0sa1h84" },
  { name: "Mihir Kumar Panda", role: "Core Member, Media Marketing" },
  { name: "Avinash Mahapatra", role: "Core Member, Mechanical Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQHHh9Zsh9xwMg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718248971186?e=1773273600&v=beta&t=gW6ZipZ1eO1bpdN2l82CaMeCAO4vdqB8EvZq6vg1tX0" },
  { name: "Ankit Mohapatra", role: "Core Member, Mechanical Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQFuhPsOJsG33A/profile-displayphoto-scale_400_400/B56ZjVzN5QHAAo-/0/1755933631561?e=1773273600&v=beta&t=Y4y1nZ_b5FqEnbCApJ-v4n_ZO9zTiwvd_eVZc0i5XKY" },
  { name: "Rajasmita Lenka", role: "Core Member, Coding Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQEeOvJA8zYpEA/profile-displayphoto-scale_100_100/B56Zwut67qGQAc-/0/1770310316918?e=1773273600&v=beta&t=vCQEB3m6eHb9zGM8gUxk0q5Nq3ZKDBI7tvpDyVj3Kv4" },
  { name: "Arpit Kumar Khamari", role: "Core Member, Coding Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQFj3HR5rOgOew/profile-displayphoto-shrink_400_400/B56ZW46jUeGQAg-/0/1742564112873?e=1773273600&v=beta&t=E33Q6Gx2ApiFDipoa5zyhl-8eGeayc0XbM_r64KjELE" },
  { name: "Sagar Swaroop Sahoo", role: "Core Member, Electrical & Electronics Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQFnekJ_N28n0A/profile-displayphoto-scale_400_400/B56ZeIo.ORHQAg-/0/1750344135283?e=1773273600&v=beta&t=3dkLw06EOrEYBwS2Lmu_nWyh_RezhbBlP2B-KeBnTv0" },
  { name: "Piyus Patra", role: "Core Member, Electrical & Electronics Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQFKp7ORRO2o7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731738857979?e=1773273600&v=beta&t=Nz0RQh_AXdcPHBEjGzHS8QKv94GgGQvxEWmCq0RjEFI" },
  { name: "Spandana Behera", role: "Core Member, Research & Innovation Wing", image: "https://media.licdn.com/dms/image/v2/D4D03AQHIQn2MMvyTTA/profile-displayphoto-scale_400_400/B4DZkghZEKJEAg-/0/1757187250339?e=1773273600&v=beta&t=2sk9cimYuvTsUsxADRllHwIQ8Bp-XnYRDpRYL_RJVb0" },
  { name: "Seikh Souvagya Mustakim", role: "Core Member, Research & Innovation Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQEIMZOsZq8yiQ/profile-displayphoto-scale_400_400/B56Zv_Tv7ZIcAg-/0/1769514930794?e=1773273600&v=beta&t=eY1jX0JCmDPmtiP412dxzCUDKeA6kuqKOX01lkvuC24" },
  { name: "Srusti Sikha Tripathy", role: "Core Member, Research & Innovation Wing", image: "https://media.licdn.com/dms/image/v2/D5603AQE_rIz1EnDAEg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709664516820?e=1773273600&v=beta&t=JxOy7MfD7JbKv77Vta5YFtZWACvLCQRjmfQaYtAetbQ" },
  { name: "Jyotirmayee Patnaik", role: "Core Member, Design & Animation Wing" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutPage />
      <EventsPreview />

      {/* --- Team Preview Section --- */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Meet Our Team
            </h2>
            <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">
              The brilliant minds driving our club forward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="group bg-white rounded-xl p-8 text-center"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto mb-5 h-20 w-20 rounded-full object-cover aspect-square ring-4 ring-zinc-200 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg ring-4 ring-zinc-200 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-500">
                    {getInitials(member.name)}
                  </div>
                )}
                <h3 className="text-xl font-bold text-black leading-snug">{member.name}</h3>
                <p className="text-sm text-black/70 mt-2">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* --- End Team Preview Section --- */}

      {/* <SponsorsSection /> */}
      <Footer />
    </div>
  );
};

export default HomePage;