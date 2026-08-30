/**
 * SaroHub Technologies (Private) Limited
 * Core Enterprise TypeScript Type Definitions
 */

export interface SEOSettings {
  id: number;
  page_route: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  canonical_url?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  banner_url: string;
  short_description: string;
  description: string;
  benefits: string[]; // Handled as array
  technologies: string[]; // Handled as array
  faqs: { question: string; answer: string }[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  category: string;
  technologies: string[];
  short_description: string;
  description: string;
  case_study?: string;
  live_url?: string;
  github_url?: string;
  completion_date: string;
  thumbnail_url: string;
  screenshots?: string[];
  created_at: string;
  updated_at: string;
}

export interface StudentProject {
  id: number;
  title: string;
  student_name: string;
  batch_course: string;
  category: string;
  technologies: string[];
  short_description: string;
  description: string;
  thumbnail_url: string;
  images?: string[];
  live_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  features: string[];
  pricing_plans: { name: string; price: string; period: string; features: string[] }[];
  demo_url?: string;
  video_url?: string;
  download_url?: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export type VentureStatusType = 
  | 'Idea' 
  | 'Research' 
  | 'Prototype' 
  | 'In Development' 
  | 'Beta' 
  | 'Active' 
  | 'Expanding' 
  | 'Archived';

export interface VentureGalleryItem {
  url: string;
  caption?: string;
  description?: string;
}

export interface Venture {
  id: number;
  ventureNumber?: string;
  name: string;
  slug: string;
  shortTitle?: string;
  tagline: string;
  description: string;
  category: string;
  status: VentureStatusType;
  logo?: string;
  coverImage?: string;
  galleryImages?: (string | VentureGalleryItem)[];
  gallery?: VentureGalleryItem[];
  keyCapabilities: string[];
  technologies: string[];
  websiteUrl?: string;
  demoUrl?: string;
  learnMoreUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional fields
  industry?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  businessModel?: string;
  launchDate?: string;
  externalLinks?: { name: string; url: string }[];
  metrics?: { label: string; value: string }[];
  team?: { name: string; role: string; avatar?: string }[];
  documentationUrl?: string;
}


export interface SaleProject {
  id: number;
  title: string;
  price: number;
  technology: string[];
  short_description: string;
  features: string[];
  demo_url?: string;
  video_url?: string;
  thumbnail_url: string;
  screenshots: string[];
  screenshot_descriptions?: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  author_avatar?: string;
  category_id: number;
  featured_image_url: string;
  content: string;
  reading_time: string;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  tags: number[]; // Array of tag IDs
}

export interface Event {
  id: number;
  title: string;
  banner_url: string;
  event_date: string;
  venue: string;
  description: string;
  registration_link?: string;
  form_fields?: OpportunityField[];
  created_at: string;
}

export interface Career {
  id: number;
  position: string;
  department: string;
  salary: string;
  experience: string;
  skills: string[];
  description: string;
  banner_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Application {
  id: number;
  career_id: number;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  resume_filename?: string;
  cover_letter?: string;
  applied_at: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface TeamMemberSocialLink {
  platform: string;
  url: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  bio: string;
  skills: string[];
  social_linkedin?: string;
  social_github?: string;
  social_twitter?: string;
  portfolio_url?: string;
  social_links?: TeamMemberSocialLink[];
  experience_years: string;
  is_founder: boolean;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  client_company: string;
  client_avatar?: string;
  rating: number;
  feedback: string;
  created_at: string;
}

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface ActivityLog {
  id: number;
  admin_id?: number;
  action_type: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'agent' | 'system';
  text: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  status: 'active' | 'closed';
  agent_unread: boolean;
  visitor_unread: boolean;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface OpportunityField {
  id: string;
  type: 
    | 'text' | 'full_name' | 'email' | 'phone' | 'cnic_passport' | 'date' | 'number' | 'textarea'
    | 'dropdown' | 'radio' | 'checkbox' | 'checkbox_multi' | 'multi_select' | 'yes_no_toggle'
    | 'file' | 'file_multiple' | 'image' | 'resume' | 'cover_letter' | 'transcript' | 'certificate' | 'portfolio_upload'
    | 'url' | 'linkedin' | 'github' | 'country' | 'state' | 'city';
  label: string;
  required: boolean;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[]; // For dropdown, radio, checkbox options
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    allowedFileTypes?: string[]; // e.g. ['.pdf', '.docx', '.png', '.jpg']
    maxFileSizeMb?: number;
    maxFilesCount?: number;
    customErrorMessage?: string;
  };
}

export interface Opportunity {
  id: number;
  type: string; // Scholarship, Internship, Job, Event, Competition, Training Program, Ambassador Program, etc.
  title: string;
  slug: string;
  short_description?: string;
  description: string;
  eligibility_criteria: string;
  benefits: string;
  location: string;
  duration: string;
  start_date?: string;
  deadline: string;
  positions_count?: number;
  max_applications?: number;
  status: 'Open' | 'Closed';
  featured_image_url?: string;
  is_published: boolean;
  seo_title?: string;
  seo_description?: string;
  form_fields: OpportunityField[];
  created_at: string;
  updated_at: string;
}

export interface OpportunityApplication {
  id: number;
  opportunity_id: number;
  opportunity_title: string;
  opportunity_type: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  form_data: { [fieldLabel: string]: any };
  uploaded_documents: { fieldLabel: string; fileName: string; fileUrl: string }[];
  internal_notes?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  event_title: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  form_data: { [fieldLabel: string]: any };
  status?: string;
}

export type PartnerCategory = 'Partner' | 'Agency' | 'Investor' | 'Collaborator' | 'Sponsor';

export interface Partner {
  id: number;
  name: string;
  category: PartnerCategory;
  logo_url: string;
  website_url?: string;
  description?: string;
  images?: string[];
  gallery?: string[];
  featured: boolean;
  order: number;
  created_at: string;
}

export interface HeroSectionSettings {
  eyebrowText: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badgeText: string;
  bgMediaUrl?: string;
  heroImageUrl?: string;
}

export interface CompanyMetric {
  id: number;
  number: string;
  label: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface WhySaroHubItem {
  id: number;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface IndustrySolution {
  id: number;
  name: string;
  slug: string;
  problemStatement: string;
  solutions: string[];
  services: string[];
  features: string[];
  caseStudies?: string[];
  technologies: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  order: number;
}

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  projectType: string;
  challenge: string;
  solution: string;
  approach: string;
  features: string[];
  technologies: string[];
  results: string[];
  metrics: { label: string; value: string }[];
  duration?: string;
  teamMembers?: string[];
  images: string[];
  videoUrl?: string;
  testimonialText?: string;
  testimonialAuthor?: string;
  liveUrl?: string;
  demoUrl?: string;
  relatedServices?: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface ProcessStep {
  id: number;
  stepNumber: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  image?: string;
  order: number;
}

export interface TechStackItem {
  id: number;
  name: string;
  logoUrl?: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'AI' | 'Databases' | 'Cloud' | 'DevOps' | 'Automation' | 'Security';
  description: string;
  websiteUrl?: string;
  proficiencyLevel?: string;
  order: number;
  active: boolean;
}

export interface SecurityStandard {
  id: number;
  title: string;
  category: string;
  description: string;
  details: string[];
  icon: string;
  order: number;
}

export interface CompanyTimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  serviceRequired: string;
  industry?: string;
  projectDescription: string;
  estimatedBudget: string;
  timeline?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
}

export interface MediaItem {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'other';
  category?: string;
  altText?: string;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface GlobalWebsiteSettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl?: string;
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
  businessHours?: string;
  footerContent?: string;
  copyrightText?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
  socialLinks: { platform: string; url: string }[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  external?: boolean;
  order: number;
  visible: boolean;
  children?: { label: string; path: string }[];
}

export interface NavigationMenu {
  headerMenu: NavigationItem[];
  footerMenu: NavigationItem[];
}



