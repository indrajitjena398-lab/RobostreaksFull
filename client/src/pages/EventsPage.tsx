import { useEffect, useMemo, useState } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  status: 'upcoming' | 'completed';
}

const REGISTRATION_URL = 'https://robomania.robostreakspmec.com/';

const EventCard = ({ event }: { event: EventItem }) => {
  const isUpcoming = event.status === 'upcoming';

  return (
    <article className="bg-white rounded-2xl overflow-hidden">
      <div className="relative h-48">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
          loading="lazy" 
        />
        <span
          className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium text-white inline-flex items-center gap-1.5 ${
            isUpcoming ? 'bg-zinc-600/95' : 'bg-red-600'
          }`}
        >
          {isUpcoming ? (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live
            </>
          ) : (
            'Completed'
          )}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-3">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-600 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{event.date}</span>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">{event.description}</p>

        {isUpcoming ? (
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Register Now
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white cursor-not-allowed"
          >
            Registration Closed
          </button>
        )}
      </div>
    </article>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('id, event_name, event_date, description, pic_link, status')
        .order('event_date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      const mapped = (data ?? []).map((eventItem: Record<string, unknown>) => ({
        id: String(eventItem.id ?? crypto.randomUUID()),
        title: String(eventItem.event_name ?? 'Untitled Event'),
        date: String(eventItem.event_date ?? '').slice(0, 10),
        description: String(eventItem.description ?? ''),
        image: String(eventItem.pic_link ?? '/assets/event/roboexpo.jpeg'),
        status: String(eventItem.status ?? 'upcoming') === 'completed' ? 'completed' : 'upcoming',
      }));

      setEvents(mapped);
      setIsLoading(false);
    };

    void loadEvents();
  }, []);

  const upcomingEvents = useMemo(() => events.filter((event) => event.status === 'upcoming'), [events]);
  const pastEvents = useMemo(() => events.filter((event) => event.status === 'completed'), [events]);

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Events</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us in exciting robotics competitions and educational events
          </p>
        </div>

        {error ? (
          <div className="text-red-400">Failed to load events: {error}</div>
        ) : isLoading ? (
          <div className="text-zinc-300">Loading events...</div>
        ) : (
          <>
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-8">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
