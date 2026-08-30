import { 
  Service, Project, Product, SaleProject, Blog, BlogCategory, BlogTag, 
  Event, Career, Application, TeamMember, Testimonial, FAQ, 
  ContactMessage, NewsletterSubscriber, SEOSettings, ActivityLog,
  ChatSession, Opportunity, OpportunityApplication, EventRegistration, Partner, StudentProject, Venture,
  HeroSectionSettings, CompanyMetric, WhySaroHubItem, IndustrySolution, CaseStudy, ProcessStep, TechStackItem, SecurityStandard, CompanyTimelineItem, Lead, MediaItem
} from './types';

// /**
//  * SaroHub Technologies (Private) Limited
//  * Frontend API Utility wrapper for backend synchronization
//  */

// const API_BASE = '/api';

// // Retrieve token from storage
// export function getAuthToken(): string | null {
//   return localStorage.getItem('sarohub_auth_token');
// }

// // Set or clear tokens
// export function setAuthToken(token: string | null) {
//   if (token) {
//     localStorage.setItem('sarohub_auth_token', token);
//   } else {
//     localStorage.removeItem('sarohub_auth_token');
//   }
// }

// // Helper fetch client with automatic token header injects
// async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const token = getAuthToken();
//   const headers = new Headers(options.headers || {});
  
//   if (token) {
//     headers.set('Authorization', `Bearer ${token}`);
//   }
  
//   if (options.body && !(options.body instanceof FormData)) {
//     headers.set('Content-Type', 'application/json');
//   }

//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers
//   });

//   if (!res.ok) {
//     const errData = await res.json().catch(() => ({}));
//     throw new Error(errData.error || `HTTP error! status: ${res.status}`);
//   }

//   return res.json() as Promise<T>;
// }

// export const api = {
//   // 1. Auth Module
//   async login(username: string, password: string) {
//     const data = await request<{ token: string; admin: any }>('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ username, password })
//     });
//     setAuthToken(data.token);
//     return data;
//   },

//   async logout() {
//     setAuthToken(null);
//   },

//   async getProfile() {
//     return request<any>('/auth/profile');
//   },

//   async updateProfile(body: { username?: string; full_name: string; email: string; bio: string; profile_pic?: string }) {
//     return request<any>('/auth/profile', {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async changePassword(body: any) {
//     return request<any>('/auth/change-password', {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async forgotPassword(email: string) {
//     return request<any>('/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify({ email })
//     });
//   },

//   async uploadImage(file: File) {
//     const formData = new FormData();
//     formData.append('image', file);
//     return request<{ url: string }>('/upload', {
//       method: 'POST',
//       body: formData
//     });
//   },

//   async getLogs() {
//     return request<any[]>('/auth/logs');
//   },

//   // 2. Stats
//   async getStats() {
//     return request<any>('/stats');
//   },

//   // 3. Services CRUD
//   async getServices() {
//     return request<any[]>('/services');
//   },

//   async createService(body: any) {
//     return request<any>('/services', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateService(id: number, body: any) {
//     return request<any>(`/services/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteService(id: number) {
//     return request<any>(`/services/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 4. Projects CRUD
//   async getProjects() {
//     return request<any[]>('/projects');
//   },

//   async createProject(body: any) {
//     return request<any>('/projects', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateProject(id: number, body: any) {
//     return request<any>(`/projects/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteProject(id: number) {
//     return request<any>(`/projects/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 5. Products CRUD
//   async getProducts() {
//     return request<any[]>('/products');
//   },

//   async createProduct(body: any) {
//     return request<any>('/products', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateProduct(id: number, body: any) {
//     return request<any>(`/products/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteProduct(id: number) {
//     return request<any>(`/products/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 6. Projects for Sale
//   async getSaleProjects() {
//     return request<any[]>('/sale-projects');
//   },

//   async createSaleProject(body: any) {
//     return request<any>('/sale-projects', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateSaleProject(id: number, body: any) {
//     return request<any>(`/sale-projects/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteSaleProject(id: number) {
//     return request<any>(`/sale-projects/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 7. Blog Module
//   async getBlogs() {
//     return request<any[]>('/blogs');
//   },

//   async getBlogCategories() {
//     return request<any[]>('/blog-categories');
//   },

//   async getBlogTags() {
//     return request<any[]>('/blog-tags');
//   },

