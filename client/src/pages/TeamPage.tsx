interface MemberItem {
  name: string;
  role: string;
  image?: string;
}

const currentMembers: MemberItem[] = [
  { name: 'Om Pratyush Nayak', role: 'Co-ordinator', image: 'https://media.licdn.com/dms/image/v2/D4E03AQFfneWL8RzMgg/profile-displayphoto-shrink_400_400/B4EZXYm2.cH0Ak-/0/1743095821859?e=1773273600&v=beta&t=ztj2-05BpBpnUM5OvxH_HOePP-m8qgpEULRWIvEF7rY' },
  { name: 'Neha Sabat', role: 'Co-Ordinator', image: 'https://media.licdn.com/dms/image/v2/D5603AQHari0vn-tQHw/profile-displayphoto-scale_400_400/B56ZmZBrpGI0Ak-/0/1759208982192?e=1773273600&v=beta&t=UB0sB_lA3HJn8_ETtxvkFcjNSw1HUH95by8nInfCHbE' },
  { name: 'Ankush Sahoo', role: 'Event Manager, Coding Head', image: 'https://media.licdn.com/dms/image/v2/D5603AQE8ptLzOYbcGg/profile-displayphoto-shrink_400_400/B56ZafyUHeHsAk-/0/1746437491531?e=1773273600&v=beta&t=Yp7pW9PZrgXbCpHZoBuCWx4oGwJ2Qa5B2xIa3MyUCZk' },
  { name: 'Aditya Prasad Singh Samanta', role: 'Core Member, Media Marketing', image: 'https://media.licdn.com/dms/image/v2/D5603AQHN4ZSm6qQnLQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714373939735?e=1773273600&v=beta&t=5cxEKaTXoeP4rXh0eiDCxXPjVd1YtsxNgQuT0sa1h84' },
  { name: 'Mihir Kumar Panda', role: 'Core Member, Media Marketing' },
  { name: 'Avinash Mahapatra', role: 'Core Member, Mechanical Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQHHh9Zsh9xwMg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718248971186?e=1773273600&v=beta&t=gW6ZipZ1eO1bpdN2l82CaMeCAO4vdqB8EvZq6vg1tX0' },
  { name: 'Ankit Mohapatra', role: 'Core Member, Mechanical Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQFuhPsOJsG33A/profile-displayphoto-scale_400_400/B56ZjVzN5QHAAo-/0/1755933631561?e=1773273600&v=beta&t=Y4y1nZ_b5FqEnbCApJ-v4n_ZO9zTiwvd_eVZc0i5XKY' },
  { name: 'Rajasmita Lenka', role: 'Core Member, Coding Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQEeOvJA8zYpEA/profile-displayphoto-scale_100_100/B56Zwut67qGQAc-/0/1770310316918?e=1773273600&v=beta&t=vCQEB3m6eHb9zGM8gUxk0q5Nq3ZKDBI7tvpDyVj3Kv4' },
  { name: 'Arpit Kumar Khamari', role: 'Core Member, Coding Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQFj3HR5rOgOew/profile-displayphoto-shrink_400_400/B56ZW46jUeGQAg-/0/1742564112873?e=1773273600&v=beta&t=E33Q6Gx2ApiFDipoa5zyhl-8eGeayc0XbM_r64KjELE' },
  { name: 'Sagar Swaroop Sahoo', role: 'Core Member, Electrical & Electronics Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQFnekJ_N28n0A/profile-displayphoto-scale_400_400/B56ZeIo.ORHQAg-/0/1750344135283?e=1773273600&v=beta&t=3dkLw06EOrEYBwS2Lmu_nWyh_RezhbBlP2B-KeBnTv0' },
  { name: 'Piyus Patra', role: 'Core Member, Electrical & Electronics Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQFKp7ORRO2o7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731738857979?e=1773273600&v=beta&t=Nz0RQh_AXdcPHBEjGzHS8QKv94GgGQvxEWmCq0RjEFI' },
  { name: 'Spandana Behera', role: 'Core Member, Research & Innovation Wing', image: 'https://media.licdn.com/dms/image/v2/D4D03AQHIQn2MMvyTTA/profile-displayphoto-scale_400_400/B4DZkghZEKJEAg-/0/1757187250339?e=1773273600&v=beta&t=2sk9cimYuvTsUsxADRllHwIQ8Bp-XnYRDpRYL_RJVb0' },
  { name: 'Seikh Souvagya Mustakim', role: 'Core Member, Research & Innovation Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQEIMZOsZq8yiQ/profile-displayphoto-scale_400_400/B56Zv_Tv7ZIcAg-/0/1769514930794?e=1773273600&v=beta&t=eY1jX0JCmDPmtiP412dxzCUDKeA6kuqKOX01lkvuC24' },
  { name: 'Srusti Sikha Tripathy', role: 'Core Member, Research & Innovation Wing', image: 'https://media.licdn.com/dms/image/v2/D5603AQE_rIz1EnDAEg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709664516820?e=1773273600&v=beta&t=JxOy7MfD7JbKv77Vta5YFtZWACvLCQRjmfQaYtAetbQ' },
  { name: 'Jyotirmayee Patnaik', role: 'Core Member, Design & Animation Wing' },
];

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
  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Meet the amazing team behind ROBOSTREAKS!</p>
        </div>

        <section>
          <h2 className="text-3xl font-bold mb-8">Current Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMembers.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
