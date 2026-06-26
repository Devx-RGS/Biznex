export const PROFILE_FIELDS = [
  'fullName',
  'businessName',
  'designation',
  'category',
  'city',
  'chapter',
  'whatsApp',
  'email',
  'profilePhoto',
  'companyLogo',
  'website',
  'offer',
  'lookingFor',
  'keywords',
  'aboutBusiness'
];

export const FIELD_LABELS = {
  fullName: 'Full Name',
  businessName: 'Business Name',
  designation: 'Designation',
  category: 'Business Category',
  city: 'City',
  chapter: 'Chapter',
  whatsApp: 'WhatsApp Number',
  email: 'Email Address',
  profilePhoto: 'Profile Photo',
  companyLogo: 'Company Logo',
  website: 'Website',
  offer: 'Offer Details',
  lookingFor: 'Looking For',
  keywords: 'Keywords',
  aboutBusiness: 'About Business',
};

export const DEFAULT_DISPLAY_PROFILE = {
  fullName: 'Yash Oswal',
  initials: 'YO',
  avatarColor: '#C9A84C', // colors.accent fallback
  chapter: 'Kandivali',
  membershipStatus: 'Active Member',
  profileViews: 248,
  directoryAppearances: 512,
};

/**
 * Calculates the profile completion percentage.
 * Matches the logic in PerformanceScreen.
 * @param {object} p User profile object
 * @returns {number} Completion percentage (0 to 100)
 */
export const calculateProfileCompletion = (p) => {
  const data = p || DEFAULT_DISPLAY_PROFILE;
  let completed = 0;
  
  PROFILE_FIELDS.forEach(field => {
    if (field === 'keywords') {
      if (Array.isArray(data.keywords) && data.keywords.length > 0) {
        completed++;
      }
    } else if (data[field] && typeof data[field] === 'string' && data[field].trim() !== '') {
      completed++;
    } else if (data[field] && typeof data[field] !== 'string') {
      completed++;
    }
  });

  return Math.round((completed / PROFILE_FIELDS.length) * 100);
};

/**
 * Identifies the empty/missing profile fields.
 * @param {object} p User profile object
 * @returns {string[]} List of human-readable labels of missing fields
 */
export const getMissingFields = (p) => {
  const data = p || DEFAULT_DISPLAY_PROFILE;
  const missing = [];

  PROFILE_FIELDS.forEach(field => {
    let isEmpty = false;
    if (field === 'keywords') {
      if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
        isEmpty = true;
      }
    } else if (typeof data[field] === 'string') {
      if (!data[field] || data[field].trim() === '') {
        isEmpty = true;
      }
    } else {
      if (!data[field]) {
        isEmpty = true;
      }
    }

    if (isEmpty) {
      missing.push(FIELD_LABELS[field] || field);
    }
  });

  return missing;
};