//   async createBlog(body: any) {
//     return request<any>('/blogs', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateBlog(id: number, body: any) {
//     return request<any>(`/blogs/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteBlog(id: number) {
//     return request<any>(`/blogs/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   async createBlogCategory(name: string) {
//     return request<any>('/blog-categories', {
//       method: 'POST',
//       body: JSON.stringify({ name })
//     });
//   },

//   async createBlogTag(name: string) {
//     return request<any>('/blog-tags', {
//       method: 'POST',
//       body: JSON.stringify({ name })
//     });
//   },

//   // 8. Events CRUD
//   async getEvents() {
//     return request<any[]>('/events');
//   },

//   async createEvent(body: any) {
//     return request<any>('/events', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateEvent(id: number, body: any) {
//     return request<any>(`/events/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteEvent(id: number) {
//     return request<any>(`/events/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   async getEventRegistrations() {
//     return request<any[]>('/events-registrations');
//   },

//   async submitEventRegistration(eventId: number, body: any) {
//     return request<any>(`/events/${eventId}/register`, {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteEventRegistration(id: number) {
//     return request<any>(`/events-registrations/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 9. Careers & Applications
//   async getCareers() {
//     return request<any[]>('/careers');
//   },

//   async createCareer(body: any) {
//     return request<any>('/careers', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateCareer(id: number, body: any) {
//     return request<any>(`/careers/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteCareer(id: number) {
//     return request<any>(`/careers/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   async getApplications() {
//     return request<any[]>('/applications');
//   },

//   async submitApplication(body: any) {
//     return request<any>('/applications', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateApplicationStatus(id: number, status: string) {
//     return request<any>(`/applications/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ status })
//     });
//   },

//   // Opportunities module APIs
//   async getOpportunities() {
//     return request<any[]>('/opportunities');
//   },

//   async getOpportunity(id: number) {
//     return request<any>(`/opportunities/${id}`);
//   },

//   async createOpportunity(body: any) {
//     return request<any>('/opportunities', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateOpportunity(id: number, body: any) {
//     return request<any>(`/opportunities/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async duplicateOpportunity(id: number) {
//     return request<any>(`/opportunities/${id}/duplicate`, {
//       method: 'POST'
//     });
//   },

//   async deleteOpportunity(id: number) {
//     return request<any>(`/opportunities/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   async getOpportunityApplications() {
//     return request<any[]>('/opportunities-applications');
//   },

//   async submitOpportunityApplication(opportunityId: number, body: any) {
//     return request<any>(`/opportunities/${opportunityId}/apply`, {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateOpportunityApplicationStatus(id: number, status: string) {
//     return request<any>(`/opportunities-applications/${id}/status`, {
//       method: 'PUT',
//       body: JSON.stringify({ status })
//     });
//   },

//   async updateOpportunityApplicationNotes(id: number, notes: string) {
//     return request<any>(`/opportunities-applications/${id}/notes`, {
//       method: 'PUT',
//       body: JSON.stringify({ notes })
//     });
//   },

//   async sendOpportunityNotification(id: number, messageText: string) {
//     return request<any>(`/opportunities-applications/${id}/notify`, {
//       method: 'POST',
//       body: JSON.stringify({ messageText })
//     });
//   },

//   async deleteOpportunityApplication(id: number) {
//     return request<any>(`/opportunities-applications/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 10. Team
//   async getTeam() {
//     return request<any[]>('/team');
//   },

//   async createTeamMember(body: any) {
//     return request<any>('/team', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateTeamMember(id: number, body: any) {
//     return request<any>(`/team/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteTeamMember(id: number) {
//     return request<any>(`/team/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 11. FAQs & Testimonials
//   async getFAQs() {
//     return request<any[]>('/faqs');
//   },

//   async createFAQ(body: any) {
//     return request<any>('/faqs', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateFAQ(id: number, body: any) {
//     return request<any>(`/faqs/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteFAQ(id: number) {
//     return request<any>(`/faqs/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   async getTestimonials() {
//     return request<any[]>('/testimonials');
//   },

//   async createTestimonial(body: any) {
//     return request<any>('/testimonials', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async updateTestimonial(id: number, body: any) {
//     return request<any>(`/testimonials/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(body)
//     });
//   },

//   async deleteTestimonial(id: number) {
//     return request<any>(`/testimonials/${id}`, {
//       method: 'DELETE'
//     });
//   },

//   // 12. Contact Messages & Newsletters
//   async getContactMessages() {
//     return request<any[]>('/contact');
//   },

