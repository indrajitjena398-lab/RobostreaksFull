import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/supabaseClient';

interface EventPreviewItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  status: 'upcoming' | 'completed';
  registrationUrl: string;
}

const REGISTRATION_URL = 'https://robomania.robostreakspmec.com/';

const fallbackEvents: EventPreviewItem[] = [];

const EventsPreview = () => {
  const [events, setEvents] = useState<EventPreviewItem[]>(fallbackEvents);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name, event_date, description, pic_link, status')
        .order('event_date', { ascending: false });

      if (error || !active) {
        return;
      }

      const mapped = (data ?? []).map((eventItem: Record<string, unknown>) => {
        const status = String(eventItem.status ?? 'upcoming') === 'completed' ? 'completed' : 'upcoming';
        return {
          id: String(eventItem.id ?? crypto.randomUUID()),
          title: String(eventItem.event_name ?? 'Untitled Event'),
          date: String(eventItem.event_date ?? ''),
          description: String(eventItem.description ?? ''),
          image: String(eventItem.pic_link ?? '/assets/event/roboexpo.jpeg'),
          status,
          registrationUrl: REGISTRATION_URL,
        } satisfies EventPreviewItem;
      });

      const upcoming = mapped.filter((eventItem) => eventItem.status === 'upcoming');
      const completed = mapped.filter((eventItem) => eventItem.status === 'completed');
      const preview = [...upcoming, ...completed].slice(0, 4);

      setEvents(preview.length > 0 ? preview : fallbackEvents);
    };

    void loadEvents();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 bg-black text-white">
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Events
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            Experience the thrill of competitive robotics through our exciting events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <article key={event.id} className="bg-white rounded-xl overflow-hidden text-black">
              <div className="relative h-52">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover image-pop"
                  loading="lazy"
                />
                {event.status === 'upcoming' ? (
                  <span className="absolute top-3 right-3 bg-gray-800/90 text-white text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Live
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    Completed
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{event.description}</p>

                {event.status === 'upcoming' ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors cursor-pointer"
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
          ))}
          </div>


        <div className="flex justify-center mt-14">
          <Button asChild>
            <Link to="/events" className="flex items-center cursor-pointer">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;