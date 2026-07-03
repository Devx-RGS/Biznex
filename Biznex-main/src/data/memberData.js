export const MEMBERS = [
  { id: '1',  name: 'Rajesh Kumar',   designation: 'Founder & CEO',       business: 'Nexus Solutions',       category: 'IT & Technology',      location: 'Mumbai',    chapter: 'Andheri',    offer: 'Custom software development, ERP systems and cloud migration.',           keywords: ['software','erp','cloud','development','tech'] },
  { id: '2',  name: 'Anjali Singh',   designation: 'Owner',                business: 'FoodCraft Co.',          category: 'Food & Manufacturing',  location: 'Mumbai',    chapter: 'Kandivali',  offer: 'Premium catering, tiffin services and packaged organic food.',             keywords: ['food','catering','tiffin','organic'] },
  { id: '3',  name: 'Vikram Joshi',   designation: 'Director',             business: 'ProServ Inc.',           category: 'Services',              location: 'Mumbai',    chapter: 'Thane',      offer: 'HR consulting, staffing solutions and payroll management.',               keywords: ['hr','staffing','payroll','consulting'] },
  { id: '4',  name: 'Meera Kapoor',   designation: 'Co-Founder',           business: 'InnovateLab',            category: 'New Innovations',       location: 'Mumbai',    chapter: 'Borivali',   offer: 'Startup incubation, product design and innovation consulting.',           keywords: ['startup','innovation','product','design'] },
  { id: '5',  name: 'Sameer Patel',   designation: 'MD',                   business: 'DataBridge Tech',        category: 'IT & Technology',      location: 'Mumbai',    chapter: 'Dadar',      offer: 'Data analytics, business intelligence and AI/ML solutions.',              keywords: ['data','analytics','ai','ml','bi'] },
  { id: '6',  name: 'Rekha Iyer',     designation: 'Chartered Accountant', business: 'Iyer & Associates',     category: 'Services',              location: 'Mumbai',    chapter: 'Andheri',    offer: 'Tax planning, audit, GST filing and financial advisory.',                  keywords: ['ca','tax','gst','audit','accounting','chartered accountant'] },
  { id: '7',  name: 'Arun Sharma',    designation: 'Owner',                business: 'Sharma Foods Pvt Ltd',  category: 'Food & Manufacturing',  location: 'Pune',      chapter: 'Whole City', offer: 'Bulk food supply, contract manufacturing and private labelling.',          keywords: ['food','manufacturing','supply','label'] },
  { id: '8',  name: 'Kavitha Nair',   designation: 'CEO',                  business: 'DigitalEdge Solutions',  category: 'IT & Technology',      location: 'Bangalore', chapter: 'Whole City', offer: 'Web design, digital marketing, SEO and social media management.',          keywords: ['web','design','digital','seo','marketing','web design'] },
  { id: '9',  name: 'Rohit Malhotra', designation: 'Co-Founder',           business: 'GreenTech India',        category: 'New Innovations',       location: 'Delhi',     chapter: 'Whole City', offer: 'Renewable energy solutions, solar installations and green consulting.',    keywords: ['solar','green','energy','renewable'] },
  { id: '10', name: 'Deepa Mehta',    designation: 'Partner',              business: 'LegalEase LLP',          category: 'Services',              location: 'Mumbai',    chapter: 'Kandivali',  offer: 'Legal advisory, contract drafting, IPR and company registration.',         keywords: ['legal','lawyer','contract','ipr','company'] },
  { id: '11', name: 'Suresh Gupta',   designation: 'Proprietor',           business: 'Gupta Textiles',         category: 'Others',                location: 'Mumbai',    chapter: 'Thane',      offer: 'Wholesale textile supply, fabric sourcing and garment manufacturing.',     keywords: ['textile','fabric','garment','wholesale'] },
  { id: '12', name: 'Preethi Rao',    designation: 'Director',             business: 'MedPlus Diagnostics',    category: 'Services',              location: 'Hyderabad', chapter: 'Whole City', offer: 'Diagnostic services, health packages and corporate wellness programs.',     keywords: ['health','medical','diagnostics','wellness'] },
];

// Avatars mapped by initials
const INITIALS_MAP = {
  'RK': { i: 'RK', c: '#1abc9c' }, 'AS': { i: 'AS', c: '#e74c3c' }, 'VJ': { i: 'VJ', c: '#3498db' },
  'MK': { i: 'MK', c: '#9b59b6' }, 'SP': { i: 'SP', c: '#e67e22' }, 'RI': { i: 'RI', c: '#27ae60' },
  'AR': { i: 'AR', c: '#8e44ad' }, 'KN': { i: 'KN', c: '#2980b9' }, 'RM': { i: 'RM', c: '#c0392b' },
  'DM': { i: 'DM', c: '#16a085' }, 'SG': { i: 'SG', c: '#d35400' }, 'PR': { i: 'PR', c: '#6c3483' },
};
const COLORS = ['#1abc9c','#e74c3c','#3498db','#9b59b6','#e67e22','#27ae60','#8e44ad','#2980b9','#c0392b','#16a085','#d35400','#6c3483'];
MEMBERS.forEach((m, i) => {
  const key = m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  m.initials = key;
  m.color = INITIALS_MAP[key]?.c || COLORS[i % COLORS.length];
});

export const FILTER_OPTIONS = {
  location: ['Mumbai','Pune','Delhi','Bangalore','Hyderabad'],
  category: ['IT & Technology','Food & Manufacturing','Services','New Innovations','Others'],
  chapter:  ['Kandivali','Borivali','Andheri','Thane','Dadar','Whole City'],
  service:  ['Web Design','Accounting / GST','Digital Marketing','Food Supply','IT Consulting','Manufacturing','Legal Services','Real Estate'],
};