//   async submitContactForm(body: { name: string; email: string; phone?: string; subject: string; message: string }) {
//     return request<any>('/contact', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async markMessageAsRead(id: number) {
//     return request<any>(`/contact/${id}`, {
//       method: 'PUT'
//     });
//   },

//   async getNewsletterSubscribers() {
//     return request<any[]>('/newsletter');
//   },

//   async subscribeNewsletter(email: string) {
//     return request<any>('/newsletter', {
//       method: 'POST',
//       body: JSON.stringify({ email })
//     });
//   },

//   // 13. Settings & SEO
//   async getSettings() {
//     return request<{ [key: string]: string }>('/settings');
//   },

//   async saveSettings(body: any) {
//     return request<any>('/settings', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   async getSEO() {
//     return request<any[]>('/seo');
//   },

//   async saveSEO(body: { page_route: string; meta_title: string; meta_description: string; meta_keywords: string }) {
//     return request<any>('/seo', {
//       method: 'POST',
//       body: JSON.stringify(body)
//     });
//   },

//   // 14. Live Chat Module
//   async getChats() {
//     return request<{ sessions: any[]; availability: 'online' | 'away' | 'offline' }>('/chats');
//   },

//   async getAgentStatus() {
//     return request<{ availability: 'online' | 'away' | 'offline' }>('/chats/agent/status');
//   },

//   async updateAgentStatus(availability: 'online' | 'away' | 'offline') {
//     return request<any>('/chats/agent/status', {
//       method: 'PUT',
//       body: JSON.stringify({ availability })
//     });
//   },

//   async getChatSession(id: string) {
//     return request<any>(`/chats/${id}`);
//   },

//   async closeChatSession(id: string) {
//     return request<any>(`/chats/${id}/close`, {
//       method: 'PUT'
//     });
//   },

//   async sendChatMessage(sessionId: string, payload: { sender: 'visitor' | 'agent'; text: string; visitorName?: string; visitorEmail?: string }) {
//     return request<any>(`/chats/${sessionId}/messages`, {
//       method: 'POST',
//       body: JSON.stringify(payload)
//     });
//   },

//   async suggestChatReply(sessionId: string) {
//     return request<{ suggestion: string }>(`/chats/${sessionId}/suggest-reply`, {
//       method: 'POST'
//     });
//   }
// };






















const API_BASE = '/api';

// Retrieve token from storage
export function getAuthToken(): string | null {
  return localStorage.getItem('sarohub_auth_token');
}

// Set or clear tokens
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('sarohub_auth_token', token);
  } else {
    localStorage.removeItem('sarohub_auth_token');
  }
}

