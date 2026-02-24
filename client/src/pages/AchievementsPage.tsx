import { Calendar, MapPin, Trophy, Flag } from 'lucide-react';

interface AchievementItem {
  status: string;
  year: string;
  title: string;
  location: string;
  description: string;
}

const achievements: AchievementItem[] = [
  {
    status: 'Winner',
    year: '2024',
    title: 'ARTPARK-Pravega Robotics Challenge (Prelims)',
    location: 'IISc Banglore',
    description:
      'Team Whizzers achieved the Winner position in the ARTPARK-Pravega Robotics Challenge (Prelims) organized by IISc Banglore. Team members included Aman Patra and M Lisha.',
  },
  {
    status: '1st Runners up',
    year: '2024',
    title: 'Global Hyperloop Conference',
    location: 'IIT Madras',
    description:
      'Team secured the 1st Runners up position in the Global Hyperloop Conference at IIT Madras. Team members were Aman Patra, S Nandini Reddy, Dinesh Sekhar Deo, Supriya Suna, and Preetam Kumar Sahu.',
  },
  {
    status: 'Winner',
    year: '2024',
    title: 'Robo Race',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Helter Squad won the Robo Race event at Parala Maharaja Engineering College. Team members were Shekh Sharfraj, Bikasha Prusty, and Ipsita Ray.',
  },
  {
    status: '2nd Runners Up',
    year: '2024',
    title: 'Line Follower',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Phoenix secured the 2nd Runners Up position in the Line Follower event at Parala Maharaja Engineering College. Team members were Akash S.R and Karanjeet Behera.',
  },
  {
    status: 'Winner',
    year: '2024',
    title: 'Line Follower',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Groot won the Line Follower event at Parala Maharaja Engineering College. Team members were Shekh Sharfraj and Anil Kumar Sahoo.',
  },
  {
    status: '1st Runners up',
    year: '2024',
    title: 'The Innovation Challenge',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Unitech secured the 1st Runners up position in The Innovation Challenge at Parala Maharaja Engineering College. Team members were Sushree R. Rutudhwaja Sahoo, Gopinath Patra, and Jyotismita Behera.',
  },
  {
    status: '2nd Runners Up',
    year: '2024',
    title: 'D3 Fest, Robo race',
    location: 'IIIT, Bhubaneswar',
    description:
      'Team Groot secured the 2nd Runners Up position in D3 Fest, Robo race at IIIT, Bhubaneswar. Team members were Bikasha Prusty and Ipsita Ray.',
  },
  {
    status: 'Winner',
    year: '2024',
    title: 'D3 Fest, Line follower',
    location: 'IIIT, Bhubaneswar',
    description:
      'Team Phoenix won the Line follower event in D3 Fest at IIIT, Bhubaneswar. Team members were Anil Kumar Sahoo and Karanjeet Behera.',
  },
  {
    status: 'Finalist',
    year: '2024',
    title: 'Smart India Hackathon',
    location: 'AICTE, Ministry of Education',
    description:
      'Team NexGen were Finalists in the Smart India Hackathon. Team members were Piyush Patra, Ricky Kharsel, Sneha Gouda, and Kiran Kumar Pradhan.',
  },
  {
    status: 'Finalist',
    year: '2024',
    title: 'Smart India Hackathon',
    location: 'AICTE, Ministry of Education',
    description:
      'Team Hack Halden were Finalists in the Smart India Hackathon organized by AICTE, Ministry of Education. Team members were Subham Ranjan Sahoo, Jatin Kumar Rauto, Bishnu Prasad Sahu, Rachna Majhi, and Sthitaprajna Sahoo.',
  },
  {
    status: '1st Runners up',
    year: '2025',
    title: 'Hack For Tomorrow',
    location: 'VSSUT, Burla',
    description:
      'Team Feme Vision secured the 1st Runners up position in Hack For Tomorrow at VSSUT, Burla. Team members were Seikh Souvagya Mustakim, Biswajit Polai, Sujal Charati, and Deepak Sahoo.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Hack For Tomorrow',
    location: 'VSSUT, Burla',
    description:
      'Team Vision won Hack For Tomorrow at VSSUT, Burla. Team members were Rajasmita Lenka, P.S. Mahanambrata Mohanty, and K Sibaram Patro.',
  },
  {
    status: '2nd Runners Up',
    year: '2025',
    title: 'Robo race',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Tech Titan secured the 2nd Runners Up position in Robo race at Parala Maharaja Engineering College. Team members were Aditya Prasad Singh Samanta and Prabhudutta Mohant.',
  },
  {
    status: '1st Runners up',
    year: '2025',
    title: 'Robo race',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Helter Squad 2.0 secured the 1st Runners up position in Robo race at Parala Maharaja Engineering College. Team members were Aditya Kumar Sahu and Om Prakash Swa.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Robo race',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Fire Wizard won Robo race at Parala Maharaja Engineering College. Team members were Om Pratyush Nayak, Om Prakash Behera, and Aditya Prasad Singh Samanta.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'LineFollower',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Epics won the LineFollower event at Parala Maharaja Engineering College. Team members were Rajasmita Lenka, Ashutosh Jena, and Anish Maity.',
  },
  {
    status: '2nd Runners Up',
    year: '2025',
    title: 'Robo Sumo',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Infinity Nexus secured the 2nd Runners Up position in Robo Sumo at Parala Maharaja Engineering College. Team members were Sibam Patnaik, Swastik Das, and P.S Mahanambrata Mohanty.',
  },
  {
    status: '1st Runners up',
    year: '2025',
    title: 'Robo Sumo',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Kung Fu Panda secured the 1st Runners up position in Robo Sumo at Parala Maharaja Engineering College. Team members were Avinash Mohapatra, Spandana Behera, and Jyotirmayee Patnaik.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Robo Sumo',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Infinity Ultron won Robo Sumo at Parala Maharaja Engineering College. Team members were Biswajit Swain, Arpit Kumar Khamari, and Ashutosh Nayak.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Avastra Techno Cultural Fest',
    location: 'Einstein Institute of Technology',
    description:
      'Team Infinity Ultron won at Avastra Techno Cultural Fest, Einstein Institute of Technology. Team members were Biswajit Swain, Deepak Sahoo, and P.S Mahanambrata Mohanty.',
  },
  {
    status: '2nd Runners Up',
    year: '2025',
    title: 'Advaita 2K25',
    location: 'IIIT, Bhubaneswar',
    description:
      'Team Infinity Nexus secured the 2nd Runners Up position in Advaita 2K25 at IIIT, Bhubaneswar. Team members were Sibam Patnaik, Swastik Das, and Deepak Sahoo.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Advaita 2K25',
    location: 'IIIT, Bhubaneswar',
    description:
      'Team Infinity Prime won Advaita 2K25 at IIIT, Bhubaneswar. Team members were Sagar Swarup Sahoo, Sahil Sethy, and Biswajit Swain.',
  },
  {
    status: 'Finalist',
    year: '2025',
    title: 'BPUT Hackathon',
    location: 'Biju Patnaik University of Technology',
    description:
      'Team Zenith were Finalists in the BPUT Hackathon organized by Biju Patnaik University of Technology. Team members were Ansita Priyadarshani, Sanchit Tandia, Malaya Ranjan Behera, and Abinash Panda.',
  },
  {
    status: '2nd Runners Up',
    year: '2025',
    title: 'BPUT Hackathon',
    location: 'Biju Patnaik University of Technology',
    description:
      'Team CodeRiot secured the 2nd Runners Up position in the BPUT Hackathon organized by Biju Patnaik University of Technology. Team members were Priyanshu Sethy, Rubina Acharya, Amit Beura, Rashmi Ranjan Mohapatra, and Indrajit Jena.',
  },
  {
    status: 'Winner',
    year: '2025',
    title: 'Terratrek Competition',
    location: 'IIIT, Bhubaneswar',
    description:
      'Team Robonova won the Terratrek Competition at IIIT, Bhubaneswar. Team members were Satyajit Sethi, Anwesha Patra, Riya Jaiswal, and Rabi Narayan Gouda.',
  },
  {
    status: 'Finalist',
    year: '2025',
    title: 'Smart India Hackathon',
    location: 'Department of Consumer Affairs (DoCA)',
    description:
      'Team WeighOut were Finalists in the Smart India Hackathon under the Department of Consumer Affairs (DoCA). Team members were Arpit Kumar Khamari, Babul Swain, Aditya Prasad Singh Samanta, Aditya Kumar Sahoo, Sindhukripa Mishra, and Bagmita Mohapatra.',
  },
  {
    status: 'Finalist',
    year: '2023',
    title: 'Smart India Hackathon',
    location: 'AICTE, Ministry of Education',
    description:
      'Team Rfixer were Finalists in the Smart India Hackathon organized by AICTE, Ministry of Education. Team members were Sushree R Rutudhwaja Sahoo, Shekh Sharfraj, Shubham Ranjan Sahoo, Swayam Suvam Nayak, and Debadatta Pradhan.',
  },
  {
    status: 'Finalist',
    year: '2023',
    title: 'Smart India Hackathon',
    location: 'AICTE, Ministry of Education',
    description:
      'Team Medtech Explorers were Finalists in the Smart India Hackathon organized by AICTE, Ministry of Education. Team members included Jyotismita Behera, Ankit Pattnaik, and Prachi Pragnya Padhi.',
  },
  {
    status: 'Finalist',
    year: '2023',
    title: 'Smart India Hackathon',
    location: 'AICTE, Ministry of Education',
    description:
      'Team MindFlow were Finalists in the Smart India Hackathon organized by AICTE, Ministry of Education. The team consisted of Purnima Prusty, Nalini Prashad Dash, and Ankita Patra.',
  },
  {
    status: 'Winner',
    year: '2023',
    title: 'Auto Hackathon',
    location: 'Ashok Leyland',
    description:
      'Team Whizzers were Winners at the Auto Hackathon organized by Ashok Leyland. The team members were Aman Patra and Prachi Pragnya Padhi.',
  },
  {
    status: 'Winner',
    year: '2023',
    title: 'SPRINT',
    location: 'IIT Ropar',
    description:
      'Team Whizzers won the SPRINT event at IIT Ropar. The team included Aman Patra, Prachi Pragyan Padhi, Diptiman Mohanta, Sushree R Rutudhwaja Sahoo, and Rupal Rupashree Biswal.',
  },
  {
    status: 'Winner',
    year: '2023',
    title: 'Robo Race',
    location: 'Silicon Institutes Of Technology',
    description:
      'Team Robotech won the Robo Race event at Silicon Institutes Of Technology. The team members were Sunil Kumar Padhy, Neha Rani Maharana, Rishikant Behera, and Pragyan Kumar Sathpathy.',
  },
  {
    status: '1st Runners up',
    year: '2024',
    title: 'Line Follower',
    location: 'Silicon Institutes Of Technology',
    description:
      'Team Tech Glide secured the 1st Runners up position in the Line Follower event at Silicon Institutes Of Technology. Team members were Swayam Suvam Nayak, Rupal Rupashree Biswal, and Swadhin Swain.',
  },
  {
    status: '1st Runners up',
    year: '2023',
    title: 'Fastest Line Follower',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team MedMax secured the 1st Runners up position in the Fastest Line Follower event at Parala Maharaja Engineering College. Team members were Swayam Suvam Nayak, Shekh Sharfraj, Ashutosh Mahanta, and Dibyajyoti Ranjan Sahoo.',
  },
  {
    status: '2nd Runners Up',
    year: '2023',
    title: 'Ideathon-2023',
    location: 'Parala Maharaja Engineering College',
    description:
      'Team Red Wing secured the 2nd Runners Up position at Ideathon-2023, organized by Parala Maharaja Engineering College. The team consisted of Purnima Prusty and Gyana Ranjan Khatua.',
  },
  {
    status: 'Top-20',
    year: '2023',
    title: 'Innovate Odisha Hackathon',
    location: 'Odisha Startup NISER',
    description:
      'Team Whizzers were among the Top-20 in the Innovate Odisha Hackathon. The team members were Aman Patra and M Lisha.',
  },
  {
    status: 'Published',
    year: '2022',
    title: 'Research Article publication in Yantriki',
    location: 'NIT, Surat',
    description:
      'Team Whizzers, consisting of Preetam Kumar Sahu and Keshav Jha, had their research article published in Yantriki by NIT, Surat.',
  },
  {
    status: 'Finalist',
    year: '2022',
    title: 'Research Article publication in RIAC PRP Journal',
    location: 'IIT Bombay',
    description:
      'Team Whizzers, with members Aman Patra and M Lisha, were Finalists for their research article publication in the RIAC PRP Journal by IIT Bombay.',
  },
  {
    status: 'Winner',
    year: '2021',
    title: 'Ideathon-2021',
    location: 'IIT Bombay',
    description:
      'Team Whizzers, with members Aman Patra and M Lisha, won Ideathon-2021 at IIT Bombay.',
  },
  {
    status: '1st',
    year: '2018',
    title: 'Manual, SAMAVESH 2018',
    location: 'VSSUT, Burla',
    description:
      'Team UCHIHA\'S secured 1st place in the Manual event at SAMAVESH 2018, VSSUT, Burla. The team included Jagdish Kumar Panda, Subhankar Panda, Animesh Sahoo, and Jagadish Prasad Das.',
  },
  {
    status: '3rd',
    year: '2018',
    title: 'Manual, ADVAITA 2018',
    location: 'IIIT, Bhubaneshwar',
    description:
      'Team Ra-1 secured 3rd place in the Manual event at ADVAITA 2018, IIIT, Bhubaneshwar. The team members were M. Kamala Kanta, L. Praveen, Krishna Harpal, and Raj Kumar Bisoyi.',
  },
  {
    status: '3rd',
    year: '2018',
    title: 'Manual WISSENAIRE 2018',
    location: 'IIT, Bhubaneshwar',
    description:
      'Team The A Team secured 3rd place in the Manual event at WISSENAIRE 2018, IIT, Bhubaneshwar. The team included Ankit Hembram, Arun Pattanayak, and Amrit Baral.',
  },
  {
    status: '3rd',
    year: '2018',
    title: 'Semi Automated, WISSENAIRE 2018',
    location: 'IIT, Bhubaneshwar',
    description:
      'Team Fusion_4.0, represented by Biswajit Behera, secured 3rd place in the Semi Automated event at WISSENAIRE 2018, IIT, Bhubaneshwar.',
  },
  {
    status: '2nd',
    year: '2017',
    title: 'Manual, ROBOTER, 2017',
    location: 'GITA, Bhubaneshwar',
    description:
      'Team Phoenix secured 2nd place in the Manual event at ROBOTER, 2017, GITA, Bhubaneshwar. The team included Santosh Nayak, Biplab Samal, Abhishek Dey, and Anicet Toppo.',
  },
  {
    status: '1st',
    year: '2017',
    title: 'Manual Zonal level, Techfest 2017',
    location: 'IIT, Bombay',
    description:
      'Team FireHeart secured 1st place in the Manual Zonal level event at Techfest 2017, IIT, Bombay. The team members were Manmeshwar Patnaik and Ashutosh Tripathy.',
  },
  {
    status: '1st',
    year: '2017',
    title: 'Manual Zonal level, Techniche 2017',
    location: 'IIT, Guwahati',
    description:
      'Team Ra-1, represented by M Kamala Kanta, secured 1st place in the Manual Zonal level event at Techniche 2017, IIT, Guwahati.',
  },
  {
    status: '3rd',
    year: '2017',
    title: 'Manual Robosprano 2017',
    location: 'GCEK, Bhabanipatna',
    description:
      'Team Ra-1 secured 3rd place in the Manual Robosprano 2017 event at GCEK, Bhabanipatna. The team members were M. Kamala Kanta and Biplab Samal.',
  },
  {
    status: '3rd',
    year: '2017',
    title: 'Manual Robosprano 2017',
    location: 'GCEK, Bhabanipatna',
    description:
      'Team Susi 3.0 secured 3rd place in the Manual Robosprano 2017 event at GCEK, Bhabanipatna. The team members were Sourav Mohapatra and Upamanyu Pattnaik.',
  },
  {
    status: '1st',
    year: '2017',
    title: 'Automated Perception, 2017',
    location: 'CET, Bhubaneshwar',
    description:
      'Team Jarvis secured 1st place in the Automated Perception, 2017 event at CET, Bhubaneshwar. The team members were Warish Kumar Sahoo and Rohan Kumar Sethy.',
  },
  {
    status: '2nd',
    year: '2017',
    title: 'Automated Perception, 2017',
    location: 'CET, Bhubaneshwar',
    description:
      'Team Confutics secured 2nd place in the Automated Perception, 2017 event at CET, Bhubaneshwar. The team members were Sidharth Sree Kumar and Manas Beura.',
  },
  {
    status: '2nd',
    year: '2017',
    title: 'Automated Advaita 2017',
    location: 'IIIT, Bhubaneshwar',
    description:
      'Team Jarvis secured 2nd place in the Automated Advaita 2017 event at IIIT, Bhubaneshwar. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, and Sushil Swain.',
  },
  {
    status: '1st',
    year: '2017',
    title: 'Semi-Autonomous Advaita 2017',
    location: 'IIIT, Bhubaneshwar',
    description:
      'Team Jarvis secured 1st place in the Semi-Autonomous Advaita 2017 event at IIIT, Bhubaneshwar. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, and Sushil Swain.',
  },
  {
    status: '1st',
    year: '2017',
    title: 'Autonomous Sanklap, 2017',
    location: 'NIST, Berhampur',
    description:
      'Team Jarvis secured 1st place in the Autonomous Sanklap, 2017 event at NIST, Berhampur. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, and Sushil Swain.',
  },
  {
    status: '1st',
    year: '2016',
    title: 'Semi-Autonomous, Kshitij 2016',
    location: 'IIT, Kharagpur',
    description:
      'Team Jarvis secured 1st place in the Semi-Autonomous event at Kshitij 2016, IIT, Kharagpur. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, Sushil Swain, and Sambit Parida.',
  },
  {
    status: '2nd',
    year: '2016',
    title: 'Manual South Regional level, Techfest 2016',
    location: 'IIT, Bombay',
    description:
      'Team Confutics secured 2nd place in the Manual South Regional level event at Techfest 2016, IIT, Bombay. The team included Swastik Kumar Nayak, Manas Beura, Ramakanta Das, and Bhagiratha Mohanta.',
  },
  {
    status: '3rd',
    year: '2016',
    title: 'Manual south region zonal 2016',
    location: 'IIT, Bombay',
    description:
      'Team SUSI 1.0 secured 3rd place in the Manual south region zonal 2016 event at IIT, Bombay. The team members were Sourav Mohapatra and Upamanyu Pattnaik.',
  },
  {
    status: '2nd',
    year: '2016',
    title: 'Manual Robotics Event, Advaita 2016',
    location: 'IIIT, Bhubaneshwar',
    description:
      'Team Confutics secured 2nd place in the Manual Robotics Event at Advaita 2016, IIIT, Bhubaneshwar. The team included Swastik Kumar Nayak, Manas Beura, Ramakanta Das, and Bhagiratha Mohanta.',
  },
  {
    status: '1st',
    year: '2016',
    title: 'Autonomous Robotics event Sankalp 2016',
    location: 'NIST, Berhampur',
    description:
      'Team Jarvis secured 1st place in the Autonomous Robotics event at Sankalp 2016, NIST, Berhampur. The team members were Warish Kumar Sahoo, Rohan Kumar, Sethy Swain, and Sambit Parida.',
  },
  {
    status: '2nd',
    year: '2015',
    title: 'Autonomous South Regional Zonal level, Techfest 2016',
    location: 'IIT, Bombay',
    description:
      'Team Jarvis secured 2nd place in the Autonomous South Regional Zonal level event at Techfest 2016, IIT, Bombay. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, and Sushil Swain.',
  },
  {
    status: '1st',
    year: '2015',
    title: 'Manual Robotics Event, Wild Card Round, Techfest 2016',
    location: 'IIT, Bombay',
    description:
      'Team Confutics secured 1st place in the Manual Robotics Event, Wild Card Round at Techfest 2016, IIT, Bombay. The team included Sambit Parida, Swastik Kumar Nayak, Manas Beura, Ramakanta Das, and Bhagiratha Mohanta.',
  },
  {
    status: '3rd',
    year: '2015',
    title: 'Manual Robotics Event, Kshitij 2015',
    location: 'IIT, Kharagpur',
    description:
      'Team Kos secured 3rd place in the Manual Robotics Event at Kshitij 2015, IIT, Kharagpur. The team members were Soumya Prasad Pattanaik, Pawan Sandesh Bara, Abhishek Parida, and Aman Raj Sethy.',
  },
  {
    status: '2nd',
    year: '2015',
    title: 'Manual Robotics Event, Advaita 2015',
    location: 'IIIT, Bhubaneshwar',
    description:
      'Team Kos secured 2nd place in the Manual Robotics Event at Advaita 2015, IIIT, Bhubaneshwar. The team members were Pawan Sandesh Bara and Soumya Prasad Pattanaik.',
  },
  {
    status: '1st',
    year: '2015',
    title: 'Manual Robotics Event, Sankalp 2015',
    location: 'NIST, Berhampur',
    description:
      'Team Autobot secured 1st place in the Manual Robotics Event at Sankalp 2015, NIST, Berhampur. The team included Sameer Ranjan Das, Soumya Sankar Pradhan, Ganesh Chandra Muni, and Biswajeet Mishra.',
  },
  {
    status: '2nd',
    year: '2015',
    title: 'Autonomous Robotics event Sankalp 2015',
    location: 'NIST, Berhampur',
    description:
      'Team Autobot secured 2nd place in the Autonomous Robotics event at Sankalp 2015, NIST, Berhampur. The team members were Sameer Ranjan Das, Soumya Sankar Pradhan, Ganesh Chandra Muni, and Biswajeet Mishra.',
  },
  {
    status: '3rd',
    year: '2015',
    title: 'Autonomous Robotics event, KIIT FEST 2015',
    location: 'KIIT University, Bhubaneshwar',
    description:
      'Team Jarvis secured 3rd place in the Autonomous Robotics event at KIIT FEST 2015. The team members were Warish Kumar Sahoo, Rohan Kumar Sethy, and Sambit Parida.',
  },
  {
    status: '3rd',
    year: '2014',
    title: 'Manual Robotics Event, Zazen 2014',
    location: 'OEC, Bhubaneshwar',
    description:
      'Team Kos secured 3rd place in the Manual Robotics Event at Zazen 2014, OEC, Bhubaneshwar. The team members were Soumya Prasad Pattanaik, Pawan Sandesh Bara, and Aman Raj Sethy.',
  },
  {
    status: '3rd',
    year: '2013',
    title: 'Manual Robotics Event, Zazen 2013',
    location: 'OEC, Bhubaneshwar',
    description:
      'Team Kos secured 3rd place in the Manual Robotics Event at Zazen 2013, OEC, Bhubaneshwar. The team included Soumya Prasad Pattanaik, Pawan Sandesh Bara, Aman Raj Sethy, and Sonam Kumari Patro.',
  },
  {
    status: '2nd',
    year: '2013',
    title: 'Manual Robotics Event, Ignitron 2013',
    location: 'ABIT, Cuttack',
    description:
      'Team Autobot secured 2nd place in the Manual Robotics Event at Ignitron 2013, ABIT, Cuttack. The team included Sameer Ranjan Das, Soumya Sankar Pradhan, Ganesh Chandra Muni, and Biswajeet Mishra.',
  },
  {
    status: '2nd',
    year: '2012',
    title: 'Manual Robotics Event, Xstacy, 2012',
    location: 'CET, Bhubaneshwar',
    description:
      'Team Arjun secured 2nd place in the Manual Robotics Event at Xstacy, 2012, CET, Bhubaneshwar. The team members were Amaresh Gourav, Pratik Panda, and Akash Mishra.',
  },
];

