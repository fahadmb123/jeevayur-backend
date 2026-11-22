export interface TreatmentData {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  icon: string;
  benefits: string[];
  duration: string;
  category: string;
}

export interface FaqData {
  q: string;
  a: string;
}

export const TREATMENTS_DATA: TreatmentData[] = [
  {
    id: 'metabolic-health',
    title: 'Metabolic Health',
    categoryTag: 'Prameha & Agni',
    description: 'Ayurvedic evaluation and management of Prameha, lipid imbalances, and metabolic sluggishness through Agni balancing.',
    icon: '🌿',
    benefits: ['Insulin sensitivity support', 'Lipid balance & circulation', 'Agni metabolic rejuvenation'],
    duration: 'Personalized Plan',
    category: 'metabolic',
  },
  {
    id: 'womens-health',
    title: "Women's Health",
    categoryTag: 'Stree Roga',
    description: 'Holistic care for menstrual regularities, hormonal harmony, PCOD/PCOS, and cyclical vitality through herbs and lifestyle.',
    icon: '🌸',
    benefits: ['Hormonal balance', 'Menstrual rhythm support', 'Holistic female vitality'],
    duration: 'Ongoing Care',
    category: 'women',
  },
  {
    id: 'musculoskeletal-care',
    title: 'Musculoskeletal Care',
    categoryTag: 'Sandhi Chikitsa',
    description: 'Classical management of joint mobility, spine health, cervical & lumbar stiffness, and degenerative discomfort.',
    icon: '🦴',
    benefits: ['Joint flexibility & ease', 'Spinal alignment support', 'Herbal anti-inflammatory relief'],
    duration: 'Custom Protocol',
    category: 'joints',
  },
  {
    id: 'mental-wellbeing',
    title: 'Mental Well-being',
    categoryTag: 'Satvavajaya',
    description: 'Integrating classical Satvavajaya concepts, mindful counseling, and stress mitigation for emotional equilibrium.',
    icon: '🧠',
    benefits: ['Stress & burnout recovery', 'Emotional resilience', 'Nervous system relaxation'],
    duration: '45-60 mins',
    category: 'mind',
  },
  {
    id: 'digestive-health',
    title: 'Digestive Health',
    categoryTag: 'Jatharagni',
    description: 'Restoring gut digestive fire (Jatharagni) to relieve bloating, IBS tendencies, acidity, and metabolic toxin buildup.',
    icon: '🔥',
    benefits: ['Agni digestive optimization', 'Ama toxin elimination', 'Balanced nutrient assimilation'],
    duration: 'Structured Care',
    category: 'metabolic',
  },
  {
    id: 'skin-hair-health',
    title: 'Skin & Hair Health',
    categoryTag: 'Twak & Kesa',
    description: 'Root-cause management for chronic skin flare-ups, eczema, psoriasis tendencies, acne, and scalp nourishment.',
    icon: '✨',
    benefits: ['Blood purification (Rakta Sodhana)', 'Natural skin glow', 'Hair follicle revitalization'],
    duration: 'Custom Program',
    category: 'skin',
  },
  {
    id: 'neurological-health',
    title: 'Neurological Health',
    categoryTag: 'Vata & Majja',
    description: 'Supportive classical care for nerve vitality, chronic headaches, sleep disturbances, and sensory rejuvenation.',
    icon: '⚡',
    benefits: ['Nerve tone strengthening', 'Restful sleep regulation', 'Pranic vitality restoration'],
    duration: 'Holistic Plan',
    category: 'mind',
  },
  {
    id: 'respiratory-health',
    title: 'Respiratory Health',
    categoryTag: 'Pranavaha Srotas',
    description: 'Strengthening Pranavaha srotas to relieve recurrent allergies, chronic sinusitis, cough, and bronchial sensitivity.',
    icon: '🌬️',
    benefits: ['Clear airway flow', 'Pranayama lung expansion', 'Allergic sensitivity reduction'],
    duration: 'Targeted Plan',
    category: 'preventive',
  },
  {
    id: 'geriatric-health',
    title: 'Geriatric Health',
    categoryTag: 'Rasayana Chikitsa',
    description: 'Promoting healthy aging, preserving tissue strength (Dhatus), bone density, and memory in elder years.',
    icon: '🪵',
    benefits: ['Longevity & vitality support', 'Mobility & joint ease', 'Cognitive sharpness'],
    duration: 'Ongoing Rejuvenation',
    category: 'preventive',
  },
  {
    id: 'preventive-healthcare',
    title: 'Preventive Healthcare',
    categoryTag: 'Swasthavritta',
    description: 'Constitution analysis (Prakriti), Dinacharya daily routines, and Ritucharya seasonal adjustments to maintain health.',
    icon: '☀️',
    benefits: ['Prakriti self-awareness', 'Circadian lifestyle rhythm', 'Sustainable disease prevention'],
    duration: 'Foundational Care',
    category: 'preventive',
  },
];

export const FAQS_DATA: FaqData[] = [
  {
    q: 'How does Dr. Ahalya personalize an Ayurvedic consultation?',
    a: 'Each consultation starts with an in-depth Prakriti assessment to understand your unique constitutional baseline, followed by evaluating current Dosha imbalances, digestive fire (Agni), tissue health (Dhatu), and daily lifestyle habits before creating your care plan.',
  },
  {
    q: 'Can online consultations be conducted for remote patients?',
    a: 'Yes, we provide secure video telemedicine consultations for patients across India and internationally, followed by personalized lifestyle guidance, diet protocols, and medicine delivery where indicated.',
  },
  {
    q: 'Is Ayurvedic healthcare safe alongside conventional medical treatments?',
    a: 'Yes. Our clinical care emphasizes safety, non-interference, and medical transparency. We review your current medications and health history carefully, and provide medical evaluation or referral whenever clinically indicated.',
  },
  {
    q: 'What role do diet and yoga play in the treatment process?',
    a: 'Diet (Ahara) and mindful movement/yoga (Vihara) are foundational in Ayurveda. Through Jeevayurniketan | Yogaathma, Dr. Ahalya coordinates doctor-guided personalized yoga, gentle restorative postures, and pranayama breathing practices alongside classical herbal preparations to support lasting, root-cause recovery.',
  },
  {
    q: 'How are follow-up appointments scheduled and monitored?',
    a: 'Progress is monitored through structured follow-ups to evaluate symptom relief, digestive improvements, and tolerance to therapies, making dynamic adjustments as your health naturally restores.',
  },
];
