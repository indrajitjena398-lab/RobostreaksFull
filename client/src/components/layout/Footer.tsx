import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 items-start text-left">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img 
                src="/assets/logo/Robostreaks Logo li.png"
                alt="Robostreaks logo"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-2xl font-bold">Robostreaks</h3>
            </div>

            <p className="text-white/80 max-w-md mb-6">
              Robotics through learning, innovation and competitive excellence.
            </p>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Parala+Maharaja+Engineering+College,+Berhampur,+Odisha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Parala Maharaja Engineering College, Berhampur, Odisha
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4" />
                <a href="mailto:robostreaks@pmec.ac.in" className="hover:text-white transition-colors">
                  robostreaks@pmec.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4" />
                <a href="tel:+917847914517" className="hover:text-white transition-colors">
                  +91 78479 14517
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-7">
              <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/robo_pmec" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/robostreaks/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:robostreaks@pmec.ac.in" aria-label="Mail" className="text-white/80 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/team" className="hover:text-white transition-colors">Members</Link></li>
              <li><Link to="/achievements" className="hover:text-white transition-colors">Achievements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-5">More</h4>
            <ul className="space-y-3 text-white/80">
              <li><Link to="/alumni" className="hover:text-white transition-colors">Alumni</Link></li>
              <li><Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link to="/timeline" className="hover:text-white transition-colors">Timeline</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center">
          <p className="text-sm text-white/70">© 2026 All Rights Reserved.</p>
          <Link to="/website-dev-team" className="text-sm mt-1 text-blue-400 font-bold hover:text-blue-300 transition-colors inline-block">
            Developed by WebsiteDev Team
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;