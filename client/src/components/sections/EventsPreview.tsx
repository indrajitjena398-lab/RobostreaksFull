import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const events = [
  {
    id: 1,
    title: 'Robo Race 2026',
    date: 'March 6-7, 2026',
    description:
      'Robo Race 2025 is an exciting competition where teams of students design and build robots to compete in a series of challenges. This event promotes creativity, engineering skills, and teamwork among participants.',
    image: '/assets/event/robo-race.png',
    registrationUrl: 'https://robomania.robostreakspmec.com/',
  },
  {
    id: 2,
    title: 'Robo Sumo 2026',
    date: 'March 6-7, 2026',
    description:
      'Robo Sumo 2025 is an exhilarating competition where teams of students design and build robots to compete in a sumo wrestling format. The objective is to push the opponent\'s robot out of the ring, showcasing strength, strategy, and engineering skills.',
    image: '/assets/event/robosumo.jpg',
    registrationUrl: 'https://robomania.robostreakspmec.com/',
  },
  {
    id: 3,
    title: 'Line Follower 2026',
    date: 'March 6-7, 2026',
    description:
      'Line Follower 2026 is an exciting competition where teams of students design and build robots to follow a line on the ground. This event promotes creativity, engineering skills, and teamwork among participants.',
    image: '/assets/event/line%20follower.png',
    registrationUrl: 'https://robomania.robostreakspmec.com/',
  },
  {
    id: 4,
    title: 'Hardware Hackathon 2026',
    date: 'March 6-7, 2026',
    description:
      'A 12-hour intensive hackathon focused on hardware development. The event spans 2 days: 6 hours + 6 hours on Day 1, and 6 hours on Day 2. Teams collaborate to innovate and build cutting-edge hardware solutions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJCoelJEJL02nAdQ63XDz7IsCaG1laLXPe5A&s',
    registrationUrl: 'https://robomania.robostreakspmec.com/',
  },
];

const EventsPreview = () => {
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
                <span className="absolute top-3 right-3 bg-gray-800/90 text-white text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{event.description}</p>

                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Register Now
                  <ExternalLink className="h-4 w-4" />
                </a>
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