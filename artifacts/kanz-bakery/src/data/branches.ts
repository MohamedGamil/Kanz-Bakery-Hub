export interface BranchHours {
  daysEn: string;
  daysAr: string;
  hoursEn: string;
  hoursAr: string;
}

export interface Branch {
  id: number;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  hours: BranchHours[];
  servicesEn: string[];
  servicesAr: string[];
}

export const branches: Branch[] = [
  {
    id: 1,
    nameEn: 'Al Nakheel Branch',
    nameAr: 'فرع النخيل',
    addressEn: 'Nakheel Mall, Northern Ring Road, Al Nakheel, Riyadh 13312',
    addressAr: 'نخيل مول، طريق الدائري الشمالي، حي النخيل، الرياض ١٣٣١٢',
    lat: 24.7558,
    lng: 46.6547,
    phone: '+966 11 234 5678',
    email: 'nakheel@kanzbakery.com',
    hours: [
      {
        daysEn: 'Sat – Thu',
        daysAr: 'السبت – الخميس',
        hoursEn: '8:00 AM – 10:00 PM',
        hoursAr: '٨:٠٠ ص – ١٠:٠٠ م',
      },
      {
        daysEn: 'Friday',
        daysAr: 'الجمعة',
        hoursEn: '2:00 PM – 10:00 PM',
        hoursAr: '٢:٠٠ م – ١٠:٠٠ م',
      },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery', 'Catering Orders'],
    servicesAr: ['تناول في المكان', 'استلام شخصي', 'توصيل', 'طلبات التموين'],
  },
  {
    id: 2,
    nameEn: 'Al Olaya Branch',
    nameAr: 'فرع العليا',
    addressEn: 'Olaya Street, Al Olaya District, Riyadh 12211',
    addressAr: 'شارع العليا، حي العليا، الرياض ١٢٢١١',
    lat: 24.6877,
    lng: 46.6822,
    phone: '+966 11 234 5679',
    email: 'olaya@kanzbakery.com',
    hours: [
      {
        daysEn: 'Sat – Thu',
        daysAr: 'السبت – الخميس',
        hoursEn: '7:00 AM – 10:00 PM',
        hoursAr: '٧:٠٠ ص – ١٠:٠٠ م',
      },
      {
        daysEn: 'Friday',
        daysAr: 'الجمعة',
        hoursEn: '2:00 PM – 10:00 PM',
        hoursAr: '٢:٠٠ م – ١٠:٠٠ م',
      },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery', 'Catering Orders', 'Custom Cakes'],
    servicesAr: [
      'تناول في المكان',
      'استلام شخصي',
      'توصيل',
      'طلبات التموين',
      'كعكات مخصصة',
    ],
  },
  {
    id: 3,
    nameEn: 'Hittin Branch',
    nameAr: 'فرع حطين',
    addressEn: 'King Abdullah Road, Hittin District, Riyadh 13516',
    addressAr: 'طريق الملك عبدالله، حي حطين، الرياض ١٣٥١٦',
    lat: 24.742,
    lng: 46.588,
    phone: '+966 11 234 5680',
    email: 'hittin@kanzbakery.com',
    hours: [
      {
        daysEn: 'Sat – Thu',
        daysAr: 'السبت – الخميس',
        hoursEn: '8:00 AM – 9:00 PM',
        hoursAr: '٨:٠٠ ص – ٩:٠٠ م',
      },
      {
        daysEn: 'Friday',
        daysAr: 'الجمعة',
        hoursEn: '2:00 PM – 9:00 PM',
        hoursAr: '٢:٠٠ م – ٩:٠٠ م',
      },
    ],
    servicesEn: ['Dine In', 'Takeaway', 'Delivery'],
    servicesAr: ['تناول في المكان', 'استلام شخصي', 'توصيل'],
  },
];
