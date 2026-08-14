import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface MemberItem {
  id: string;
  name: string;
  role: string;
  image?: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const MemberCard = ({ member }: { member: MemberItem }) => (
  <article className="group bg-white rounded-2xl p-8 flex flex-col items-center text-center">
    {member.image ? (
      <img
        src={member.image}
        alt={member.name}
        className="w-24 h-24 rounded-full object-cover mb-5 aspect-square ring-4 ring-zinc-200 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    ) : (
      <div className="w-24 h-24 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 text-lg font-semibold mb-5 aspect-square ring-4 ring-zinc-200 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-500">
        {getInitials(member.name)}
      </div>
    )}
    <h3 className="text-black text-xl font-bold leading-snug">{member.name}</h3>
    <p className="text-zinc-600 text-sm mt-2">{member.role}</p>
  </article>
);

const TeamPage = () => {
  const [currentMembers, setCurrentMembers] = useState<MemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('members')
        .select('id, name, branch, position, pic_link')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      const mapped = (data ?? []).map((member: Record<string, unknown>) => {
        const position = String(member.position ?? 'Member');
        const branch = String(member.branch ?? '').trim();
        return {
          id: String(member.id ?? crypto.randomUUID()),
          name: String(member.name ?? 'Unnamed Member'),
          role: branch ? `${position}, ${branch}` : position,
          image: String(member.pic_link ?? ''),
        };
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

      setCurrentMembers(uniqueMembers);
      setIsLoading(false);
    };

    void loadMembers();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">The brilliant minds driving our club forward.</p>
        </div>

        <section>
          <h2 className="text-3xl font-bold mb-8">Current Members</h2>
          {error ? (
            <div className="text-red-400">Failed to load members: {error}</div>
          ) : isLoading ? (
            <div className="text-zinc-400">Loading members...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