// Helper function to get color classes based on achievement status
const getStatusColors = (status: string) => {
  const statusLower = status.toLowerCase();
  
  // Gold for Winners and 1st place
  if (statusLower.includes('winner') || statusLower === '1st') {
    return {
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-400',
    };
  }
  
  // Silver for 1st Runners up and 2nd place
  if (statusLower.includes('1st runners up') || statusLower === '2nd') {
    return {
      bgColor: 'bg-gray-300',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-400',
    };
  }
  
  // Bronze for 2nd Runners Up and 3rd place
  if (statusLower.includes('2nd runners up') || statusLower === '3rd') {
    return {
      bgColor: 'bg-amber-700',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-600',
    };
  }
  
  // Light pink for Finalists
  if (statusLower.includes('finalist')) {
    return {
      bgColor: 'bg-pink-200',
      textColor: 'text-pink-900',
      borderColor: 'border-pink-300',
    };
  }
  
  // Default white/gray for others
  return {
    bgColor: 'bg-zinc-300',
    textColor: 'text-zinc-700',
    borderColor: 'border-zinc-300',
  };
};

const AchievementsPage = () => {
  const sortedAchievements = [...achievements].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-white mb-4">Our Achievements</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A testament to our dedication, innovation, and excellence in competitive robotics across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAchievements.map((achievement, index) => {
            const StatusIcon = /winner|1st/i.test(achievement.status) ? Trophy : Flag;
            const statusColors = getStatusColors(achievement.status);

            return (
              <article key={`${achievement.title}-${achievement.year}-${index}`} className={`bg-zinc-100 rounded-2xl p-6 flex flex-col gap-4 shadow-none border-2 ${statusColors.borderColor}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`${statusColors.bgColor} px-3 py-1 rounded-full ${statusColors.textColor} text-sm font-medium flex items-center gap-2`}>
                    <StatusIcon className="h-4 w-4" />
                    {achievement.status}
                  </span>
                  <span className="bg-zinc-200 px-3 py-1 rounded-full text-zinc-600 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {achievement.year}
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
      </div>
    </div>
  );
};

export default AchievementsPage;
