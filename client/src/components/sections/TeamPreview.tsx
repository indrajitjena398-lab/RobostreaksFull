import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  image_url: string;
}

const fallbackTeam: TeamMemberItem[] = [];

const TeamPreview = () => {
  const [team, setTeam] = useState<TeamMemberItem[]>(fallbackTeam);

  useEffect(() => {
    let active = true;

    const loadTeam = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, branch, position, pic_link')
        .order('created_at', { ascending: false });

      if (error || !active) {
        return;
      }

      const mapped = (data ?? []).map((memberItem: Record<string, unknown>) => {
        const position = String(memberItem.position ?? 'Member');
        const branch = String(memberItem.branch ?? '').trim();
        const picLink = memberItem.pic_link ? String(memberItem.pic_link) : '';
        return {
          id: String(memberItem.id ?? crypto.randomUUID()),
          name: String(memberItem.name ?? 'Unknown Member'),
          role: branch ? `${position}, ${branch}` : position,
          image_url: picLink || `https://ui-avatars.com/api/?name=${encodeURIComponent(String(memberItem.name ?? 'Unknown Member'))}&background=random`,
        } satisfies TeamMemberItem;
      });

      setTeam(mapped.length > 0 ? mapped : fallbackTeam);
    };

    void loadTeam();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-20 bg-black text-white min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            The brilliant minds driving our club forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <article key={member.id} className="bg-gray-900 rounded-xl overflow-hidden text-center hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-800">
              <div className="relative h-64 w-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={member.image_url.startsWith('/') || member.image_url.startsWith('http') 
                    ? member.image_url 
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to initials if the image fails to load
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=256`;
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-sm font-medium text-green-500">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamPreview;