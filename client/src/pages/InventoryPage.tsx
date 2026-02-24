import { useMemo, useState } from 'react';
import { Search, FileText, Plus, Package, ShoppingCart, X, Trash2, Mail, User, Phone, FileCheck, CheckCircle } from 'lucide-react';

interface ComponentItem {
  _id: string;
  name: string;
  category: string;
  totalStock: number;
  availableStock: number;
  stockStatus?: string;
  image?: string;
  description?: string;
  datasheet?: string;
}

interface CartItem extends ComponentItem {
  quantity: number;
}

interface CheckoutFormData {
  name: string;
  clubRegNo: string;
  phoneNumber: string;
  email: string;
  purposeOfIssue: string;
  returnDate: string;
  verificationChecked: boolean;
  termsChecked: boolean;
}

const catalog: ComponentItem[] = [
  { _id: 'c1', category: 'Microcontrollers', name: 'Seeed Studio XIAO ESP32C6', availableStock: 1, totalStock: 1, description: 'Ultra-small development board powered by ESP32-C6 SoC, supporting Wi-Fi 6, Bluetooth 5.3, Zigbee, and Matter. Features RISC-V 32-bit processor.', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRHdZQG4YebdytWDA8Ohg6HMTuR0k705iRSbQkbfuN304N4DxwYVYr2TZJAM6tnvxBT7ehEGBjKMsV1Wm6SshNsby8o6qh8ohJ2B9wVgwwJnTtNG0SOA6PYRA', datasheet: '#' },
  { _id: 'c2', category: 'Drone Parts', name: 'Pro-Range-B2212-920KV CW Brushless Drone Motor', availableStock: 4, totalStock: 4, description: '920KV brushless DC motor for drones (Clockwise). Compatible with 2-4S LiPo batteries, providing up to 980g thrust. Standard 2212 size.', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTJjlTtzBXXzYfrpzssKCc-idc9x21KRKEeExJkWC13YExVGkIEJHp_nITkPnSBXZl5KmbRDHI-AaQI3KB07B-hul4SUJ0-lhc2nWfIlqgQ', datasheet: '#' },
  { _id: 'c3', category: 'Drone Parts', name: 'Pro-Range-B2212-920KV CCW Brushless Drone Motor', availableStock: 4, totalStock: 4, description: '920KV brushless DC motor for drones (Counter-Clockwise). Compatible with 2-4S LiPo batteries. Standard 2212 size.', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTJjlTtzBXXzYfrpzssKCc-idc9x21KRKEeExJkWC13YExVGkIEJHp_nITkPnSBXZl5KmbRDHI-AaQI3KB07B-hul4SUJ0-lhc2nWfIlqgQ', datasheet: '#' },
  { _id: 'c4', category: 'Robotics & Modules', name: 'SmartElex Dual Channel Battle Relay', availableStock: 1, totalStock: 1, description: 'Dual channel relay module controllable via RC receiver PWM signals. Max current 10A @ 240VAC. Ideal for combat robots.', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTybFW-nHE5saCUcfnKH_YEUrPGYT05cHFGxD8wdzAGglVu-9JjekURMSZ_xdEx_4Ye0D2iKnglKAt17fn7xyLUgNbkCTkL0_4nDZZnAneYIMuN-BL-7zzWQQ', datasheet: '#' },
  { _id: 'c5', category: 'Cables & Connectors', name: '10CM Female to Female Breadboard Jumper DuPont Cable 40 Pcs', availableStock: 2, totalStock: 2, description: 'Standard 10cm DuPont jumper wires (Female-to-Female) for prototyping and breadboard connections. 40 pieces per pack.', image: 'https://5.imimg.com/data5/HO/VE/DT/SELLER-87648498/10cm-female-to-female-breadboard-jumper-dupont-2-54mm-1p-1p-cable-40-pcs-1000x1000.JPG', datasheet: '#' },
  { _id: 'c6', category: 'Cables & Connectors', name: 'Male To Female Jumper Wires 40 Pcs 10cm', availableStock: 2, totalStock: 2, description: 'Standard 10cm DuPont jumper wires (Male-to-Female) for prototyping. 40 pieces per pack.', image: 'http://5.imimg.com/data5/SELLER/Default/2023/7/321557276/WU/JX/GW/66278010/male-to-female-jumper-wires-1000x1000.png', datasheet: '#' },
  { _id: 'c7', category: 'Cables & Connectors', name: 'Male To Male Jumper Wires 40 Pcs 10cm', availableStock: 2, totalStock: 2, description: 'Standard 10cm DuPont jumper wires (Male-to-Male) for prototyping. 40 pieces per pack.', image: 'http://5.imimg.com/data5/AE/VR/MY-66278010/male-to-male-jumper-wires-500x500.jpg', datasheet: '#' },
  { _id: 'c8', category: 'Mechanical', name: 'EasyMech M3 X 6mm CHHD Bolt and Nut Set-25 pcs', availableStock: 2, totalStock: 2, description: 'High-quality M3 x 6mm Cylinder Head Hex Drive (CHHD) bolts and nuts. Pack of 25.', image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/425541542/QW/OO/LE/114300096/tantalum-nut-bolts-3-250x250.jpg', datasheet: '#' },
  { _id: 'c9', category: 'Cables & Connectors', name: 'SafeConnect XT-60 Connector Harness for Series Connection', availableStock: 2, totalStock: 2, description: 'Series connection adapter cable with XT-60 connectors (2 Male to 1 Female). Used to connect two batteries in series to increase voltage.', image: 'https://5.imimg.com/data5/SELLER/Default/2020/8/SP/MH/BT/63483094/sh010010-1-250x250.jpg', datasheet: '#' },
  { _id: 'c10', category: 'Cables & Connectors', name: 'Amass XT60U Female Connector', availableStock: 6, totalStock: 6, description: 'Genuine Amass XT60U Female connector (Yellow). High-current power connector for RC batteries.', image: 'https://5.imimg.com/data5/ANDROID/Default/2023/8/332528817/BH/BD/GL/191892490/product-jpeg-250x250.jpeg', datasheet: '#' },
  { _id: 'c11', category: 'Cables & Connectors', name: 'Amass XT60PB30 Male Connector', availableStock: 6, totalStock: 6, description: 'Amass XT60PB PCB-mount Male connector. Designed for direct soldering to printed circuit boards.', image: 'https://5.imimg.com/data5/ANDROID/Default/2023/8/332528628/QK/ME/VP/191892490/product-jpeg-250x250.jpeg', datasheet: '#' },
  { _id: 'c12', category: 'Cables & Connectors', name: 'Cable For Arduino UNO/MEGA (USB A to B)', availableStock: 5, totalStock: 5, description: 'Standard USB 2.0 Type A to Type B cable (50cm). Compatible with Arduino UNO and MEGA boards.', image: 'https://5.imimg.com/data5/SELLER/Default/2025/8/534699179/UW/LS/EE/66278010/usb-a-to-b-cable-for-arduino-high-quality-40cm-250x250.png' },
  { _id: 'c13', category: 'Microcontrollers', name: 'Uno R3 Board without Cable compatible with Arduino', availableStock: 5, totalStock: 5, description: 'Arduino Uno R3 compatible development board based on the ATmega328P microcontroller.', image: 'https://5.imimg.com/data5/SELLER/Default/2023/10/350517211/SM/IS/MI/104267027/a000066-featured-4-250x250.jpg', datasheet: '#' },
  { _id: 'c14', category: 'Sensors', name: 'HC-SR04 Ultrasonic Range Finder', availableStock: 5, totalStock: 5, description: 'Ultrasonic distance sensor capable of measuring 2cm to 400cm.', image: 'http://5.imimg.com/data5/SELLER/Default/2022/4/SI/MH/BP/6743193/hc-sr04-ultrasonic-sensor-500x500.jpg', datasheet: '#' },
  { _id: 'c15', category: 'Sensors', name: 'DHT11 Temperature And Humidity Sensor Module', availableStock: 5, totalStock: 5, description: 'Basic digital temperature and humidity sensor module with LED indicator.', image: '', datasheet: '#' },
  { _id: 'c16', category: 'Sensors', name: 'TTP223 Touch Key Module', availableStock: 3, totalStock: 3, description: 'Capacitive touch sensor module based on the TTP223 touch detector IC.', image: '', datasheet: '#' },
  { _id: 'c17', category: 'Sensors', name: 'Infrared Obstacle Avoidance Sensor Module', availableStock: 5, totalStock: 5, description: 'IR reflection sensor for obstacle avoidance, suitable for robots.', image: '', datasheet: '#' },
  { _id: 'c18', category: 'Sensors', name: 'Soil Moisture Meter / Soil Humidity Sensor', availableStock: 5, totalStock: 5, description: 'Resistive soil moisture sensor with comparator module for digital and analog output.', image: '', datasheet: '#' },
  { _id: 'c19', category: 'Sensors', name: 'PIR Motion Sensor Detector Module HC-SR501', availableStock: 5, totalStock: 5, description: 'Passive Infrared (PIR) motion sensor module for detecting human movement.', image: '', datasheet: '#' },
  { _id: 'c20', category: 'Displays', name: '0.96 inch Yellow-Blue OLED Display Module', availableStock: 5, totalStock: 5, description: '128x64 pixel OLED display, I2C interface, SSD1306 driver, Yellow/Blue color section.', image: '', datasheet: '#' },
  { _id: 'c21', category: 'Robotics & Modules', name: 'Motor Driver TB6612FNG Module', availableStock: 5, totalStock: 5, description: 'Dual DC motor driver module, more efficient than L298N. Continuous current 1.2A per channel.', image: '', datasheet: '#' },
  { _id: 'c22', category: 'Motors & Mechanical', name: 'Pro-Range 12V 300 RPM Johnson Geared DC Motor', availableStock: 6, totalStock: 6, description: 'High-torque Johnson geared DC motor, Grade A quality. 300 RPM at 12V.', image: '', datasheet: '#' },
  { _id: 'c23', category: 'Motors & Mechanical', name: 'Pro-Range OG555 High Torque DC Motor 12V 300RPM', availableStock: 4, totalStock: 4, description: 'Orange series 555 geared motor. 12V 300RPM with high torque (42.6 N-cm). Encoder compatible.', image: '', datasheet: '#' },
  { _id: 'c24', category: 'Motors & Mechanical', name: 'TowerPro MG90S Mini Digital Servo Motor', availableStock: 5, totalStock: 5, description: 'Metal gear micro servo motor, 180-degree rotation. Higher torque than SG90.', image: '', datasheet: '#' },
  { _id: 'c25', category: 'Motors & Mechanical', name: 'TowerPro SG90 Servo Motor', availableStock: 10, totalStock: 10, description: 'Standard micro servo motor (9g), 180-degree rotation. Plastic gears.', image: '', datasheet: '#' },
  { _id: 'c26', category: 'Tools', name: 'Solder DeSoldering Wire (wick)', availableStock: 5, totalStock: 5, description: 'Copper braid for desoldering components and removing excess solder.', image: '' },
  { _id: 'c27', category: 'Tools', name: 'Atten TR-045 Rosin Flux (45g)', availableStock: 8, totalStock: 8, description: 'High-quality Rosin flux paste for soldering.', image: '' },
  { _id: 'c28', category: 'Tools', name: 'Black and Decker 2 Speed Heat Gun 1800W', availableStock: 1, totalStock: 1, description: '1800W Heat Gun with 2 speed/temperature settings. Model KX1800.', image: '', datasheet: '#' },
  { _id: 'c29', category: 'Robotics & Modules', name: 'Laser Module 650NM 5V', availableStock: 5, totalStock: 5, description: 'Red dot laser diode module, 650nm wavelength, 5V operation.', image: '', datasheet: '#' },
  { _id: 'c30', category: 'Tools', name: 'Multitec 150b Wire Stripper and Cutter', availableStock: 1, totalStock: 1, description: 'Hand tool for stripping insulation from wires and cutting cables.', image: '' },
  { _id: 'c31', category: 'Tools', name: 'Bosch High Quality 13 Pcs HSS Drill Bits', availableStock: 1, totalStock: 1, description: 'Set of 13 High Speed Steel (HSS) drill bits by Bosch.', image: '' },
  { _id: 'c32', category: 'Batteries & Power', name: 'Mini MP1584 DC-DC 3A Adjustable Buck Module', availableStock: 5, totalStock: 5, description: 'Ultra-small adjustable step-down (buck) voltage regulator module. Max 3A output.', image: '', datasheet: '#' },
  { _id: 'c33', category: 'Batteries & Power', name: 'TP4056 1A Li-ion Battery Charging Module Type C', availableStock: 5, totalStock: 5, description: 'Lithium battery charger module with protection, USB Type-C input. 1A charging current.', image: '', datasheet: '#' },
  { _id: 'c34', category: 'Tools', name: 'Heat Shrink Sleeve 3mm Transparent', availableStock: 2, totalStock: 2, description: 'Industrial grade heat shrink tubing, 3mm diameter, transparent.', image: '' },
  { _id: 'c35', category: 'Drone Parts', name: 'S500 Carbon Fiber Quadcopter Drone Frame Kit', availableStock: 1, totalStock: 1, description: '500mm wheelbase quadcopter frame with carbon fiber landing gear. Integrated PCB for power distribution.', image: '', datasheet: '#' },
  { _id: 'c36', category: 'Drone Parts', name: 'RunCam 5-4K Portable FPV Action Camera', availableStock: 1, totalStock: 1, description: '4K FPV Action Camera featuring Sony IMX377 12MP sensor. Records 4K@30fps, 1080p@120fps. Lightweight (56g).', image: '', datasheet: '#' },
  { _id: 'c37', category: 'Drone Parts', name: '5.8G 2.8dBi RHCP RPSMA Lollipop Antenna (Long)', availableStock: 8, totalStock: 8, description: '5.8GHz FPV antenna, RHCP polarization, RP-SMA connector. Lollipop design for durability.', image: '', datasheet: '#' },
  { _id: 'c38', category: 'Drone Parts', name: 'Pro-Range Propellers 5152 Tri Blade Flash 2CW+2CCW', availableStock: 2, totalStock: 2, description: '5.1x5.2 inch tri-blade propellers (Flash series). 2 CW and 2 CCW per pack. Orange color.', image: '' },
  { _id: 'c39', category: 'Drone Parts', name: 'ReadytoSky 30A 2-6S ESC Banana connector', availableStock: 10, totalStock: 10, description: '30A Electronic Speed Controller (ESC) supporting 2-6S LiPo. Pre-soldered banana connectors.', image: '', datasheet: '#' },
  { _id: 'c40', category: 'Drone Parts', name: 'Pro-Range Propellers 1045 ABS Black 1CW+1CCW', availableStock: 10, totalStock: 10, description: '10x4.5 inch ABS propellers. 1 Clockwise and 1 Counter-Clockwise per pack.', image: '' },
  { _id: 'c41', category: 'Drone Parts', name: 'Original HobbyWing QuicRun 1060 60A Brushed ESC', availableStock: 2, totalStock: 2, description: 'Waterproof 60A brushed motor ESC. Supports 2-3S LiPo or 5-9 NiMH. Built-in 3A/5V BEC.', image: '', datasheet: '#' },
  { _id: 'c42', category: 'Drone Parts', name: 'RadioMaster 2.4GHz RM 4IN1 Module', availableStock: 1, totalStock: 1, description: 'Multi-protocol TX module with CC2500, NRF24L01, A7105, and CYRF6936 chips. Supports 70+ protocols.', image: '', datasheet: '#' },
  { _id: 'c43', category: 'Motors & Mechanical', name: 'N20-6V-600 Rpm Micro Metal Gear Motor', availableStock: 8, totalStock: 8, description: 'Micro metal gear motor (N20 size). 6V, 600 RPM.', image: '', datasheet: '#' },
  { _id: 'c44', category: 'Batteries & Power', name: 'Bonka 11.1V 5200mAh 35C 3S Lithium Polymer Battery', availableStock: 1, totalStock: 1, description: '3S LiPo battery with 5200mAh capacity and 35C discharge rate.', image: '', datasheet: '#' },
  { _id: 'c45', category: 'Batteries & Power', name: 'Bonka 7.4V 1500mAh 25C 2S Lithium Polymer Battery', availableStock: 1, totalStock: 1, description: '2S LiPo battery with 1500mAh capacity and 25C discharge rate.', image: '', datasheet: '#' },
  { _id: 'c46', category: 'Motors & Mechanical', name: 'Mounting Bracket for N20 Micro Gear motors', availableStock: 10, totalStock: 10, description: 'Plastic mounting bracket designed for N20 micro gear motors. 2 pieces per pack.', image: '' },
  { _id: 'c47', category: 'Drone Parts', name: '20cm Lipo Battery Strap Belt Reusable Cable Tie', availableStock: 3, totalStock: 3, description: 'Reusable velcro strap for securing LiPo batteries to drone frames. 20cm length.', image: '' },
  { _id: 'c48', category: 'Drone Parts', name: 'Universal Folding GPS Stand / Holder', availableStock: 2, totalStock: 2, description: 'Foldable mount stand for GPS modules on drones.', image: '' },
  { _id: 'c49', category: 'Drone Parts', name: 'Radiolink TS100 V2.0 GPS', availableStock: 1, totalStock: 1, description: 'Mini M8N GPS module with 50cm position accuracy. Features u-blox M8030 chip and QMC5883L compass.', image: '', datasheet: '#' },
  { _id: 'c50', category: 'Drone Parts', name: 'Radiolink CrossFlight Flight Controller', availableStock: 1, totalStock: 1, description: 'Compact flight controller with HC32F4A0PITB processor and ICM42670 gyro. Software vibration damping.', image: '', datasheet: '#' },
  { _id: 'c51', category: 'Motors & Mechanical', name: 'Pro-Range MG555 12V 480RPM Square Gearbox DC motor', availableStock: 2, totalStock: 2, description: 'Square gearbox DC motor, 12V 480RPM. High torque with encoder compatibility.', image: '', datasheet: '#' },
  { _id: 'c52', category: 'Robotics & Modules', name: 'Double BTS7960 43A H-Bridge Motor Driver Module', availableStock: 2, totalStock: 2, description: 'High-power H-Bridge motor driver capable of 43A. Uses Infineon BTS7960 chips.', image: '', datasheet: '#' },
];

const InventoryPage = () => {
  const [components] = useState<ComponentItem[]>(catalog);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedCart, setSubmittedCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    clubRegNo: '',
    phoneNumber: '',
    email: '',
    purposeOfIssue: '',
    returnDate: '',
    verificationChecked: false,
    termsChecked: false,
  });

  const categories = useMemo(() => ['All', ...new Set(components.map((item) => item.category))], [components]);

  const filteredComponents = useMemo(() => {
    return components.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filter === 'All' || item.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, filter]);

  const addToCart = (component: ComponentItem) => {
    if (component.stockStatus === 'Club Use Only') return;

    setCart((prev) => {
      const existing = prev.find((entry) => entry._id === component._id);
      if (existing) {
        if (existing.quantity + 1 > component.availableStock) return prev;
        return prev.map((entry) =>
          entry._id === component._id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      if (component.availableStock <= 0) return prev;
      return [...prev, { ...component, quantity: 1 }];
    });
  };

  const removeFromCart = (componentId: string) => {
    setCart((prev) => prev.filter((entry) => entry._id !== componentId));
  };

  const updateQuantity = (componentId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(componentId);
      return;
    }
    setCart((prev) =>
      prev.map((entry) =>
        entry._id === componentId ? { ...entry, quantity: Math.min(newQuantity, entry.availableStock) } : entry
      )
    );
  };

  const handleFormChange = (field: keyof CheckoutFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = () => {
    if (!formData.name || !formData.clubRegNo || !formData.phoneNumber || !formData.email || !formData.purposeOfIssue || !formData.returnDate) {
      alert('Please fill in all required fields');
      return;
    }
    if (!formData.verificationChecked || !formData.termsChecked) {
      alert('Please agree to verification and terms & conditions');
      return;
    }
    console.log('Checkout Data:', { cart, formData });
    
    // Save submitted cart items and show success modal
    setSubmittedCart([...cart]);
    setShowCheckout(false);
    setShowSuccess(true);
    
    // Reset cart and form after showing success
    setTimeout(() => {
      setCart([]);
      setFormData({
        name: '',
        clubRegNo: '',
        phoneNumber: '',
        email: '',
        purposeOfIssue: '',
        returnDate: '',
        verificationChecked: false,
        termsChecked: false,
      });
    }, 500);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#0a0f18] text-white pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
            Component Library
          </h1>
          <p className="text-gray-400">Add components to your cart and issue them in one go.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full bg-[#111827] border border-gray-800 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              className="w-full bg-[#111827] border border-gray-800 rounded-full px-6 py-3 focus:outline-none focus:border-blue-500 text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredComponents.length === 0 ? (
          <div className="text-center text-gray-400 py-16">No components found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredComponents.map((item) => {
              const inCart = cart.find((entry) => entry._id === item._id);
              const cartQty = inCart ? inCart.quantity : 0;
              const isClubUse = item.stockStatus === 'Club Use Only';
              const isAvailable = !isClubUse && item.availableStock > 0;

              let badgeClass = 'bg-red-900/80 text-red-300 border-red-500/50';
              let badgeText = 'Out of Stock';

              if (isClubUse) {
                badgeClass = 'bg-yellow-900/80 text-yellow-300 border-yellow-500/50';
                badgeText = 'Club Use Only';
              } else if (isAvailable) {
                badgeClass = 'bg-green-900/80 text-green-400 border-green-500/60';
                badgeText = `${item.availableStock} of ${item.totalStock} Available`;
              }

              return (
                <article
                  key={item._id}
                  className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800 flex flex-col transition hover:scale-[1.02] hover:border-white/30"
                >
                  <div className="bg-white p-4 relative">
                    <div className="aspect-square flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain image-pop" loading="lazy" />
                      ) : (
                        <Package className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full border ${badgeClass}`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-blue-500 text-[10px] uppercase font-bold tracking-widest">{item.category}</p>
                    <h2 className="text-white font-semibold text-lg leading-snug line-clamp-2">{item.name}</h2>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {item.description || 'No description available.'}
                    </p>

                    <div className="mt-auto">
                      {item.datasheet ? (
                        <a
                          href={item.datasheet}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-gray-500 text-[10px] hover:text-white transition"
                        >
                          <FileText className="h-3 w-3" />
                          Datasheet
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-600 text-[10px]">
                          <FileText className="h-3 w-3" />
                          Datasheet unavailable
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={!isAvailable || cartQty >= item.availableStock}
                        className="w-full mt-3 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add to Cart{cartQty > 0 ? ` (${cartQty})` : ''}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCheckout(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 font-bold transition-all transform hover:scale-110"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-lg">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141D] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Header */}
            <div className="sticky top-0 bg-[#12141D] border-b border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Checkout</h2>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Section 1: Requested Components */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Requested Components</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id} className="bg-[#111827] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-600 rounded-lg bg-[#0a0f18]">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-400 hover:text-white transition"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-white font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-400 hover:text-white transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Student Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Student Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Club Reg No. *</label>
                    <div className="relative">
                      <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.clubRegNo}
                        onChange={(e) => handleFormChange('clubRegNo', e.target.value)}
                        placeholder="Registration No."
                        className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                        placeholder="10-digit number"
                        className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Purpose & Return Date */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Purpose of Issue *</label>
                <textarea
                  value={formData.purposeOfIssue}
                  onChange={(e) => handleFormChange('purposeOfIssue', e.target.value)}
                  placeholder="Describe the purpose for issuing these components..."
                  rows={4}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Return Date *</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleFormChange('returnDate', e.target.value)}
                  className="w-full bg-[#111827] border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Section 4: Verification & Terms */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-[#111827] p-2 rounded-lg transition">
                  <input
                    type="checkbox"
                    checked={formData.verificationChecked}
                    onChange={(e) => handleFormChange('verificationChecked', e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-gray-300">I verify that the above information is correct</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:bg-[#111827] p-2 rounded-lg transition">
                  <input
                    type="checkbox"
                    checked={formData.termsChecked}
                    onChange={(e) => handleFormChange('termsChecked', e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-600"
                  />
                  <span className="text-gray-300">I agree to the Terms & Conditions and return policy</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-gray-700 pt-6">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Complete Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141D] rounded-2xl w-full max-w-2xl border border-gray-700">
            {/* Header */}
            <div className="bg-[#12141D] border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Checkout</h2>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Requested Item Card */}
              {submittedCart.length > 0 && (
                <div className="border border-gray-700 rounded-lg p-6 bg-[#111827]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">{submittedCart[0].name}</h3>
                      <p className="text-gray-400 text-sm">ID: {submittedCart[0]._id}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmittedCart((prev) => prev.filter((_, i) => i !== 0));
                      }}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mt-4 border-t border-gray-600 pt-4">
                    <span className="text-gray-400 text-sm">Quantity:</span>
                    <div className="flex items-center border border-gray-600 rounded-lg bg-[#0a0f18]">
                      <button className="px-3 py-1 text-gray-400 hover:text-white transition">−</button>
                      <span className="px-3 py-1 text-white font-semibold min-w-[2rem] text-center">{submittedCart[0].quantity}</span>
                      <button className="px-3 py-1 text-gray-400 hover:text-white transition">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message Section */}
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-green-500 mb-2">Request Submitted!</h3>
                <p className="text-gray-300 text-center text-lg">Visit the club to collect your items.</p>
              </div>

              {/* Close Button */}
              <div className="flex gap-4 border-t border-gray-700 pt-6">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
