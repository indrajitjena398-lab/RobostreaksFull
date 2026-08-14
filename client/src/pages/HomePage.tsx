// src/pages/HomePage.tsx

import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import AboutPage from "@/pages/AboutPage";
import EventsPreview from "@/components/sections/EventsPreview";
// import SponsorsSection from "@/components/sections/SponsorsSection";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/supabaseClient";

interface MemberItem {
  name: string;
  role: string;
  image?: string;
}

const fallbackTeamMembers: MemberItem[] = [];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const HomePage = () => {
  const [teamMembers, setTeamMembers] = useState<MemberItem[]>(fallbackTeamMembers);

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, branch, position, pic_link")
        .order("created_at", { ascending: false });

      if (error || !active) {
        return;
      }

      const mapped = (data ?? []).map((member: Record<string, unknown>) => {
        const position = String(member.position ?? "Member");
        const branch = String(member.branch ?? "").trim();
        const image = String(member.pic_link ?? "").trim();
        return {
          name: String(member.name ?? "Unnamed Member"),
          role: branch ? `${position}, ${branch}` : position,
          image: image.length > 0 ? image : undefined,
        } satisfies MemberItem;
      });

      const seenNames = new Set<string>();
      const uniqueMembers = mapped.filter((member) => {
        const normalizedName = member.name.trim().toLowerCase();
        if (!normalizedName || seenNames.has(normalizedName)) {
          return false;
        }
        seenNames.add(normalizedName);
        return true;
      });

      setTeamMembers(uniqueMembers.length > 0 ? uniqueMembers : fallbackTeamMembers);
    };

    void loadMembers();

    return () => {
      active = false;
    };
  }, []);

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