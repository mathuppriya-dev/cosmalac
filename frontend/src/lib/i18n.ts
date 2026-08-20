export type Language = 'en' | 'si' | 'ta';

export interface Translations {
  nav: {
    home: string;
    products: string;
    story: string;
    b2b: string;
    faq: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  b2b: {
    title: string;
    subtitle: string;
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    businessType: string;
    orderVolume: string;
    message: string;
    submit: string;
    applyWhatsApp: string;
  };
  common: {
    viewDetails: string;
    directions: string;
    keyActives: string;
    allProducts: string;
    inquireNow: string;
    contactUs: string;
    rightsReserved: string;
    language: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      story: 'Our Story',
      b2b: 'B2B Trade',
      faq: 'FAQ',
      contact: 'Contact'
    },
    hero: {
      badge: 'EST. 2016',
      title: 'Reveal Your Natural',
      highlight: 'Radiance',
      description: 'Formulated with luxury botanicals and proven cosmetic actives for visible clarity and effortless skin harmony.',
      ctaPrimary: 'Explore Formulations',
      ctaSecondary: 'B2B Trade Inquiries'
    },
    b2b: {
      title: 'B2B Trade & Wholesale Distribution',
      subtitle: 'Partner with Cosmalac to bring luxury, skin-friendly brightening cosmetics to your clinics, spas, and retail stores.',
      company: 'Business / Company Name',
      contactPerson: 'Contact Person Name',
      email: 'Corporate Email',
      phone: 'Phone / WhatsApp Number',
      businessType: 'Business Type',
      orderVolume: 'Expected Order Volume',
      message: 'Distribution Inquiry Details',
      submit: 'Submit Trade Application',
      applyWhatsApp: 'Apply Directly via WhatsApp'
    },
    common: {
      viewDetails: 'View Formulation Details',
      directions: 'Directions for Use',
      keyActives: 'Active Ingredients',
      allProducts: 'All Formulations',
      inquireNow: 'Inquire Now',
      contactUs: 'Contact Us',
      rightsReserved: 'All Rights Reserved.',
      language: 'Language'
    }
  },
  si: {
    nav: {
      home: 'මුල් පිටුව',
      products: 'නිෂ්පාදන',
      story: 'අපගේ කතාව',
      b2b: 'තොග වෙළඳාම',
      faq: 'නිතර අසන ප්‍රශ්න',
      contact: 'සම්බන්ධ වන්න'
    },
    hero: {
      badge: 'ආරම්භය 2016',
      title: 'ඔබේ ස්වභාවික',
      highlight: 'පැහැපත් බව',
      description: 'උසස් උද්භිද සාරය සහ විශේෂිත සංයෝග මඟින් සමට නිරෝගී, දීප්තිමත් පැහැයක් සහ ස්වභාවික රැකවරණයක් ලබාදෙයි.',
      ctaPrimary: 'නිෂ්පාදන පෙළ',
      ctaSecondary: 'තොග වෙළඳ විමසීම්'
    },
    b2b: {
      title: 'තොග සහ බෙදාහැරීමේ හවුල්කාරිත්වය',
      subtitle: 'ඔබේ සැලෝන්, ස්පා සහ රූපලාවන්‍යාගාර සඳහා Cosmalac නිෂ්පාදන තොග වශයෙන් ලබාගැනීමට අප හා එක්වන්න.',
      company: 'ආයතනයේ / ව්‍යාපාරයේ නම',
      contactPerson: 'සම්බන්ධීකාරක නම',
      email: 'විද්‍යුත් තැපෑල',
      phone: 'දුරකථන / WhatsApp අංකය',
      businessType: 'ව්‍යාපාර වර්ගය',
      orderVolume: 'ඇස්තමේන්තුගත ප්‍රමාණය',
      message: 'විමසීමේ විස්තර',
      submit: 'අයදුම්පත යොමු කරන්න',
      applyWhatsApp: 'WhatsApp මඟින් ක්ෂණිකව අයදුම් කරන්න'
    },
    common: {
      viewDetails: 'සම්පූර්ණ විස්තර බලන්න',
      directions: 'භාවිතා කරන ආකාරය',
      keyActives: 'ක්‍රියාකාරී අමුද්‍රව්‍ය',
      allProducts: 'සියලුම නිෂ්පාදන',
      inquireNow: 'දැන් විමසන්න',
      contactUs: 'අප අමතන්න',
      rightsReserved: 'සියලු හිමිකම් ඇවිරිණි.',
      language: 'භාෂාව'
    }
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      products: 'தயாரிப்புகள்',
      story: 'எங்கள் கதை',
      b2b: 'மொத்த விற்பனை',
      faq: 'கேள்விகள்',
      contact: 'தொடர்பு'
    },
    hero: {
      badge: 'துவக்கம் 2016',
      title: 'உங்கள் இயற்கையான',
      highlight: 'பிரகாசம்',
      description: 'ஆடம்பர தாவர சாறுகள் மற்றும் நிரூபிக்கப்பட்ட ஒப்பனை கூறுகளுடன் சருமத்திற்கு மென்மையான மற்றும் உடனடி பிரகாசம்.',
      ctaPrimary: 'தயாரிப்புகளைப் பார்க்க',
      ctaSecondary: 'மொத்த விற்பனை'
    },
    b2b: {
      title: 'மொத்த விற்பனை மற்றும் விநியோக கூட்டாண்மை',
      subtitle: 'உங்கள் கிளினிக்குகள் மற்றும் ஸ்பாக்களுக்கு Cosmalac தயாரிப்புகளை கொண்டு சேர்க்க எங்களுடன் இணையுங்கள்.',
      company: 'நிறுவனத்தின் பெயர்',
      contactPerson: 'தொடர்பு நபர் பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி / WhatsApp எண்',
      businessType: 'வணிக வகை',
      orderVolume: 'எதிர்பார்க்கப்படும் அளவு',
      message: 'விசாரணை விவரங்கள்',
      submit: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
      applyWhatsApp: 'WhatsApp மூலம் உடனடியாக விண்ணப்பிக்கவும்'
    },
    common: {
      viewDetails: 'முழு விவரங்கள்',
      directions: 'பயன்படுத்தும் முறை',
      keyActives: 'முக்கிய பொருட்கள்',
      allProducts: 'அனைத்து தயாரிப்புகள்',
      inquireNow: 'விசாரிக்கவும்',
      contactUs: 'எங்களை தொடர்பு கொள்க',
      rightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      language: 'மொழி'
    }
  }
};

export const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem('cosmalac_lang') as Language;
  return saved && ['en', 'si', 'ta'].includes(saved) ? saved : 'en';
};

export const setSavedLanguage = (lang: Language) => {
  localStorage.setItem('cosmalac_lang', lang);
};
