import { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, Trophy, Flag } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AchievementItem {
  id: string;
  status: string;
  year: string;
  title: string;
  location: string;
  description: string;
}

const getStatusColors = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('winner') || statusLower === '1st') {
    return {
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-400',
    };
  }

  if (statusLower.includes('1st runners up') || statusLower === '2nd') {
    return {
      bgColor: 'bg-gray-300',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-400',
    };
  }

  if (statusLower.includes('2nd runners up') || statusLower === '3rd') {
    return {
      bgColor: 'bg-amber-700',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-600',
    };
  }

  if (statusLower.includes('finalist')) {
    return {
      bgColor: 'bg-pink-200',
      textColor: 'text-pink-900',
      borderColor: 'border-pink-300',
    };
  }

  return {
    bgColor: 'bg-zinc-300',
    textColor: 'text-zinc-700',
    borderColor: 'border-zinc-300',
  };
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAchievements = async () => {
      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('achievements')
        .select('id, achievement_name, event_place, position, event_date, description')
        .order('event_date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      const mapped = (data ?? []).map((achievement: Record<string, unknown>) => ({
        id: String(achievement.id ?? crypto.randomUUID()),
        status: String(achievement.position ?? 'Achievement'),
        year: String(achievement.event_date ?? '').slice(0, 4),
        title: String(achievement.achievement_name ?? 'Untitled Achievement'),
        location: String(achievement.event_place ?? 'Location not specified'),
        description: String(achievement.description ?? ''),
      }));

      setAchievements(mapped);
      setIsLoading(false);
    };

    void loadAchievements();
  }, []);

  const sortedAchievements = useMemo(
    () => [...achievements].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)),
    [achievements],
  );

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-white mb-4">Our Achievements</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A testament to our dedication, innovation, and excellence in competitive robotics across the nation.
          </p>
        </div>

        {error ? (
          <div className="text-red-400">Failed to load achievements: {error}</div>
        ) : isLoading ? (
          <div className="text-zinc-300">Loading achievements...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAchievements.map((achievement) => {
              const StatusIcon = /winner|1st/i.test(achievement.status) ? Trophy : Flag;
              const statusColors = getStatusColors(achievement.status);

              return (
                <article key={achievement.id} className={`bg-zinc-100 rounded-2xl p-6 flex flex-col gap-4 shadow-none border-2 ${statusColors.borderColor}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={`${statusColors.bgColor} px-3 py-1 rounded-full ${statusColors.textColor} text-sm font-medium flex items-center gap-2`}>
                      <StatusIcon className="h-4 w-4" />
                      {achievement.status}
                    </span>
                    <span className="bg-zinc-200 px-3 py-1 rounded-full text-zinc-600 text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {achievement.year || 'N/A'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-zinc-900 leading-tight">{achievement.title}</h2>

                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{achievement.location}</span>
                  </div>

                  <p className="text-zinc-600 text-sm leading-relaxed">{achievement.description}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
