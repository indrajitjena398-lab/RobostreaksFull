import { Mail, Instagram, Linkedin } from 'lucide-react';

const WebsiteDevTeamPage = () => {
  const teamSlots = [1, 2, 3];

  return (
    <section className="bg-black text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">WebsiteDev Team</h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamSlots.map((slot) => (
            <div key={slot} className="border border-white/20 rounded-xl p-7 md:p-8 bg-white/5 flex items-center gap-5 min-h-[220px]">
              {slot === 1 ? (
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQE8ptLzOYbcGg/profile-displayphoto-shrink_400_400/B56ZafyUHeHsAk-/0/1746437491531?e=1773273600&v=beta&t=Yp7pW9PZrgXbCpHZoBuCWx4oGwJ2Qa5B2xIa3MyUCZk"
                  alt="Ankush Sahoo"
                  className="h-20 w-20 rounded-full border-2 border-white/40 shrink-0 object-cover"
                  loading="lazy"
                />
              ) : slot === 2 ? (
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQEPuOVaTVEQ4w/profile-displayphoto-scale_400_400/B56ZyL7ElSGwAg-/0/1771874050621?e=1773273600&v=beta&t=_P1WbRkoYHi1nPbyeItSzXs2PbhsXJFiCHAECu5p5Ec"
                  alt="Indrajit Jena"
                  className="h-20 w-20 rounded-full border-2 border-white/40 shrink-0 object-cover"
                  loading="lazy"
                />
              ) : slot === 3 ? (
                <img
                  src="https://media.licdn.com/dms/image/v2/D5635AQE9DlopUw-0HA/profile-framedphoto-shrink_400_400/B56Zh0A0R_G4Ag-/0/1754293028304?e=1772524800&v=beta&t=DtBmi034BKtnpt_mVNgCj97xoHvcTO7HDm_vwzS-IGk"
                  alt="Priyanshu Sethy"
                  className="h-20 w-20 rounded-full border-2 border-white/40 shrink-0 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-20 w-20 rounded-full border-2 border-white/40 shrink-0" />
              )}
              <div>
                {slot === 1 ? (
                  <>
                    <p className="font-semibold text-white text-lg">Ankush Sahoo</p>
                    <p className="text-sm text-white/80 mt-1">Head Website Developer</p>
                    <p className="text-sm text-white/70 mt-1">Robostreaks Event Manager, Coding Head</p>
                    <p className="text-sm text-white/70 mt-1">Electrinics and telecomunication engineering</p>
                    <div className="flex items-center gap-3 mt-3 text-white/80">
                      <a href="#" aria-label="Email" className="hover:text-white transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.instagram.com/a.n.k.u.s.h_sah00"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="hover:text-white transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/ankush-sahoo/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-white transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </>
                ) : slot === 2 ? (
                  <>
                    <p className="font-semibold text-white text-lg">Indrajit Jena</p>
                    <p className="text-sm text-white/80 mt-1">Robostreaks Member</p>
                    <p className="text-sm text-white/70 mt-1">Electrical engineering</p>
                    <div className="flex items-center gap-3 mt-3 text-white/80">
                      <a
                        href="mailto:indrajitjena308@gmail.com"
                        aria-label="Email"
                        className="hover:text-white transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.instagram.com/indrajitjenaofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="hover:text-white transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/indrajit-jena-3183292a1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-white transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </>
                ) : slot === 3 ? (
                  <>
                    <p className="font-semibold text-white text-lg">Priyanshu Sethy</p>
                    <p className="text-sm text-white/80 mt-1">Robostreaks Member</p>
                    <p className="text-sm text-white/70 mt-1">Electrical engineering</p>
                    <div className="flex items-center gap-3 mt-3 text-white/80">
                      <a
                        href="mailto:anshusekhar0907@gmail.com"
                        aria-label="Email"
                        className="hover:text-white transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.instagram.com/_mr.unknown_0907"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="hover:text-white transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/priyanshu-sethy-6b0870331/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-white transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-white text-lg">Team Member {slot}</p>
                    <p className="text-base text-white/70">Add photo and details here</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebsiteDevTeamPage;
