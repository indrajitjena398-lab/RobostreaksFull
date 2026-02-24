import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface VideoTutorial {
  id: number;
  title: string;
  author: string;
  thumbnail: string;
  videoLink: string;
  badge?: 'upcoming' | 'new';
}

interface Software {
  name: string;
  description: string;
}

interface SoftwareData {
  design: Software[];
  simulation: Software[];
  advanced: Software[];
}

// Hardcoded robotics software list
const defaultSoftwares: SoftwareData = {
  design: [
    {
      name: 'CATIA',
      description: 'Advanced 3D CAD design software',
    },
    {
      name: 'AutoCAD',
      description: 'Professional 2D and 3D CAD software',
    },
    {
      name: 'SolidWorks',
      description: '3D mechanical design and simulation',
    },
    {
      name: 'Fritzing',
      description: 'Electronic circuit design and prototyping',
    },
    {
      name: 'Fusion 360',
      description: 'Cloud-based 3D CAD and CAM software',
    },
  ],
  simulation: [
    {
      name: 'Ansys',
      description: 'Engineering simulation software',
    },
    {
      name: 'Creo',
      description: '3D CAD software with simulation capabilities',
    },
    {
      name: 'COMSOL Multiphysics',
      description: 'Advanced numerical simulation software',
    },
  ],
  advanced: [
    {
      name: 'MATLAB',
      description: 'Technical computing and algorithm development',
    },
    {
      name: 'ROS',
      description: 'Robot Operating System framework',
    },
  ],
};

// Hardcoded video tutorials matching Robostreaks theme
const videoTutorials: VideoTutorial[] = [
  {
    id: 1,
    title: 'How to Make Arduino Line Follower Robot',
    author: 'by Science Buddies',
    thumbnail: 'https://img.youtube.com/vi/Hz12ZqKlSWU/maxresdefault.jpg',
    videoLink: 'https://www.youtube.com/watch?v=Hz12ZqKlSWU',
    badge: 'new',
  },
  {
    id: 2,
    title: 'Arduino Robot Car - Complete Tutorial',
    author: 'by How To Mechatronics',
    thumbnail: 'https://img.youtube.com/vi/7Uu3kT0XKQE/maxresdefault.jpg',
    videoLink: 'https://www.youtube.com/watch?v=7Uu3kT0XKQE',
  },
  {
    id: 3,
    title: 'Servo Motor Control with Arduino',
    author: 'by Programming Electronics',
    thumbnail: 'https://img.youtube.com/vi/kUHmYKWwuWs/maxresdefault.jpg',
    videoLink: 'https://www.youtube.com/watch?v=kUHmYKWwuWs',
  },
  {
    id: 4,
    title: 'Building an Obstacle Avoiding Robot',
    author: 'by Dejan Nedelkovski',
    thumbnail: 'https://img.youtube.com/vi/_Z3KlWvGUS0/maxresdefault.jpg',
    videoLink: 'https://www.youtube.com/watch?v=_Z3KlWvGUS0',
    badge: 'new',
  },
];

const VideoTutorialCard = ({ tutorial }: { tutorial: VideoTutorial }) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Tutorial+Video';
          }}
        />
        {tutorial.badge && (
          <span
            className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium text-white ${
              tutorial.badge === 'new' ? 'bg-green-600' : 'bg-yellow-600'
            }`}
          >
            {tutorial.badge === 'new' ? 'New' : 'Upcoming'}
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
          {tutorial.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{tutorial.author}</p>

        <a
          href={tutorial.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center rounded-md bg-zinc-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

const TutorialsPage = () => {
  const [softwares, setSoftwares] = useState<SoftwareData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch softwares data
        const softwaresRes = await fetch('/admin/api/data/softwares');
        const softwaresData = await softwaresRes.json();

        // Set Softwares (Expect Object with keys: design, simulation, etc.)
        if (Array.isArray(softwaresData) && softwaresData.length > 0) {
          setSoftwares(softwaresData[0]);
        } else if (softwaresData && typeof softwaresData === 'object') {
          setSoftwares(softwaresData);
        } else {
          // Fallback to default software list
          setSoftwares(defaultSoftwares);
        }

      } catch (error) {
        console.error("Error loading resources:", error);
        // Use default softwares on error
        setSoftwares(defaultSoftwares);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex justify-center items-center">
        <div className="text-xl text-white">Loading Resources...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Tutorials
          </h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Learn robotics through comprehensive tutorials, videos, and software tools
          </p>
        </div>

        {/* YouTube-Style Video Tutorials Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Video Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {videoTutorials.map((tutorial) => (
              <VideoTutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </section>

        {/* Software List */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Robotics Software</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(softwares || defaultSoftwares).map(([category, softwareList]) => {
              // Ensure softwareList is actually an array before mapping
              if (!Array.isArray(softwareList)) return null;

              return (
                <div
                  key={category}
                  className="bg-card border border-border rounded-xl p-6 hover-glow transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-black mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {softwareList.map((software, index) => (
                      <div key={index} className="border-b border-border/50 pb-3 last:border-b-0">
                        <h4 className="font-semibold text-black mb-1">
                          {software.name}
                        </h4>
                        <p className="text-sm text-black/60">
                          {software.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TutorialsPage;