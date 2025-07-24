import onboard1 from '../assets/alli_question.png';

export const onboardingQuestions = [
  {
    id: 1,
    question: "First question - what's your age group? This helps me understand what types of scams you might encounter! 🕵️‍♂️",
    image: onboard1,
    imageAlt: "Detective Alli",
    options: [
      { label: 'Under 18', value: 'under_18' },
      { label: '18-29 years old', value: '18_29' },
      { label: '30-49 years old', value: '30_49' },
      { label: '50-64 years old', value: '50_64' },
      { label: 'Over 65+', value: 'over_65' }
    ]
  },
  {
    id: 2,
    question: "Next - How would you describe your online experience?",
    image: onboard1,
    imageAlt: "Detective Alli",
    options: [
      { label: 'Expert', value: 'expert' },
      { label: 'Regular user', value: 'regular' },
      { label: 'Casual user', value: 'casual' },
      { label: 'New to technology', value: 'new' }
    ]
  },
  {
    id: 3,
    question: "What do you spend most of your time doing online? This helps me prioritize your protection! 🌐",
    image: onboard1,
    imageAlt: "Detective Alli",
    options: [
      { label: 'Social media and messaging', value: 'social_media' },
      { label: 'Online shopping and banking', value: 'online_shopping' },
      { label: 'Work emails and video calls', value: 'work_emails' },  
      { label: 'Basic browsing/entertainment', value: 'basic_browsing' }
    ]
  },
  {
    id: 4,
    question: "Last question -How much do you know about online scams?",
    image: onboard1,
    imageAlt: "Detective Alli",
    options: [
      { label: 'A lot', value: 'a_lot' },  
      { label: 'Some knowledge', value: 'some_knowledge' },
      { label: 'A little', value: 'a_little' },
      { label: 'Very little', value: 'very_little' }
    ]
  },
]; 