// Helper fetch client with automatic token header injects
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // 1. Auth Module
  async login(username: string, password: string) {
    const data = await request<{ token: string; admin: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuthToken(data.token);
    return data;
  },

  async logout() {
    setAuthToken(null);
  },

  async getProfile() {
    return request<any>('/auth/profile');
  },

  async updateProfile(body: { username?: string; full_name: string; email: string; bio: string; profile_pic?: string }) {
    return request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async changePassword(body: any) {
    return request<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async forgotPassword(email: string) {
    return request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData
    });
  },

  async getLogs() {
    return request<any[]>('/auth/logs');
  },

  // 2. Stats
  async getStats() {
    return request<any>('/stats');
  },

  // 3. Services CRUD
  async getServices() {
    return request<any[]>('/services');
  },

  async createService(body: any) {
    return request<any>('/services', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateService(id: number, body: any) {
    return request<any>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteService(id: number) {
    return request<any>(`/services/${id}`, {
      method: 'DELETE'
    });
  },

  // 4. Projects CRUD
  async getProjects() {
    return request<any[]>('/projects');
  },

  async createProject(body: any) {
    return request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateProject(id: number, body: any) {
    return request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteProject(id: number) {
    return request<any>(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // 4.5 Ventures CRUD
  async getVentures() {
    return request<any[]>('/ventures');
  },

  async getVentureBySlug(slug: string) {
    return request<any>(`/ventures/slug/${slug}`);
  },

  async createVenture(body: any) {
    return request<any>('/ventures', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateVenture(id: string | number, body: any) {
    return request<any>(`/ventures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteVenture(id: string | number) {
    return request<any>(`/ventures/${id}`, {
      method: 'DELETE'
    });
  },

  // 5. Products CRUD
  async getProducts() {
    return request<any[]>('/products');
  },

  async createProduct(body: any) {
    return request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateProduct(id: number, body: any) {
    return request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteProduct(id: number) {
    return request<any>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // 6. Projects for Sale
  async getSaleProjects() {
    return request<any[]>('/sale-projects');
  },

  async createSaleProject(body: any) {
    return request<any>('/sale-projects', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateSaleProject(id: number, body: any) {
    return request<any>(`/sale-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteSaleProject(id: number) {
    return request<any>(`/sale-projects/${id}`, {
      method: 'DELETE'
    });
  },

  // 7. Blog Module
  async getBlogs() {
    return request<any[]>('/blogs');
  },

  async getBlogCategories() {
    return request<any[]>('/blog-categories');
  },

  async getBlogTags() {
    return request<any[]>('/blog-tags');
  },

  async createBlog(body: any) {
    return request<any>('/blogs', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateBlog(id: number, body: any) {
    return request<any>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteBlog(id: number) {
    return request<any>(`/blogs/${id}`, {
      method: 'DELETE'
    });
  },

  async createBlogCategory(name: string) {
    return request<any>('/blog-categories', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  async createBlogTag(name: string) {
    return request<any>('/blog-tags', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  // 8. Events CRUD
  async getEvents() {
    return request<any[]>('/events');
  },

  async createEvent(body: any) {
    return request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateEvent(id: number, body: any) {
    return request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteEvent(id: number) {
    return request<any>(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  async getEventRegistrations() {
    return request<any[]>('/events-registrations');
  },

  async submitEventRegistration(eventId: number, body: any) {
    return request<any>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async deleteEventRegistration(id: number) {
    return request<any>(`/events-registrations/${id}`, {
      method: 'DELETE'
    });
  },

  async confirmEventReservation(id: number) {
    return request<any>(`/events-registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Confirmed' })
    });
  },

  // 9. Careers & Applications
  async getCareers() {
    return request<any[]>('/careers');
  },

  async createCareer(body: any) {
    return request<any>('/careers', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateCareer(id: number, body: any) {
    return request<any>(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteCareer(id: number) {
    return request<any>(`/careers/${id}`, {
      method: 'DELETE'
    });
  },

  async getApplications() {
    return request<any[]>('/applications');
  },

  async submitApplication(body: any) {
    return request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateApplicationStatus(id: number, status: string) {
    return request<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async uploadCv(file: File) {
    const formData = new FormData();
    formData.append('cv', file);
    return request<{ url: string }>('/upload-cv', {
      method: 'POST',
      body: formData
    });
  },

  async deleteApplication(id: number) {
    return request<any>(`/applications/${id}`, {
      method: 'DELETE'
    });
  },

  // Opportunities module APIs
  async getOpportunities() {
    return request<any[]>('/opportunities');
  },

  async getOpportunity(id: number) {
    return request<any>(`/opportunities/${id}`);
  },

  async createOpportunity(body: any) {
    return request<any>('/opportunities', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateOpportunity(id: number, body: any) {
    return request<any>(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async duplicateOpportunity(id: number) {
    return request<any>(`/opportunities/${id}/duplicate`, {
      method: 'POST'
    });
  },

  async deleteOpportunity(id: number) {
    return request<any>(`/opportunities/${id}`, {
      method: 'DELETE'
    });
  },

  async getOpportunityApplications() {
    return request<any[]>('/opportunities-applications');
  },

  async submitOpportunityApplication(opportunityId: number, body: any) {
    return request<any>(`/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateOpportunityApplicationStatus(id: number, status: string) {
    return request<any>(`/opportunities-applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async updateOpportunityApplicationNotes(id: number, notes: string) {
    return request<any>(`/opportunities-applications/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
  },

  async sendOpportunityNotification(id: number, messageText: string) {
    return request<any>(`/opportunities-applications/${id}/notify`, {
      method: 'POST',
      body: JSON.stringify({ messageText })
    });
  },

  async deleteOpportunityApplication(id: number) {
    return request<any>(`/opportunities-applications/${id}`, {
      method: 'DELETE'
    });
  },

  // 10. Team
  async getTeam() {
    return request<any[]>('/team');
  },

  async createTeamMember(body: any) {
    return request<any>('/team', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateTeamMember(id: number, body: any) {
    return request<any>(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteTeamMember(id: number) {
    return request<any>(`/team/${id}`, {
      method: 'DELETE'
    });
  },

  // 11. FAQs & Testimonials
  async getFAQs() {
    return request<any[]>('/faqs');
  },

  async createFAQ(body: any) {
    return request<any>('/faqs', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateFAQ(id: number, body: any) {
    return request<any>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteFAQ(id: number) {
    return request<any>(`/faqs/${id}`, {
      method: 'DELETE'
    });
  },

  async getTestimonials() {
    return request<any[]>('/testimonials');
  },

  async createTestimonial(body: any) {
    return request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async updateTestimonial(id: number, body: any) {
    return request<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async deleteTestimonial(id: number) {
    return request<any>(`/testimonials/${id}`, {
      method: 'DELETE'
    });
  },

  // 12. Contact Messages & Newsletters
  async getContactMessages() {
    return request<any[]>('/contact');
  },

  async submitContactForm(body: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async markMessageAsRead(id: number) {
    return request<any>(`/contact/${id}`, {
      method: 'PUT'
    });
  },

  async deleteContactMessage(id: number) {
    return request<any>(`/contact/${id}`, {
      method: 'DELETE'
    });
  },

  async replyContactMessage(id: number, body: { subject: string; message: string }) {
    return request<any>(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getNewsletterSubscribers() {
    return request<any[]>('/newsletter');
  },

  async subscribeNewsletter(email: string) {
    return request<any>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // 13. Settings & SEO
  async getSettings() {
    return request<{ [key: string]: string }>('/settings');
  },

  async saveSettings(body: any) {
    return request<any>('/settings', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  async getSEO() {
    return request<any[]>('/seo');
  },

  async saveSEO(body: { page_route: string; meta_title: string; meta_description: string; meta_keywords: string }) {
    return request<any>('/seo', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // 14. Live Chat Module
  async getChats() {
    return request<{ sessions: any[]; availability: 'online' | 'away' | 'offline' }>('/chats');
  },

  async getAgentStatus() {
    return request<{ availability: 'online' | 'away' | 'offline' }>('/chats/agent/status');
  },

  async updateAgentStatus(availability: 'online' | 'away' | 'offline') {
    return request<any>('/chats/agent/status', {
      method: 'PUT',
      body: JSON.stringify({ availability })
    });
  },

  async getChatSession(id: string) {
    return request<any>(`/chats/${id}`);
  },

  async closeChatSession(id: string) {
    return request<any>(`/chats/${id}/close`, {
      method: 'PUT'
    });
  },

  async sendChatMessage(sessionId: string, payload: { sender: 'visitor' | 'agent'; text: string; visitorName?: string; visitorPhone?: string; visitorEmail?: string }) {
    return request<any>(`/chats/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async suggestChatReply(sessionId: string) {
    return request<{ suggestion: string }>(`/chats/${sessionId}/suggest-reply`, {
      method: 'POST'
    });
  },

  // Partners, Agencies & Investors
  async getPartners() {
    return request<Partner[]>('/partners');
  },

  async createPartner(data: Partial<Partner>) {
    return request<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updatePartner(id: number, data: Partial<Partner>) {
    return request<Partner>(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deletePartner(id: number) {
    return request<{ success: boolean }>(`/partners/${id}`, {
      method: 'DELETE'
    });
  },

  async deleteChatSession(id: string) {
    return request<any>(`/chats/${id}`, {
      method: 'DELETE'
    });
  },

  async clearAllChatSessions() {
    return request<any>('/chats', {
      method: 'DELETE'
    });
  },

  // IT Academy Student Projects
  async getStudentProjects() {
    return request<StudentProject[]>('/student-projects');
  },

  async createStudentProject(data: Partial<StudentProject>) {
    return request<StudentProject>('/student-projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateStudentProject(id: number, data: Partial<StudentProject>) {
    return request<StudentProject>(`/student-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteStudentProject(id: number) {
    return request<{ success: boolean }>(`/student-projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Hero Settings
  async getHeroSettings() {
    return request<HeroSectionSettings>('/hero-settings');
  },
  async updateHeroSettings(data: Partial<HeroSectionSettings>) {
    return request<{ success: boolean; hero_settings: HeroSectionSettings }>('/hero-settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Company Metrics / Statistics
  async getCompanyMetrics() {
    return request<CompanyMetric[]>('/company-metrics');
  },
  async createCompanyMetric(data: Partial<CompanyMetric>) {
    return request<{ success: boolean }>('/company-metrics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCompanyMetric(id: number, data: Partial<CompanyMetric>) {
    return request<{ success: boolean }>(`/company-metrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCompanyMetric(id: number) {
    return request<{ success: boolean }>(`/company-metrics/${id}`, {
      method: 'DELETE'
    });
  },

  // Why SaroHub
  async getWhySaroHub() {
    return request<WhySaroHubItem[]>('/why-sarohub');
  },
  async createWhySaroHub(data: Partial<WhySaroHubItem>) {
    return request<{ success: boolean }>('/why-sarohub', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateWhySaroHub(id: number, data: Partial<WhySaroHubItem>) {
    return request<{ success: boolean }>(`/why-sarohub/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteWhySaroHub(id: number) {
    return request<{ success: boolean }>(`/why-sarohub/${id}`, {
      method: 'DELETE'
    });
  },

  // Industry Solutions
  async getIndustries() {
    return request<IndustrySolution[]>('/industries');
  },
  async createIndustry(data: Partial<IndustrySolution>) {
    return request<{ success: boolean }>('/industries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateIndustry(id: number, data: Partial<IndustrySolution>) {
    return request<{ success: boolean }>(`/industries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteIndustry(id: number) {
    return request<{ success: boolean }>(`/industries/${id}`, {
      method: 'DELETE'
    });
  },

  // Case Studies
  async getCaseStudies() {
    return request<CaseStudy[]>('/case-studies');
  },
  async createCaseStudy(data: Partial<CaseStudy>) {
    return request<{ success: boolean }>('/case-studies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCaseStudy(id: number, data: Partial<CaseStudy>) {
    return request<{ success: boolean }>(`/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCaseStudy(id: number) {
    return request<{ success: boolean }>(`/case-studies/${id}`, {
      method: 'DELETE'
    });
  },

  // Process Steps
  async getProcessSteps() {
    return request<ProcessStep[]>('/process-steps');
  },
  async createProcessStep(data: Partial<ProcessStep>) {
    return request<{ success: boolean }>('/process-steps', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateProcessStep(id: number, data: Partial<ProcessStep>) {
    return request<{ success: boolean }>(`/process-steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteProcessStep(id: number) {
    return request<{ success: boolean }>(`/process-steps/${id}`, {
      method: 'DELETE'
    });
  },

  // Tech Stack
  async getTechStack() {
    return request<TechStackItem[]>('/tech-stack');
  },
  async createTechStack(data: Partial<TechStackItem>) {
    return request<{ success: boolean }>('/tech-stack', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateTechStack(id: number, data: Partial<TechStackItem>) {
    return request<{ success: boolean }>(`/tech-stack/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteTechStack(id: number) {
    return request<{ success: boolean }>(`/tech-stack/${id}`, {
      method: 'DELETE'
    });
  },

  // Security Standards
  async getSecurityStandards() {
    return request<SecurityStandard[]>('/security-standards');
  },
  async createSecurityStandard(data: Partial<SecurityStandard>) {
    return request<{ success: boolean }>('/security-standards', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateSecurityStandard(id: number, data: Partial<SecurityStandard>) {
    return request<{ success: boolean }>(`/security-standards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteSecurityStandard(id: number) {
    return request<{ success: boolean }>(`/security-standards/${id}`, {
      method: 'DELETE'
    });
  },

  // Company Timeline
  async getCompanyTimeline() {
    return request<CompanyTimelineItem[]>('/company-timeline');
  },
  async createCompanyTimeline(data: Partial<CompanyTimelineItem>) {
    return request<{ success: boolean }>('/company-timeline', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateCompanyTimeline(id: number, data: Partial<CompanyTimelineItem>) {
    return request<{ success: boolean }>(`/company-timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteCompanyTimeline(id: number) {
    return request<{ success: boolean }>(`/company-timeline/${id}`, {
      method: 'DELETE'
    });
  },

  // Leads CRM
  async getLeads() {
    return request<Lead[]>('/leads');
  },
  async submitLead(data: Partial<Lead>) {
    return request<{ success: boolean; lead: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async updateLead(id: number, data: Partial<Lead>) {
    return request<{ success: boolean }>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  async deleteLead(id: number) {
    return request<{ success: boolean }>(`/leads/${id}`, {
      method: 'DELETE'
    });
  },

  // Centralized Media Library
  async getMedia() {
    return request<MediaItem[]>('/media');
  },
  async createMedia(data: Partial<MediaItem>) {
    return request<{ success: boolean }>('/media', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteMedia(id: number) {
    return request<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE'
    });
  }
};




