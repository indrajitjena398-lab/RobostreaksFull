import { Calendar, ExternalLink } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  status: 'upcoming' | 'completed';
}

const REGISTRATION_URL = 'https://robomania.robostreakspmec.com/';

const upcomingEvents: EventItem[] = [
  {
    id: 1,
    title: 'Robo Race 2026',
    date: 'March 6-7, 2026',
    description:
      'Robo Race 2025 is an exciting competition where teams of students design and build robots to compete in a series of challenges. This event promotes creativity, engineering skills, and teamwork among participants.',
    image: '/assets/event/robo-race.png',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Robo Sumo 2026',
    date: 'March 6-7, 2026',
    description:
      'Robo Sumo 2025 is an exhilarating competition where teams of students design and build robots to compete in a sumo wrestling format. The objective is to push the opponent\'s robot out of the ring, showcasing strength, strategy, and engineering skills.',
    image: '/assets/event/robosumo.jpg',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Line Follower 2026',
    date: 'March 6-7, 2026',
    description:
      'Line Follower 2026 is an exciting competition where teams of students design and build robots to follow a line on the ground. This event promotes creativity, engineering skills, and teamwork among participants.',
    image: '/assets/event/line%20follower.png',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Hardware Hackathon 2026',
    date: 'March 6-7, 2026',
    description:
      'A 12-hour intensive hackathon focused on hardware development. The event spans 2 days: 6 hours + 6 hours on Day 1, and 6 hours on Day 2. Teams collaborate to innovate and build cutting-edge hardware solutions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJCoelJEJL02nAdQ63XDz7IsCaG1laLXPe5A&s',
    status: 'upcoming',
  },
];

const pastEvents: EventItem[] = [
  {
    id: 4,
    title: 'ROBO EXPO',
    date: 'September 2025',
    description:
      'ROBO EXPO brought together student innovators to showcase robotics prototypes, practical engineering concepts, and project demonstrations in front of peers and mentors.',
    image: '/assets/event/roboexpo.jpeg',
    status: 'completed',
  },
];

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
  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Events</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join us in exciting robotics competitions and educational events
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default EventsPage;
