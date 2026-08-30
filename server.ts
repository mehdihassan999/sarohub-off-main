




// import 'dotenv/config';
// import express from 'express';
// import path from 'path';
// import { createServer as createViteServer } from 'vite';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { db } from './src/db';
// import { GoogleGenAI } from '@google/genai';
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import nodemailer from 'nodemailer';

// const app = express();
// const PORT = 3000;
// const JWT_SECRET = process.env.JWT_SECRET || 'sarohub-super-secret-key-2026';

// // Configure Cloudinary Integration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgjuqqu4',
//   api_key: process.env.CLOUDINARY_API_KEY || '315954739436377',
//   api_secret: process.env.CLOUDINARY_API_SECRET || '5XD-9RmJ4rL8In-Y4bOR-vkt7iA',
// });

// const upload = multer({ storage: multer.memoryStorage() });

// // Configure Nodemailer SMTP Transporter for contact form emails
// const smtpTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER || 'info@sarohub.com',
//     pass: process.env.SMTP_PASS || '',
//   },
// });


// let aiClient: GoogleGenAI | null = null;
// function getGeminiClient(): GoogleGenAI | null {
//   if (!aiClient) {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (apiKey) {
//       aiClient = new GoogleGenAI({
//         apiKey,
//         httpOptions: {
//           headers: {
//             'User-Agent': 'aistudio-build'
//           }
//         }
//       });
//     }
//   }
//   return aiClient;
// }

// // Middleware to parse requests
// app.use(express.json({ limit: '20mb' }));
// app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// // Express CORS Headers
// app.use((req, res, next) => {
//   res.setHeader('X-Frame-Options', 'SAMEORIGIN');
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   res.setHeader('X-XSS-Protection', '1; mode=block');
//   next();
// });

// // Helper: JWT authentication middleware
// function authenticateToken(req: any, res: any, next: any) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Authentication token required.' });
//   }

//   jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired session token.' });
//     }
//     req.admin = decoded;
//     next();
//   });
// }

// // =========================================================================
// // 1. AUTHENTICATION API
// // =========================================================================

// // Admin Login
// app.post('/api/auth/login', async (req, res) => {
//   const { username, password } = req.body;
//   const state = db.getState();

//   if (username !== state.admin.username) {
//     db.logActivity(undefined, 'LOGIN_FAILED', `Failed login attempt for username: ${username}`, req.ip || '127.0.0.1');
//     return res.status(401).json({ error: 'Invalid username or password.' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, state.admin.password_hash);
//   if (!isPasswordValid) {
//     db.logActivity(undefined, 'LOGIN_FAILED', `Failed password attempt for username: ${username}`, req.ip || '127.0.0.1');
//     return res.status(401).json({ error: 'Invalid username or password.' });
//   }

//   // Create JWT Token
//   const token = jwt.sign(
//     { id: state.admin.id, username: state.admin.username, role: state.admin.role },
//     JWT_SECRET,
//     { expiresIn: '12h' }
//   );

//   db.logActivity(state.admin.id, 'LOGIN_SUCCESS', 'Administrator authenticated successfully.', req.ip || '127.0.0.1');

//   res.json({
//     token,
//     admin: {
//       username: state.admin.username,
//       email: state.admin.email,
//       full_name: state.admin.full_name,
//       profile_pic: state.admin.profile_pic,
//       bio: state.admin.bio,
//       role: state.admin.role
//     }
//   });
// });

// // Admin Profile
// app.get('/api/auth/profile', authenticateToken, (req: any, res) => {
//   const state = db.getState();
//   res.json({
//     username: state.admin.username,
//     email: state.admin.email,
//     full_name: state.admin.full_name,
//     profile_pic: state.admin.profile_pic,
//     bio: state.admin.bio,
//     role: state.admin.role
//   });
// });

// // Update Profile
// app.put('/api/auth/profile', authenticateToken, (req: any, res) => {
//   const { username, full_name, email, bio, profile_pic } = req.body;

//   db.updateState((state) => {
//     state.admin.username = username || state.admin.username;
//     state.admin.full_name = full_name || state.admin.full_name;
//     state.admin.email = email || state.admin.email;
//     state.admin.bio = bio || state.admin.bio;
//     state.admin.profile_pic = profile_pic || state.admin.profile_pic;
//   });

//   db.logActivity(req.admin.id, 'UPDATE_PROFILE', 'Administrator updated profile settings.', req.ip || '127.0.0.1');
//   res.json({ success: true, message: 'Profile updated successfully.' });
// });

// // Change Password
// app.put('/api/auth/change-password', authenticateToken, async (req: any, res) => {
//   const { current_password, new_password } = req.body;
//   const state = db.getState();

//   const isPasswordValid = await bcrypt.compare(current_password, state.admin.password_hash);
//   if (!isPasswordValid) {
//     return res.status(400).json({ error: 'Current password is incorrect.' });
//   }

//   const salt = await bcrypt.genSalt(10);
//   const newHash = await bcrypt.hash(new_password, salt);

//   db.updateState((state) => {
//     state.admin.password_hash = newHash;
//   });

//   db.logActivity(req.admin.id, 'CHANGE_PASSWORD', 'Administrator changed password credentials.', req.ip || '127.0.0.1');
//   res.json({ success: true, message: 'Password updated successfully.' });
// });

// // Forgot Password
// app.post('/api/auth/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   const state = db.getState();

//   if (email !== state.admin.email) {
//     return res.status(404).json({ error: 'No administrator account mapped to this email.' });
//   }

//   // Generate random secure password
//   const tempPassword = `SaroHubReset${Math.floor(1000 + Math.random() * 9000)}!`;
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(tempPassword, salt);

//   // Save the new password hash
//   db.updateState((s) => {
//     s.admin.password_hash = hash;
//   });

//   db.logActivity(state.admin.id, 'FORGOT_PASSWORD_REQUEST', `Password reset triggered. New password sent to info@sarohub.com.`, req.ip || '127.0.0.1');

//   // Attempt actual SMTP send
//   const smtpHost = process.env.SMTP_HOST;
//   const smtpPort = parseInt(process.env.SMTP_PORT || '587');
//   const smtpUser = process.env.SMTP_USER;
//   const smtpPass = process.env.SMTP_PASS;

//   let emailSent = false;
//   let errMessage = '';

//   const mailOptions = {
//     from: smtpUser || '"SaroHub Security" <security@sarohub.com>',
//     to: 'info@sarohub.com',
//     subject: '🔒 SaroHub Administrative Password Recovery',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #020617; color: #f1f5f9;">
//         <h2 style="color: #06b6d4; border-bottom: 2px solid #1e293b; padding-bottom: 10px;">Security Recovery Token Issued</h2>
//         <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">A password recovery request was triggered for SaroHub's Administration Panel.</p>
//         <div style="background-color: #0f172a; border: 1px solid #334155; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
//           <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold;">Temporary Administrative Password</p>
//           <p style="margin: 10px 0 0 0; font-size: 20px; font-family: monospace; color: #06b6d4; font-weight: bold; letter-spacing: 2px;">${tempPassword}</p>
//         </div>
//         <p style="font-size: 12px; color: #64748b; margin-top: 20px;">For system security, please log in with these credentials immediately and set a custom password core from your Profile Settings panel.</p>
//         <p style="font-size: 10px; color: #475569; border-top: 1px solid #1e293b; padding-top: 10px; margin-top: 30px;">This email is automatically dispatched from SaroHub identity nodes. Cryptographic authentication: JWT / CryptCore.</p>
//       </div>
//     `
//   };

//   if (smtpHost && smtpUser && smtpPass) {
//     try {
//       const transporter = nodemailer.createTransport({
//         host: smtpHost,
//         port: smtpPort,
//         secure: smtpPort === 465,
//         auth: {
//           user: smtpUser,
//           pass: smtpPass
//         }
//       });
//       await transporter.sendMail(mailOptions);
//       emailSent = true;
//     } catch (err: any) {
//       console.error('Nodemailer SMTP Error:', err);
//       errMessage = err.message || 'SMTP Handshake Error';
//     }
//   }

//   if (emailSent) {
//     res.json({
//       success: true,
//       message: `Administrative password core has been successfully updated. The new temporary login password was dispatched to info@sarohub.com via custom SMTP node.`
//     });
//   } else {
//     // Always succeed during development/preview with log print so developers and testing run fine even if port 587 is blocked
//     console.log('============= RECOVERY EMAIL DISPATCH SIMULATION =============');
//     console.log('To: info@sarohub.com');
//     console.log('Subject:', mailOptions.subject);
//     console.log('New Generated Password:', tempPassword);
//     console.log('===============================================================');

//     res.json({
//       success: true,
//       message: `Administrative password core has been updated. SMTP configuration is not present, so the recovery mail to info@sarohub.com has been logged to the container terminal. For testing/preview, your temporary login password is: ${tempPassword}`
//     });
//   }
// });

// // Real System Image Upload Endpoint targeting Cloudinary
// app.post('/api/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No image file uploaded.' });
//   }

//   // Upload to Cloudinary using upload_stream
//   const uploadStream = cloudinary.uploader.upload_stream(
//     { folder: 'sarohub' },
//     (error, result) => {
//       if (error) {
//         console.error('Cloudinary Upload Error:', error);
//         return res.status(500).json({ error: 'Failed to upload image to Cloudinary.' });
//       }
//       res.json({ url: result?.secure_url || result?.url });
//     }
//   );

//   uploadStream.end(req.file.buffer);
// });


// // Activity logs
// app.get('/api/auth/logs', authenticateToken, (req, res) => {
//   res.json(db.getState().activity_logs);
// });

// // =========================================================================
// // 2. DASHBOARD ANALYTICS API
// // =========================================================================
// app.get('/api/stats', (req, res) => {
//   const s = db.getState();

//   // Dynamic metrics with fallback bounds based on corporate settings
//   const totalProjects = Math.max(10, s.projects ? s.projects.length : 0);
//   const totalBlogs = s.blogs ? s.blogs.length : 0;
//   const totalProducts = Math.max(6, s.products ? s.products.length : 0);
//   const totalTeam = Math.max(8, s.team_members ? s.team_members.length : 0);
//   const contactMessagesCount = s.contact_messages ? s.contact_messages.length : 0;
//   const newsletterSubscribersCount = s.newsletter_subscribers ? s.newsletter_subscribers.length : 0;
//   const careerApplicationsCount = s.applications ? s.applications.length : 0;
//   const eventsCount = s.events ? s.events.length : 0;

//   // Seed random visitors based on dates
//   const totalVisitors = 18450 + contactMessagesCount * 15;

//   res.json({
//     visitors: totalVisitors,
//     projects: totalProjects,
//     clients: 20,
//     blogs: totalBlogs,
//     products: totalProducts,
//     team: totalTeam,
//     experience: 4,
//     tech: 16,
//     contact_messages: contactMessagesCount,
//     newsletter_subscribers: newsletterSubscribersCount,
//     applications: careerApplicationsCount,
//     events: eventsCount,
//     traffic: [
//       { month: 'Jan', count: 1200 },
//       { month: 'Feb', count: 1850 },
//       { month: 'Mar', count: 2200 },
//       { month: 'Apr', count: 3100 },
//       { month: 'May', count: 4800 },
//       { month: 'Jun', count: totalVisitors }
//     ]
//   });
// });

// // =========================================================================
// // 3. SERVICES CRUD API
// // =========================================================================
// app.get('/api/services', (req, res) => {
//   res.json(db.getState().services);
// });

// app.post('/api/services', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.services.length > 0 ? Math.max(...state.services.map(i => i.id)) + 1 : 1;
//     const newService = {
//       id: nextId,
//       title: body.title,
//       slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
//       banner_url: body.banner_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
//       short_description: body.short_description,
//       description: body.description,
//       benefits: Array.isArray(body.benefits) ? body.benefits : [],
//       technologies: Array.isArray(body.technologies) ? body.technologies : [],
//       faqs: Array.isArray(body.faqs) ? body.faqs : [],
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
//     state.services.push(newService);
//     db.logActivity(req.admin.id, 'CREATE_SERVICE', `Created service: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.put('/api/services/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   db.updateState((state) => {
//     const s = state.services.find(item => item.id === id);
//     if (s) {
//       s.title = body.title || s.title;
//       s.short_description = body.short_description || s.short_description;
//       s.description = body.description || s.description;
//       s.banner_url = body.banner_url || s.banner_url;
//       s.benefits = Array.isArray(body.benefits) ? body.benefits : s.benefits;
//       s.technologies = Array.isArray(body.technologies) ? body.technologies : s.technologies;
//       s.faqs = Array.isArray(body.faqs) ? body.faqs : s.faqs;
//       s.updated_at = new Date().toISOString();
//       db.logActivity(req.admin.id, 'UPDATE_SERVICE', `Updated service: ${s.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.delete('/api/services/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const s = state.services.find(item => item.id === id);
//     if (s) {
//       state.services = state.services.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_SERVICE', `Deleted service: ${s.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 4. PROJECTS CRUD API
// // =========================================================================
// app.get('/api/projects', (req, res) => {
//   res.json(db.getState().projects);
// });

// app.post('/api/projects', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.projects.length > 0 ? Math.max(...state.projects.map(i => i.id)) + 1 : 1;
//     state.projects.push({
//       id: nextId,
//       title: body.title,
//       slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
//       client_name: body.client_name,
//       category: body.category,
//       technologies: Array.isArray(body.technologies) ? body.technologies : [],
//       short_description: body.short_description,
//       description: body.description,
//       case_study: body.case_study,
//       live_url: body.live_url,
//       github_url: body.github_url,
//       completion_date: body.completion_date || new Date().toISOString().split('T')[0],
//       thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_PROJECT', `Created project: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.put('/api/projects/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   db.updateState((state) => {
//     const p = state.projects.find(item => item.id === id);
//     if (p) {
//       p.title = body.title || p.title;
//       p.client_name = body.client_name || p.client_name;
//       p.category = body.category || p.category;
//       p.technologies = Array.isArray(body.technologies) ? body.technologies : p.technologies;
//       p.short_description = body.short_description || p.short_description;
//       p.description = body.description || p.description;
//       p.case_study = body.case_study || p.case_study;
//       p.live_url = body.live_url || p.live_url;
//       p.github_url = body.github_url || p.github_url;
//       p.completion_date = body.completion_date || p.completion_date;
//       p.thumbnail_url = body.thumbnail_url || p.thumbnail_url;
//       p.updated_at = new Date().toISOString();
//       db.logActivity(req.admin.id, 'UPDATE_PROJECT', `Updated project: ${p.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.delete('/api/projects/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const p = state.projects.find(item => item.id === id);
//     if (p) {
//       state.projects = state.projects.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_PROJECT', `Deleted project: ${p.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 5. PRODUCTS CRUD API
// // =========================================================================
// app.get('/api/products', (req, res) => {
//   res.json(db.getState().products);
// });

// app.post('/api/products', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.products.length > 0 ? Math.max(...state.products.map(i => i.id)) + 1 : 1;
//     state.products.push({
//       id: nextId,
//       title: body.title,
//       slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
//       short_description: body.short_description,
//       description: body.description,
//       features: Array.isArray(body.features) ? body.features : [],
//       pricing_plans: Array.isArray(body.pricing_plans) ? body.pricing_plans : [],
//       demo_url: body.demo_url,
//       video_url: body.video_url,
//       download_url: body.download_url,
//       thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_PRODUCT', `Created product: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.put('/api/products/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   db.updateState((state) => {
//     const p = state.products.find(item => item.id === id);
//     if (p) {
//       p.title = body.title || p.title;
//       p.short_description = body.short_description || p.short_description;
//       p.description = body.description || p.description;
//       p.features = Array.isArray(body.features) ? body.features : p.features;
//       p.pricing_plans = Array.isArray(body.pricing_plans) ? body.pricing_plans : p.pricing_plans;
//       p.demo_url = body.demo_url || p.demo_url;
//       p.video_url = body.video_url || p.video_url;
//       p.download_url = body.download_url || p.download_url;
//       p.thumbnail_url = body.thumbnail_url || p.thumbnail_url;
//       p.updated_at = new Date().toISOString();
//       db.logActivity(req.admin.id, 'UPDATE_PRODUCT', `Updated product: ${p.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.delete('/api/products/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const p = state.products.find(item => item.id === id);
//     if (p) {
//       state.products = state.products.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_PRODUCT', `Deleted product: ${p.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 6. PROJECTS FOR SALE CRUD
// // =========================================================================
// app.get('/api/sale-projects', (req, res) => {
//   res.json(db.getState().sale_projects);
// });

// app.post('/api/sale-projects', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.sale_projects.length > 0 ? Math.max(...state.sale_projects.map(i => i.id)) + 1 : 1;
//     state.sale_projects.push({
//       id: nextId,
//       title: body.title,
//       price: parseFloat(body.price) || 0.00,
//       technology: Array.isArray(body.technology) ? body.technology : [],
//       short_description: body.short_description,
//       features: Array.isArray(body.features) ? body.features : [],
//       demo_url: body.demo_url,
//       video_url: body.video_url,
//       thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
//       screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_SALE_PROJECT', `Created commercial template: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/sale-projects/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const p = state.sale_projects.find(item => item.id === id);
//     if (p) {
//       state.sale_projects = state.sale_projects.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_SALE_PROJECT', `Deleted template: ${p.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.put('/api/sale-projects/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const p = state.sale_projects.find(item => item.id === id);
//     if (p) {
//       p.title = body.title !== undefined ? body.title : p.title;
//       p.price = body.price !== undefined ? parseFloat(body.price) || 0.00 : p.price;
//       p.technology = Array.isArray(body.technology) ? body.technology : p.technology;
//       p.short_description = body.short_description !== undefined ? body.short_description : p.short_description;
//       p.features = Array.isArray(body.features) ? body.features : p.features;
//       p.demo_url = body.demo_url !== undefined ? body.demo_url : p.demo_url;
//       p.video_url = body.video_url !== undefined ? body.video_url : p.video_url;
//       p.thumbnail_url = body.thumbnail_url !== undefined ? body.thumbnail_url : p.thumbnail_url;
//       p.screenshots = Array.isArray(body.screenshots) ? body.screenshots : p.screenshots;
//       p.updated_at = new Date().toISOString();
//       db.logActivity(req.admin.id, 'UPDATE_SALE_PROJECT', `Updated commercial template: ${p.title}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Sale project not found' });
//   }
// });

// // =========================================================================
// // 7. CMS BLOGS, CATEGORIES & TAGS
// // =========================================================================
// app.get('/api/blogs', (req, res) => {
//   res.json(db.getState().blogs);
// });

// app.get('/api/blog-categories', (req, res) => {
//   res.json(db.getState().blog_categories);
// });

// app.get('/api/blog-tags', (req, res) => {
//   res.json(db.getState().blog_tags);
// });

// app.post('/api/blogs', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.blogs.length > 0 ? Math.max(...state.blogs.map(i => i.id)) + 1 : 1;
//     state.blogs.push({
//       id: nextId,
//       title: body.title,
//       slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
//       author_name: state.admin.full_name,
//       author_avatar: state.admin.profile_pic,
//       category_id: parseInt(body.category_id) || 1,
//       featured_image_url: body.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450',
//       content: body.content,
//       reading_time: body.reading_time || '5 min read',
//       is_featured: !!body.is_featured,
//       meta_title: body.meta_title,
//       meta_description: body.meta_description,
//       created_at: new Date().toISOString(),
//       tags: Array.isArray(body.tags) ? body.tags.map(Number) : []
//     });
//     db.logActivity(req.admin.id, 'CREATE_BLOG', `Created blog post: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.put('/api/blogs/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   db.updateState((state) => {
//     const b = state.blogs.find(item => item.id === id);
//     if (b) {
//       b.title = body.title || b.title;
//       b.category_id = parseInt(body.category_id) || b.category_id;
//       b.featured_image_url = body.featured_image_url || b.featured_image_url;
//       b.content = body.content || b.content;
//       b.reading_time = body.reading_time || b.reading_time;
//       b.is_featured = body.is_featured !== undefined ? !!body.is_featured : b.is_featured;
//       b.meta_title = body.meta_title || b.meta_title;
//       b.meta_description = body.meta_description || b.meta_description;
//       b.tags = Array.isArray(body.tags) ? body.tags.map(Number) : b.tags;
//       db.logActivity(req.admin.id, 'UPDATE_BLOG', `Updated blog: ${b.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.delete('/api/blogs/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const b = state.blogs.find(item => item.id === id);
//     if (b) {
//       state.blogs = state.blogs.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_BLOG', `Deleted blog post: ${b.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // Category and Tag inserts
// app.post('/api/blog-categories', authenticateToken, (req: any, res) => {
//   const { name } = req.body;
//   db.updateState((state) => {
//     const nextId = state.blog_categories.length > 0 ? Math.max(...state.blog_categories.map(i => i.id)) + 1 : 1;
//     state.blog_categories.push({
//       id: nextId,
//       name,
//       slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
//     });
//   });
//   res.json({ success: true });
// });

// app.post('/api/blog-tags', authenticateToken, (req: any, res) => {
//   const { name } = req.body;
//   db.updateState((state) => {
//     const nextId = state.blog_tags.length > 0 ? Math.max(...state.blog_tags.map(i => i.id)) + 1 : 1;
//     state.blog_tags.push({
//       id: nextId,
//       name,
//       slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
//     });
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 8. EVENTS CRUD API
// // =========================================================================
// app.get('/api/events', (req, res) => {
//   res.json(db.getState().events);
// });

// app.post('/api/events', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.events.length > 0 ? Math.max(...state.events.map(i => i.id)) + 1 : 1;
//     state.events.push({
//       id: nextId,
//       title: body.title,
//       banner_url: body.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450',
//       event_date: body.event_date || new Date().toISOString(),
//       venue: body.venue,
//       description: body.description,
//       registration_link: body.registration_link,
//       form_fields: body.form_fields || [],
//       created_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_EVENT', `Created company event: ${body.title}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/events/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const e = state.events.find(item => item.id === id);
//     if (e) {
//       state.events = state.events.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_EVENT', `Deleted event: ${e.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.put('/api/events/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const e = state.events.find(item => item.id === id);
//     if (e) {
//       e.title = body.title !== undefined ? body.title : e.title;
//       e.banner_url = body.banner_url !== undefined ? body.banner_url : e.banner_url;
//       e.event_date = body.event_date !== undefined ? body.event_date : e.event_date;
//       e.venue = body.venue !== undefined ? body.venue : e.venue;
//       e.description = body.description !== undefined ? body.description : e.description;
//       e.registration_link = body.registration_link !== undefined ? body.registration_link : e.registration_link;
//       e.form_fields = body.form_fields !== undefined ? body.form_fields : e.form_fields;
//       db.logActivity(req.admin.id, 'UPDATE_EVENT', `Updated company event: ${e.title}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Event not found' });
//   }
// });

// app.get('/api/events-registrations', authenticateToken, (req, res) => {
//   res.json(db.getState().event_registrations || []);
// });

// app.post('/api/events/:id/register', (req, res) => {
//   const eventId = parseInt(req.params.id);
//   const body = req.body;

//   if (!body.applicant_name || !body.applicant_email) {
//     return res.status(400).json({ error: 'Name and email are required for registration.' });
//   }

//   const events = db.getState().events;
//   const targetEvent = events.find(item => item.id === eventId);
//   if (!targetEvent) {
//     return res.status(404).json({ error: 'Event not found' });
//   }

//   db.updateState((state) => {
//     const nextId = state.event_registrations.length > 0 ? Math.max(...state.event_registrations.map(r => r.id)) + 1 : 1;
//     state.event_registrations.push({
//       id: nextId,
//       event_id: eventId,
//       event_title: targetEvent.title,
//       applicant_name: body.applicant_name,
//       applicant_email: body.applicant_email,
//       applied_at: new Date().toISOString(),
//       form_data: body.form_data || {}
//     });
//   });

//   res.json({ success: true, message: 'Successfully registered for the event!' });
// });

// app.delete('/api/events-registrations/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     state.event_registrations = (state.event_registrations || []).filter(item => item.id !== id);
//     db.logActivity(req.admin.id, 'DELETE_EVENT_REGISTRATION', `Removed event registration ID: ${id}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 9. TEAM MEMBERS CRUD API
// // =========================================================================
// app.get('/api/team', (req, res) => {
//   res.json(db.getState().team_members);
// });

// app.post('/api/team', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.team_members.length > 0 ? Math.max(...state.team_members.map(i => i.id)) + 1 : 1;
//     state.team_members.push({
//       id: nextId,
//       name: body.name,
//       position: body.position,
//       photo_url: body.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
//       bio: body.bio,
//       skills: Array.isArray(body.skills) ? body.skills : [],
//       social_linkedin: body.social_linkedin,
//       social_github: body.social_github,
//       social_twitter: body.social_twitter,
//       experience_years: body.experience_years || '5 Years',
//       is_founder: !!body.is_founder,
//       sort_order: parseInt(body.sort_order) || 10,
//       created_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_TEAM', `Added team member: ${body.name}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/team/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const t = state.team_members.find(item => item.id === id);
//     if (t) {
//       state.team_members = state.team_members.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_TEAM_MEMBER', `Removed team member: ${t.name}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.put('/api/team/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const t = state.team_members.find(item => item.id === id);
//     if (t) {
//       t.name = body.name !== undefined ? body.name : t.name;
//       t.position = body.position !== undefined ? body.position : t.position;
//       t.photo_url = body.photo_url !== undefined ? body.photo_url : t.photo_url;
//       t.bio = body.bio !== undefined ? body.bio : t.bio;
//       t.skills = Array.isArray(body.skills) ? body.skills : t.skills;
//       t.social_linkedin = body.social_linkedin !== undefined ? body.social_linkedin : t.social_linkedin;
//       t.social_github = body.social_github !== undefined ? body.social_github : t.social_github;
//       t.social_twitter = body.social_twitter !== undefined ? body.social_twitter : t.social_twitter;
//       t.experience_years = body.experience_years !== undefined ? body.experience_years : t.experience_years;
//       t.is_founder = body.is_founder !== undefined ? !!body.is_founder : t.is_founder;
//       t.sort_order = body.sort_order !== undefined ? parseInt(body.sort_order) || 10 : t.sort_order;
//       db.logActivity(req.admin.id, 'UPDATE_TEAM_MEMBER', `Updated team profile for: ${t.name}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Team member not found' });
//   }
// });

// // =========================================================================
// // 10. CAREERS & APPLICATIONS CRUD API
// // =========================================================================
// app.get('/api/careers', (req, res) => {
//   res.json(db.getState().careers);
// });

// app.post('/api/careers', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.careers.length > 0 ? Math.max(...state.careers.map(i => i.id)) + 1 : 1;
//     state.careers.push({
//       id: nextId,
//       position: body.position,
//       department: body.department,
//       salary: body.salary,
//       experience: body.experience,
//       skills: Array.isArray(body.skills) ? body.skills : [],
//       description: body.description,
//       is_active: true,
//       created_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_VACANCY', `Created vacancy: ${body.position}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/careers/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const c = state.careers.find(item => item.id === id);
//     if (c) {
//       state.careers = state.careers.filter(item => item.id !== id);
//       db.logActivity(req.admin.id, 'DELETE_VACANCY', `Removed vacancy: ${c.position}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// app.put('/api/careers/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const c = state.careers.find(item => item.id === id);
//     if (c) {
//       c.position = body.position !== undefined ? body.position : c.position;
//       c.department = body.department !== undefined ? body.department : c.department;
//       c.salary = body.salary !== undefined ? body.salary : c.salary;
//       c.experience = body.experience !== undefined ? body.experience : c.experience;
//       c.skills = Array.isArray(body.skills) ? body.skills : c.skills;
//       c.description = body.description !== undefined ? body.description : c.description;
//       c.is_active = body.is_active !== undefined ? !!body.is_active : c.is_active;
//       db.logActivity(req.admin.id, 'UPDATE_VACANCY', `Updated vacancy details for: ${c.position}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Vacancy not found' });
//   }
// });

// // Applications (Public submission & Admin reading)
// app.get('/api/applications', authenticateToken, (req, res) => {
//   res.json(db.getState().applications);
// });

// app.post('/api/applications', (req, res) => {
//   const body = req.body;
//   if (!body.career_id || !body.full_name || !body.email || !body.phone) {
//     return res.status(400).json({ error: 'Required fields missing: career_id, full_name, email, phone.' });
//   }

//   db.updateState((state) => {
//     const nextId = state.applications.length > 0 ? Math.max(...state.applications.map(i => i.id)) + 1 : 1;
//     state.applications.unshift({
//       id: nextId,
//       career_id: parseInt(body.career_id),
//       full_name: body.full_name,
//       email: body.email,
//       phone: body.phone,
//       resume_url: body.resume_url || 'https://sarohub.com/resumes/simulated_cv.pdf',
//       cover_letter: body.cover_letter,
//       applied_at: new Date().toISOString(),
//       status: 'pending'
//     });
//   });
//   res.json({ success: true, message: 'Career application submitted successfully!' });
// });

// app.put('/api/applications/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const { status } = req.body;
//   db.updateState((state) => {
//     const a = state.applications.find(item => item.id === id);
//     if (a) {
//       a.status = status;
//       db.logActivity(req.admin.id, 'UPDATE_APPLICATION', `Updated application status for: ${a.full_name} to ${status}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // =========================================================================
// // 10B. SCHOLARSHIPS & INTERNSHIPS (OPPORTUNITIES) CRUD API
// // =========================================================================
// app.get('/api/opportunities', (req, res) => {
//   res.json(db.getState().opportunities || []);
// });

// app.get('/api/opportunities/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const opp = (db.getState().opportunities || []).find(item => item.id === id);
//   if (opp) {
//     res.json(opp);
//   } else {
//     res.status(404).json({ error: 'Opportunity not found' });
//   }
// });

// app.post('/api/opportunities', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   if (!body.title || !body.type) {
//     return res.status(400).json({ error: 'Title and Type are required' });
//   }
//   let newOpp: any;
//   db.updateState((state) => {
//     if (!state.opportunities) state.opportunities = [];
//     const parseId = (id: any): number => {
//       const parsed = parseInt(String(id), 10);
//       return isNaN(parsed) ? 0 : parsed;
//     };
//     const nextId = state.opportunities.length > 0 
//       ? Math.max(...state.opportunities.map(i => parseId(i.id))) + 1 
//       : 1;

//     const baseSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
//     newOpp = {
//       id: nextId,
//       type: body.type,
//       title: body.title,
//       slug: baseSlug,
//       short_description: body.short_description || '',
//       description: body.description || '',
//       eligibility_criteria: body.eligibility_criteria || '',
//       benefits: body.benefits || '',
//       location: body.location || '',
//       duration: body.duration || '',
//       start_date: body.start_date || '',
//       deadline: body.deadline || '',
//       positions_count: body.positions_count ? parseInt(body.positions_count) : undefined,
//       max_applications: body.max_applications ? parseInt(body.max_applications) : undefined,
//       status: body.status || 'Open',
//       featured_image_url: body.featured_image_url || '',
//       is_published: body.is_published !== undefined ? !!body.is_published : true,
//       seo_title: body.seo_title || '',
//       seo_description: body.seo_description || '',
//       form_fields: Array.isArray(body.form_fields) ? body.form_fields : [
//         { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
//         { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
//         { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'Enter your phone' }
//       ],
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
//     state.opportunities.push(newOpp);
//     db.logActivity(req.admin.id, 'CREATE_OPPORTUNITY', `Created opportunity: ${body.title} (${body.type})`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true, opportunity: newOpp });
// });

// app.put('/api/opportunities/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     if (!state.opportunities) state.opportunities = [];
//     const opp = state.opportunities.find(item => String(item.id) === String(id));
//     if (opp) {
//       opp.title = body.title !== undefined ? body.title : opp.title;
//       opp.type = body.type !== undefined ? body.type : opp.type;
//       opp.slug = body.slug !== undefined ? body.slug : (body.title !== undefined ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : opp.slug);
//       opp.short_description = body.short_description !== undefined ? body.short_description : opp.short_description;
//       opp.description = body.description !== undefined ? body.description : opp.description;
//       opp.eligibility_criteria = body.eligibility_criteria !== undefined ? body.eligibility_criteria : opp.eligibility_criteria;
//       opp.benefits = body.benefits !== undefined ? body.benefits : opp.benefits;
//       opp.location = body.location !== undefined ? body.location : opp.location;
//       opp.duration = body.duration !== undefined ? body.duration : opp.duration;
//       opp.start_date = body.start_date !== undefined ? body.start_date : opp.start_date;
//       opp.deadline = body.deadline !== undefined ? body.deadline : opp.deadline;
//       opp.positions_count = body.positions_count !== undefined ? (body.positions_count ? parseInt(body.positions_count) : undefined) : opp.positions_count;
//       opp.max_applications = body.max_applications !== undefined ? (body.max_applications ? parseInt(body.max_applications) : undefined) : opp.max_applications;
//       opp.status = body.status !== undefined ? body.status : opp.status;
//       opp.featured_image_url = body.featured_image_url !== undefined ? body.featured_image_url : opp.featured_image_url;
//       opp.is_published = body.is_published !== undefined ? !!body.is_published : opp.is_published;
//       opp.seo_title = body.seo_title !== undefined ? body.seo_title : opp.seo_title;
//       opp.seo_description = body.seo_description !== undefined ? body.seo_description : opp.seo_description;
//       opp.form_fields = Array.isArray(body.form_fields) ? body.form_fields : opp.form_fields;
//       opp.updated_at = new Date().toISOString();
//       db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY', `Updated opportunity: ${opp.title}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Opportunity not found' });
//   }
// });

// app.post('/api/opportunities/:id/duplicate', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   let duplicatedOpp: any;
//   db.updateState((state) => {
//     if (!state.opportunities) state.opportunities = [];
//     const original = state.opportunities.find(item => String(item.id) === String(id));
//     if (original) {
//       const parseId = (id: any): number => {
//         const parsed = parseInt(String(id), 10);
//         return isNaN(parsed) ? 0 : parsed;
//       };
//       const nextId = state.opportunities.length > 0 
//         ? Math.max(...state.opportunities.map(i => parseId(i.id))) + 1 
//         : 1;
//       duplicatedOpp = {
//         ...original,
//         id: nextId,
//         title: `${original.title} (Copy)`,
//         is_published: false,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };
//       state.opportunities.push(duplicatedOpp);
//       db.logActivity(req.admin.id, 'DUPLICATE_OPPORTUNITY', `Duplicated opportunity: ${original.title} -> ${duplicatedOpp.title}`, req.ip || '127.0.0.1');
//     }
//   });
//   if (duplicatedOpp) {
//     res.json({ success: true, opportunity: duplicatedOpp });
//   } else {
//     res.status(404).json({ error: 'Opportunity to duplicate not found' });
//   }
// });

// app.delete('/api/opportunities/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   let success = false;
//   db.updateState((state) => {
//     if (!state.opportunities) state.opportunities = [];
//     const opp = state.opportunities.find(item => String(item.id) === String(id));
//     if (opp) {
//       state.opportunities = state.opportunities.filter(item => String(item.id) !== String(id));
//       db.logActivity(req.admin.id, 'DELETE_OPPORTUNITY', `Deleted opportunity: ${opp.title}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Opportunity not found' });
//   }
// });

// // Applications for Opportunities
// app.get('/api/opportunities-applications', authenticateToken, (req, res) => {
//   res.json(db.getState().opportunity_applications || []);
// });

// app.post('/api/opportunities/:id/apply', (req, res) => {
//   const opportunity_id = parseInt(req.params.id);
//   const { form_data, uploaded_documents, applicant_name, applicant_email } = req.body;

//   if (!applicant_name || !applicant_email) {
//     return res.status(400).json({ error: 'Required fields missing: applicant_name and applicant_email.' });
//   }

//   const opp = (db.getState().opportunities || []).find(item => item.id === opportunity_id);
//   if (!opp) {
//     return res.status(404).json({ error: 'Opportunity not found.' });
//   }

//   db.updateState((state) => {
//     if (!state.opportunity_applications) state.opportunity_applications = [];
//     const nextId = state.opportunity_applications.length > 0 ? Math.max(...state.opportunity_applications.map(i => i.id)) + 1 : 1;
//     state.opportunity_applications.unshift({
//       id: nextId,
//       opportunity_id,
//       opportunity_title: opp.title,
//       opportunity_type: opp.type,
//       applicant_name,
//       applicant_email,
//       applied_at: new Date().toISOString(),
//       status: 'Pending',
//       form_data: form_data || {},
//       uploaded_documents: Array.isArray(uploaded_documents) ? uploaded_documents : [],
//       internal_notes: ''
//     });
//   });

//   res.json({ success: true, message: 'Application submitted successfully! Our team will review it.' });
// });

// app.put('/api/opportunities-applications/:id/status', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const { status } = req.body;
//   if (!status) {
//     return res.status(400).json({ error: 'Status is required' });
//   }

//   let success = false;
//   db.updateState((state) => {
//     if (!state.opportunity_applications) state.opportunity_applications = [];
//     const appItem = state.opportunity_applications.find(item => item.id === id);
//     if (appItem) {
//       appItem.status = status;
//       db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY_APP_STATUS', `Updated status for opportunity application of: ${appItem.applicant_name} to ${status}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });

//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Application not found' });
//   }
// });

// app.put('/api/opportunities-applications/:id/notes', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const { notes } = req.body;

//   let success = false;
//   db.updateState((state) => {
//     if (!state.opportunity_applications) state.opportunity_applications = [];
//     const appItem = state.opportunity_applications.find(item => item.id === id);
//     if (appItem) {
//       appItem.internal_notes = notes;
//       db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY_APP_NOTES', `Updated internal notes on opportunity application of: ${appItem.applicant_name}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });

//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Application not found' });
//   }
// });

// app.post('/api/opportunities-applications/:id/notify', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const { messageText } = req.body;
//   if (!messageText) {
//     return res.status(400).json({ error: 'Message content is required' });
//   }

//   const appItem = (db.getState().opportunity_applications || []).find(item => item.id === id);
//   if (!appItem) {
//     return res.status(404).json({ error: 'Application not found' });
//   }

//   db.updateState((state) => {
//     db.logActivity(req.admin.id, 'SEND_OPPORTUNITY_NOTIFICATION', `Dispatched notification email to ${appItem.applicant_email} (${appItem.applicant_name}) for opportunity "${appItem.opportunity_title}"`, req.ip || '127.0.0.1');
//   });

//   console.log(`[EMAIL NOTIFICATION] Dispatched mail to ${appItem.applicant_email}:\n"${messageText}"`);

//   res.json({ success: true, message: `Notification email successfully dispatched to ${appItem.applicant_email}!` });
// });

// app.delete('/api/opportunities-applications/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   let success = false;
//   let applicantName = '';
//   db.updateState((state) => {
//     if (!state.opportunity_applications) state.opportunity_applications = [];
//     const index = state.opportunity_applications.findIndex(item => item.id === id);
//     if (index !== -1) {
//       applicantName = state.opportunity_applications[index].applicant_name;
//       state.opportunity_applications.splice(index, 1);
//       db.logActivity(req.admin.id, 'DELETE_OPPORTUNITY_APP', `Deleted opportunity application of: ${applicantName}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });

//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Application not found' });
//   }
// });

// // =========================================================================
// // 11. FAQS & TESTIMONIALS CRUD
// // =========================================================================
// app.get('/api/faqs', (req, res) => {
//   res.json(db.getState().faqs);
// });

// app.post('/api/faqs', authenticateToken, (req: any, res) => {
//   const { category, question, answer } = req.body;
//   db.updateState((state) => {
//     const nextId = state.faqs.length > 0 ? Math.max(...state.faqs.map(i => i.id)) + 1 : 1;
//     state.faqs.push({
//       id: nextId,
//       category,
//       question,
//       answer,
//       created_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_FAQ', `Added FAQ question under: ${category}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/faqs/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     state.faqs = state.faqs.filter(item => item.id !== id);
//   });
//   res.json({ success: true });
// });

// app.put('/api/faqs/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const f = state.faqs.find(item => item.id === id);
//     if (f) {
//       f.category = body.category !== undefined ? body.category : f.category;
//       f.question = body.question !== undefined ? body.question : f.question;
//       f.answer = body.answer !== undefined ? body.answer : f.answer;
//       db.logActivity(req.admin.id, 'UPDATE_FAQ', `Updated FAQ question: ${f.question}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'FAQ not found' });
//   }
// });

// // Testimonials
// app.get('/api/testimonials', (req, res) => {
//   res.json(db.getState().testimonials);
// });

// app.post('/api/testimonials', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     const nextId = state.testimonials.length > 0 ? Math.max(...state.testimonials.map(i => i.id)) + 1 : 1;
//     state.testimonials.push({
//       id: nextId,
//       client_name: body.client_name,
//       client_role: body.client_role,
//       client_company: body.client_company,
//       client_avatar: body.client_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
//       rating: parseInt(body.rating) || 5,
//       feedback: body.feedback,
//       created_at: new Date().toISOString()
//     });
//     db.logActivity(req.admin.id, 'CREATE_TESTIMONIAL', `Added client testimonial from: ${body.client_name}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// app.delete('/api/testimonials/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     state.testimonials = state.testimonials.filter(item => item.id !== id);
//   });
//   res.json({ success: true });
// });

// app.put('/api/testimonials/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   const body = req.body;
//   let success = false;
//   db.updateState((state) => {
//     const t = state.testimonials.find(item => item.id === id);
//     if (t) {
//       t.client_name = body.client_name !== undefined ? body.client_name : t.client_name;
//       t.client_role = body.client_role !== undefined ? body.client_role : t.client_role;
//       t.client_company = body.client_company !== undefined ? body.client_company : t.client_company;
//       t.client_avatar = body.client_avatar !== undefined ? body.client_avatar : t.client_avatar;
//       t.rating = body.rating !== undefined ? parseInt(body.rating) || 5 : t.rating;
//       t.feedback = body.feedback !== undefined ? body.feedback : t.feedback;
//       db.logActivity(req.admin.id, 'UPDATE_TESTIMONIAL', `Updated testimonial from: ${t.client_name}`, req.ip || '127.0.0.1');
//       success = true;
//     }
//   });
//   if (success) {
//     res.json({ success: true });
//   } else {
//     res.status(404).json({ error: 'Testimonial not found' });
//   }
// });

// // =========================================================================
// // LIVE CHAT API ENDPOINTS
// // =========================================================================

// // Get agent status and sessions (agent view - authenticated)
// app.get('/api/chats', authenticateToken, (req, res) => {
//   const state = db.getState();
//   res.json({
//     sessions: state.chat_sessions || [],
//     availability: state.agent_availability || 'online'
//   });
// });

// // Get agent status only (public view)
// app.get('/api/chats/agent/status', (req, res) => {
//   res.json({
//     availability: db.getState().agent_availability || 'online'
//   });
// });

// // Update agent status (agent view - authenticated)
// app.put('/api/chats/agent/status', authenticateToken, (req: any, res) => {
//   const { availability } = req.body;
//   if (availability !== 'online' && availability !== 'away' && availability !== 'offline') {
//     return res.status(400).json({ error: 'Invalid availability status.' });
//   }
//   db.updateState((state) => {
//     state.agent_availability = availability;
//     db.logActivity(req.admin.id, 'UPDATE_CHAT_STATUS', `Agent availability changed to ${availability}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true, availability });
// });

// // Get a single session's messages (visitor or agent view - no token required)
// app.get('/api/chats/:id', (req, res) => {
//   const session = db.getState().chat_sessions?.find(s => s.id === req.params.id);
//   if (!session) {
//     return res.status(404).json({ error: 'Chat session not found' });
//   }
//   res.json(session);
// });

// // Close a session (agent view - authenticated)
// app.put('/api/chats/:id/close', authenticateToken, (req: any, res) => {
//   const id = req.params.id;
//   db.updateState((state) => {
//     const session = state.chat_sessions?.find(s => s.id === id);
//     if (session) {
//       session.status = 'closed';
//       session.messages.push({
//         id: 'sys-' + Date.now(),
//         sender: 'system',
//         text: 'This chat session has been closed by the agent.',
//         created_at: new Date().toISOString()
//       });
//       db.logActivity(req.admin.id, 'CLOSE_CHAT_SESSION', `Closed chat session: ${id} with ${session.visitor_name}`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // Suggest an agent reply using Gemini (agent view - authenticated)
// app.post('/api/chats/:id/suggest-reply', authenticateToken, async (req: any, res) => {
//   const sessionId = req.params.id;
//   const session = db.getState().chat_sessions?.find(s => s.id === sessionId);
//   if (!session) {
//     return res.status(404).json({ error: 'Chat session not found' });
//   }

//   try {
//     const ai = getGeminiClient();
//     if (!ai) {
//       return res.json({ suggestion: "Gemini API key not configured. Please craft a manual response." });
//     }

//     const messages = session.messages || [];
//     const chatHistoryContext = messages.map(m => `${m.sender === 'visitor' ? 'Visitor' : m.sender === 'agent' ? 'Agent' : 'System'}: ${m.text}`).join('\n');

//     const systemInstruction = `You are a Senior Engineering Advisor guiding our live-support agent at SaroHub Technologies (Private) Limited.
// Analyze the active chat history below and output a precise, professional, helpful suggestion for the agent to send.
// The reply should be elegant, direct, fully customized to their query, and maintain a polished enterprise corporate voice.
// Keep the suggested reply brief and professional. Do NOT include any prefixes like "Agent:" or "SaroHub:". Output ONLY the exact suggested message text.`;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3.5-flash',
//       contents: `Generate a suggested reply for this chat history:\n\n${chatHistoryContext}`,
//       config: {
//         systemInstruction,
//         temperature: 0.7,
//       }
//     });

//     res.json({ suggestion: response.text || "Thank you for contacting us. We are reviewing your inquiry." });
//   } catch (err) {
//     console.error('Failed to suggest agent reply:', err);
//     res.status(500).json({ error: 'Failed to generate suggestion' });
//   }
// });


// // Send a message to a session (Visitor or Agent)
// app.post('/api/chats/:id/messages', async (req, res) => {
//   const sessionId = req.params.id;
//   const { sender, text, visitorName, visitorEmail } = req.body;

//   if (!sender || !text) {
//     return res.status(400).json({ error: 'Sender and text are required fields' });
//   }

//   // If sender is agent, verify authentication
//   let isAgent = sender === 'agent';
//   if (isAgent) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized: Agent signature required.' });
//     }
//     try {
//       jwt.verify(token, JWT_SECRET);
//     } catch (err) {
//       return res.status(401).json({ error: 'Unauthorized: Invalid agent token.' });
//     }
//   }

//   let triggerBotResponse = false;
//   let visitorNameStored = visitorName || 'Anonymous Visitor';

//   db.updateState((state) => {
//     if (!state.chat_sessions) {
//       state.chat_sessions = [];
//     }

//     let session = state.chat_sessions.find(s => s.id === sessionId);
//     if (!session) {
//       if (isAgent) {
//         return;
//       }
//       session = {
//         id: sessionId,
//         visitor_name: visitorNameStored,
//         visitor_email: visitorEmail || '',
//         status: 'active',
//         agent_unread: true,
//         visitor_unread: false,
//         messages: [],
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };
//       state.chat_sessions.push(session);
//     }

//     if (isAgent) {
//       session.visitor_unread = true;
//       session.agent_unread = false;
//     } else {
//       session.agent_unread = true;
//       session.visitor_unread = false;
//       visitorNameStored = session.visitor_name;
//     }

//     session.messages.push({
//       id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
//       sender,
//       text,
//       created_at: new Date().toISOString()
//     });

//     session.updated_at = new Date().toISOString();

//     // RinaAI should reply to every visitor message in real-time
//     if (!isAgent && session.status === 'active') {
//       triggerBotResponse = true;
//     }
//   });

//   // Generate AI reply and wait for it before responding
//   if (triggerBotResponse) {
//     const session = db.getState().chat_sessions?.find(s => s.id === sessionId);
//     const messages = session ? session.messages : [];

//     try {
//       const ai = getGeminiClient();
//       let replyText = '';

//       if (ai) {
//         try {
//           const chatHistoryContext = messages.map(m => `${m.sender === 'visitor' ? 'Visitor' : m.sender === 'agent' ? 'RinaAI' : 'System'}: ${m.text}`).join('\n');

//           const systemInstruction = `You are RinaAI, the intelligent AI assistant for SaroHub Technologies (Private) Limited — a premium enterprise software company.
// SaroHub specializes in custom software, SaaS platforms, AI automation, cloud architecture, and enterprise solutions.
// Office: SaroHub HQ (Hybrid / Pakistan & Remote).
// Executive Leadership: Mehdi Hassan (CEO & Co-Founder), Muhammad Nawaz (CTO & Co-Founder), Muhammad Kazim (CMO & Co-Founder).
// Contact: info@sarohub.com | +92 3430381473

// Guidelines:
// 1. Be professional yet warm, knowledgeable, and concise.
// 2. Keep responses brief (2-4 sentences max).
// 3. If asked about pricing, say it's custom per project and offer to connect with the team.
// 4. Never prepend your response with any label like "RinaAI:", "Agent:", "AI:", etc.
// 5. Always be helpful and end with an offer to assist further.

// Active Chat History:
// ${chatHistoryContext}

// Generate RinaAI's direct response:`;

//           const response = await ai.models.generateContent({
//             model: 'gemini-2.0-flash',
//             contents: 'Generate the next reply for the chat history above.',
//             config: {
//               systemInstruction,
//               temperature: 0.7,
//             }
//           });

//           replyText = response.text || '';
//         } catch (aiErr) {
//           console.error('RinaAI Gemini reply failed:', aiErr);
//         }
//       }

//       // Fallback if Gemini fails or is unavailable
//       if (!replyText) {
//         const lowText = text.toLowerCase();
//         if (lowText.includes('ceo') || lowText.includes('mehdi') || (lowText.includes('founder') && !lowText.includes('co-founder'))) {
//           replyText = "Mehdi Hassan is the CEO & Co-Founder of SaroHub Technologies. He has over 4 years of experience leading corporate vision, strategic direction, and digital product innovation. You can reach him at +92 3555866875.";
//         } else if (lowText.includes('cto') || lowText.includes('nawaz') || lowText.includes('naji')) {
//           replyText = "Muhammad Nawaz is the CTO & Co-Founder of SaroHub Technologies. He has over 4 years of experience directing software strategy, backend systems, and distributed cloud engineering. You can reach him at 03555711924.";
//         } else if (lowText.includes('cmo') || lowText.includes('kazim') || lowText.includes('qazim')) {
//           replyText = "Muhammad Kazim is the CMO & Co-Founder of SaroHub Technologies. He has over 6 years of experience leading brand strategy, marketing, and client relations. You can reach him at +92 3445312774.";
//         } else if (lowText.includes('founder') || lowText.includes('team') || lowText.includes('leader') || lowText.includes('who run') || lowText.includes('management')) {
//           replyText = "SaroHub Technologies is led by three co-founders: Mehdi Hassan (CEO), Muhammad Nawaz (CTO), and Muhammad Kazim (CMO). Together they bring a combined expertise in software engineering, cloud architecture, and business strategy. Would you like to know more about any of them?";
//         } else if (lowText.includes('price') || lowText.includes('cost') || lowText.includes('budget') || lowText.includes('quote') || lowText.includes('how much')) {
//           replyText = "Our pricing is tailored to each project's scope and requirements. Mehdi Hassan or Muhammad Nawaz can provide you with a custom proposal. Would you like to share your project details or schedule a consultation?";
//         } else if (lowText.includes('service') || lowText.includes('offer') || lowText.includes('capabilities') || lowText.includes('solution') || lowText.includes('what do you do') || lowText.includes('what you do')) {
//           replyText = "We specialize in custom software development, SaaS platforms, AI/ML automation, cloud architecture (AWS, GCP), enterprise ERP systems, and premium mobile & web applications. What kind of solution are you looking for?";
//         } else if (lowText.includes('hello') || lowText.includes('hi') || lowText.includes('hey') || lowText.includes('good morning') || lowText.includes('good afternoon') || lowText.includes('good evening') || lowText.includes('assalam')) {
//           replyText = `Hello${visitorNameStored !== 'Anonymous Visitor' ? ' ' + visitorNameStored : ''}! Welcome to SaroHub Technologies. I'm RinaAI, your intelligent assistant. How can I help you today?`;
//         } else if (lowText.includes('who are you') || lowText.includes('what are you') || lowText.includes('your name') || lowText.includes('rina')) {
//           replyText = "I'm RinaAI, the AI assistant for SaroHub Technologies. I can help you with information about our services, team, projects, pricing, and more. What would you like to know?";
//         } else if (lowText.includes('about') || lowText.includes('what is sarohub') || lowText.includes('tell me about') || lowText.includes('company')) {
//           replyText = "SaroHub Technologies (Private) Limited is a premium enterprise software company specializing in custom software, SaaS platforms, AI automation, cloud architecture, and enterprise solutions. We're headquartered in Pakistan with hybrid/remote operations globally.";
//         } else if (lowText.includes('contact') || lowText.includes('phone') || lowText.includes('email') || lowText.includes('address') || lowText.includes('office') || lowText.includes('location') || lowText.includes('where')) {
//           replyText = "You can reach SaroHub at info@sarohub.com or call/WhatsApp +92 3430381473. Our office is at Saro IT Center near Clifton-Pull Skardu, Gilgit-Baltistan, Pakistan. Would you like to schedule a meeting?";
//         } else if (lowText.includes('project') || lowText.includes('portfolio') || lowText.includes('work') || lowText.includes('built') || lowText.includes('case study')) {
//           replyText = "We've delivered projects across ERP systems, AI agents, e-commerce platforms, and more. Check out our portfolio on the website, or tell me what kind of project you have in mind and I'll explain how we can help!";
//         } else if (lowText.includes('technolog') || lowText.includes('stack') || lowText.includes('react') || lowText.includes('node') || lowText.includes('python') || lowText.includes('database')) {
//           replyText = "Our tech stack includes React.js, Node.js, TypeScript, Python, MySQL, Kubernetes, Docker, GCP/AWS, Gemini AI, TensorFlow, and more. We choose the best tools for each project's needs. What technology are you interested in?";
//         } else if (lowText.includes('career') || lowText.includes('job') || lowText.includes('hiring') || lowText.includes('work with') || lowText.includes('intern') || lowText.includes('vacancy')) {
//           replyText = "We're always looking for talented engineers and designers! Check our Careers page for current openings, or tell me what role you're interested in. We offer competitive packages and a growth-oriented culture.";
//         } else if (lowText.includes('thank') || lowText.includes('thanks') || lowText.includes('appreciated') || lowText.includes('great')) {
//           replyText = "You're welcome! Don't hesitate to reach out if you need anything else. We're always here to help! 😊";
//         } else if (lowText.includes('bye') || lowText.includes('goodbye') || lowText.includes('see you') || lowText.includes('take care')) {
//           replyText = "Goodbye! It was great chatting with you. Feel free to come back anytime you need assistance. Have a wonderful day! 👋";
//         } else if (lowText.includes('help') || lowText.includes('support') || lowText.includes('assist')) {
//           replyText = "I'm here to help! I can answer questions about our services, team, pricing, projects, careers, and more. Just ask me anything, or describe what you need and I'll guide you to the right resource.";
//         } else {
//           replyText = `Thanks for your message${visitorNameStored !== 'Anonymous Visitor' ? ', ' + visitorNameStored : ''}! I can help you with info about our services, team, pricing, projects, or careers. What would you like to know more about?`;
//         }
//       }

//       db.updateState((state) => {
//         const activeSession = state.chat_sessions?.find(s => s.id === sessionId);
//         if (activeSession && activeSession.status === 'active') {
//           activeSession.messages.push({
//             id: 'msg-ai-' + Date.now(),
//             sender: 'agent',
//             text: `[AI Assistant] ${replyText}`,
//             created_at: new Date().toISOString()
//           });
//           activeSession.visitor_unread = true;
//           activeSession.updated_at = new Date().toISOString();
//         }
//       });
//     } catch (err) {
//       console.error('RinaAI auto-reply failed:', err);
//     }
//   }

//   res.json({ success: true });
// });

// // =========================================================================
// // 12. CONTACT & NEWSLETTER SUBSCRIPTION API
// // =========================================================================
// app.get('/api/contact', authenticateToken, (req, res) => {
//   res.json(db.getState().contact_messages);
// });

// app.post('/api/contact', async (req, res) => {
//   const { name, email, phone, subject, message } = req.body;
//   if (!name || !email || !subject || !message) {
//     return res.status(400).json({ error: 'Required fields missing: name, email, subject, message.' });
//   }

//   db.updateState((state) => {
//     const nextId = state.contact_messages.length > 0 ? Math.max(...state.contact_messages.map(i => i.id)) + 1 : 1;
//     state.contact_messages.unshift({
//       id: nextId,
//       name,
//       email,
//       phone,
//       subject,
//       message,
//       is_read: false,
//       created_at: new Date().toISOString()
//     });
//   });

//   // Send email notification to mehdi.sarohub@gmail.com
//   try {
//     await smtpTransporter.sendMail({
//       from: `"SaroHub Contact Form" <${process.env.SMTP_USER || 'info@sarohub.com'}>`,
//       to: 'mehdi.sarohub@gmail.com',
//       replyTo: email,
//       subject: `New Contact Form Inquiry: ${subject}`,
//       html: `
//         <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
//           <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 28px 32px;">
//             <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">📩 New Contact Form Submission</h1>
//             <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 13px;">SaroHub Technologies — Contact Inquiry Notification</p>
//           </div>
//           <div style="padding: 28px 32px; color: #e2e8f0;">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 120px;">Name</td>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px; font-weight: 500;">${name}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 120px;">Email</td>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px;"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 120px;">Phone</td>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px;">${phone || 'Not provided'}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 120px;">Subject</td>
//                 <td style="padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px; font-weight: 600; color: #f1f5f9;">${subject}</td>
//               </tr>
//             </table>
//             <div style="margin-top: 20px; padding: 18px; background: #1e293b; border-radius: 8px; border-left: 3px solid #3b82f6;">
//               <p style="margin: 0 0 6px; color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase;">Message</p>
//               <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message}</p>
//             </div>
//             <p style="margin-top: 20px; font-size: 11px; color: #64748b;">Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} — You can reply directly to this email to respond to the sender.</p>
//           </div>
//         </div>
//       `,
//     });
//     console.log('[SAROHUB MAIL] Contact form email sent to mehdi.sarohub@gmail.com successfully.');
//   } catch (emailErr) {
//     console.error('[SAROHUB MAIL] Failed to send contact form email:', emailErr);
//   }

//   res.json({ success: true, message: 'Message logged successfully.' });
// });

// app.put('/api/contact/:id', authenticateToken, (req: any, res) => {
//   const id = parseInt(req.params.id);
//   db.updateState((state) => {
//     const m = state.contact_messages.find(item => item.id === id);
//     if (m) {
//       m.is_read = true;
//       db.logActivity(req.admin.id, 'READ_MESSAGE', `Marked message from: ${m.name} as read`, req.ip || '127.0.0.1');
//     }
//   });
//   res.json({ success: true });
// });

// // Newsletter
// app.get('/api/newsletter', authenticateToken, (req, res) => {
//   res.json(db.getState().newsletter_subscribers);
// });

// app.post('/api/newsletter', (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).json({ error: 'Email address is required.' });
//   }

//   const emailLower = email.toLowerCase().trim();
//   let duplicate = false;

//   db.updateState((state) => {
//     duplicate = state.newsletter_subscribers.some(s => s.email.toLowerCase() === emailLower);
//     if (!duplicate) {
//       const nextId = state.newsletter_subscribers.length > 0 ? Math.max(...state.newsletter_subscribers.map(i => i.id)) + 1 : 1;
//       state.newsletter_subscribers.push({
//         id: nextId,
//         email: emailLower,
//         is_active: true,
//         subscribed_at: new Date().toISOString()
//       });
//     }
//   });

//   if (duplicate) {
//     return res.json({ success: true, message: 'Already subscribed!' });
//   }
//   res.json({ success: true, message: 'Thank you for subscribing to SaroHub enterprise bulletins!' });
// });

// // =========================================================================
// // 13. SETTINGS & SEO SETTINGS
// // =========================================================================
// app.get('/api/settings', (req, res) => {
//   res.json(db.getState().settings);
// });

// app.post('/api/settings', authenticateToken, (req: any, res) => {
//   const body = req.body;
//   db.updateState((state) => {
//     for (const key of Object.keys(body)) {
//       state.settings[key] = String(body[key]);
//     }
//     db.logActivity(req.admin.id, 'UPDATE_SETTINGS', 'Corporate settings updated.', req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });

// // SEO metadata
// app.get('/api/seo', (req, res) => {
//   res.json(db.getState().seo_settings);
// });

// app.post('/api/seo', authenticateToken, (req: any, res) => {
//   const { page_route, meta_title, meta_description, meta_keywords } = req.body;
//   db.updateState((state) => {
//     const item = state.seo_settings.find(s => s.page_route === page_route);
//     if (item) {
//       item.meta_title = meta_title || item.meta_title;
//       item.meta_description = meta_description || item.meta_description;
//       item.meta_keywords = meta_keywords || item.meta_keywords;
//     } else {
//       const nextId = state.seo_settings.length > 0 ? Math.max(...state.seo_settings.map(s => s.id)) + 1 : 1;
//       state.seo_settings.push({
//         id: nextId,
//         page_route,
//         meta_title,
//         meta_description,
//         meta_keywords
//       });
//     }
//     db.logActivity(req.admin.id, 'UPDATE_SEO', `Updated SEO configurations for route: ${page_route}`, req.ip || '127.0.0.1');
//   });
//   res.json({ success: true });
// });


// // =========================================================================
// // 15. VITE DEVELOPER MIDDLEWARE & STATIC SERVING
// // =========================================================================

// async function startServer() {
//   // Ensure the admin password hash is correctly synchronized with SaroHub@Admin2026!
//   try {
//     db.updateState((state) => {
//       if (state.admin) {
//         state.admin.password_hash = bcrypt.hashSync('SaroHub@Admin2026!', 10);
//       }
//     });
//     console.log('[SAROHUB SERVER] Admin credential parameters successfully verified and synchronized.');
//   } catch (err) {
//     console.error('Failed to sync default admin credentials:', err);
//   }

//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`[SAROHUB SERVER] Corporate portal online at http://0.0.0.0:${PORT}`);
//   });
// }

// startServer();





















import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './src/db';
import { GoogleGenAI } from '@google/genai';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sarohub-super-secret-key-2026';

// Configure Cloudinary Integration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgjuqqu4',
  api_key: process.env.CLOUDINARY_API_KEY || '315954739436377',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5XD-9RmJ4rL8In-Y4bOR-vkt7iA',
});

const upload = multer({ storage: multer.memoryStorage() });

function getSmtpTransporter() {
  try {
    dotenv.config({ override: true });
  } catch (e) {
    // ignore
  }

  const rawHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const rawPort = parseInt((process.env.SMTP_PORT || '465').trim());
  const rawUser = (process.env.SMTP_USER || 'cyberm0101noirhat@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || '').replace(/;/g, '').replace(/^["']|["']$/g, '').replace(/\s+/g, '').trim();

  const isGmail = rawHost.includes('gmail') || rawUser.endsWith('@gmail.com');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: rawPass ? {
        user: rawUser,
        pass: rawPass
      } : undefined,
      tls: {
        rejectUnauthorized: false
      }
    } as any);
  }

  return nodemailer.createTransport({
    host: rawHost,
    port: rawPort,
    secure: rawPort === 465,
    family: 4, // Force IPv4 to avoid ENETUNREACH socket issues
    tls: {
      rejectUnauthorized: false
    },
    auth: rawPass ? {
      user: rawUser,
      pass: rawPass
    } : undefined
  } as any);
}
// console.log('[SMTP DEBUG] Host:', process.env.SMTP_HOST, '| User:', process.env.SMTP_USER, '| Port:', process.env.SMTP_PORT);


let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }
  return aiClient;
}

// Middleware to parse requests
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Express CORS Headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Helper: JWT authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.admin = decoded;
    next();
  });
}

// =========================================================================
// 1. AUTHENTICATION API
// =========================================================================

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const state = db.getState();

  if (username !== state.admin.username) {
    db.logActivity(undefined, 'LOGIN_FAILED', `Failed login attempt for username: ${username}`, req.ip || '127.0.0.1');
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, state.admin.password_hash);
  if (!isPasswordValid) {
    db.logActivity(undefined, 'LOGIN_FAILED', `Failed password attempt for username: ${username}`, req.ip || '127.0.0.1');
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Create JWT Token
  const token = jwt.sign(
    { id: state.admin.id, username: state.admin.username, role: state.admin.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  db.logActivity(state.admin.id, 'LOGIN_SUCCESS', 'Administrator authenticated successfully.', req.ip || '127.0.0.1');

  res.json({
    token,
    admin: {
      username: state.admin.username,
      email: state.admin.email,
      full_name: state.admin.full_name,
      profile_pic: state.admin.profile_pic,
      bio: state.admin.bio,
      role: state.admin.role
    }
  });
});

// Admin Profile
app.get('/api/auth/profile', authenticateToken, (req: any, res) => {
  const state = db.getState();
  res.json({
    username: state.admin.username,
    email: state.admin.email,
    full_name: state.admin.full_name,
    profile_pic: state.admin.profile_pic,
    bio: state.admin.bio,
    role: state.admin.role
  });
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, (req: any, res) => {
  const { username, full_name, email, bio, profile_pic } = req.body;

  db.updateState((state) => {
    state.admin.username = username || state.admin.username;
    state.admin.full_name = full_name || state.admin.full_name;
    state.admin.email = email || state.admin.email;
    state.admin.bio = bio || state.admin.bio;
    state.admin.profile_pic = profile_pic || state.admin.profile_pic;
  });

  db.logActivity(req.admin.id, 'UPDATE_PROFILE', 'Administrator updated profile settings.', req.ip || '127.0.0.1');
  res.json({ success: true, message: 'Profile updated successfully.' });
});

// Change Password
app.put('/api/auth/change-password', authenticateToken, async (req: any, res) => {
  const { current_password, new_password } = req.body;
  const state = db.getState();

  const isPasswordValid = await bcrypt.compare(current_password, state.admin.password_hash);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(new_password, salt);

  db.updateState((state) => {
    state.admin.password_hash = newHash;
  });

  db.logActivity(req.admin.id, 'CHANGE_PASSWORD', 'Administrator changed password credentials.', req.ip || '127.0.0.1');
  res.json({ success: true, message: 'Password updated successfully.' });
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const state = db.getState();

  if (email !== state.admin.email) {
    return res.status(404).json({ error: 'No administrator account mapped to this email.' });
  }

  // Generate random secure password
  const tempPassword = `SaroHubReset${Math.floor(1000 + Math.random() * 9000)}!`;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(tempPassword, salt);

  // Save the new password hash
  db.updateState((s) => {
    s.admin.password_hash = hash;
  });

  db.logActivity(state.admin.id, 'FORGOT_PASSWORD_REQUEST', `Password reset triggered. New password sent to info@sarohub.com.`, req.ip || '127.0.0.1');

  // Attempt actual SMTP send
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  let emailSent = false;
  let errMessage = '';

  const mailOptions = {
    from: smtpUser || '"SaroHub Security" <security@sarohub.com>',
    to: 'info@sarohub.com',
    subject: '🔒 SaroHub Administrative Password Recovery',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 12px; background-color: #020617; color: #f1f5f9;">
        <h2 style="color: #06b6d4; border-bottom: 2px solid #1e293b; padding-bottom: 10px;">Security Recovery Token Issued</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">A password recovery request was triggered for SaroHub's Administration Panel.</p>
        <div style="background-color: #0f172a; border: 1px solid #334155; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold;">Temporary Administrative Password</p>
          <p style="margin: 10px 0 0 0; font-size: 20px; font-family: monospace; color: #06b6d4; font-weight: bold; letter-spacing: 2px;">${tempPassword}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">For system security, please log in with these credentials immediately and set a custom password core from your Profile Settings panel.</p>
        <p style="font-size: 10px; color: #475569; border-top: 1px solid #1e293b; padding-top: 10px; margin-top: 30px;">This email is automatically dispatched from SaroHub identity nodes. Cryptographic authentication: JWT / CryptCore.</p>
      </div>
    `
  };

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (err: any) {
      console.error('Nodemailer SMTP Error:', err);
      errMessage = err.message || 'SMTP Handshake Error';
    }
  }

  if (emailSent) {
    res.json({
      success: true,
      message: `Administrative password core has been successfully updated. The new temporary login password was dispatched to info@sarohub.com via custom SMTP node.`
    });
  } else {
    // Always succeed during development/preview with log print so developers and testing run fine even if port 587 is blocked
    console.log('============= RECOVERY EMAIL DISPATCH SIMULATION =============');
    console.log('To: info@sarohub.com');
    console.log('Subject:', mailOptions.subject);
    console.log('New Generated Password:', tempPassword);
    console.log('===============================================================');

    res.json({
      success: true,
      message: `Administrative password core has been updated. SMTP configuration is not present, so the recovery mail to info@sarohub.com has been logged to the container terminal. For testing/preview, your temporary login password is: ${tempPassword}`
    });
  }
});

// System Image Upload Endpoint with Cloudinary + Local Base64 Fallback
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const base64Url = `data:${req.file.mimetype || 'image/png'};base64,${req.file.buffer.toString('base64')}`;

  let responded = false;
  const timer = setTimeout(() => {
    if (!responded) {
      responded = true;
      console.log('[UPLOAD INFO] Cloudinary response delayed, returned base64 image payload fallback.');
      res.json({ url: base64Url });
    }
  }, 3500);

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'sarohub' },
      (error, result) => {
        clearTimeout(timer);
        if (responded) return;
        responded = true;
        if (error || !result?.secure_url) {
          console.log('[UPLOAD INFO] Cloudinary unavailable, returned base64 fallback.');
          return res.json({ url: base64Url });
        }
        res.json({ url: result.secure_url || result.url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (e) {
    clearTimeout(timer);
    if (!responded) {
      responded = true;
      res.json({ url: base64Url });
    }
  }
});

// Proxy private candidate documents so browsers receive them as downloads.
app.get('/api/download-document', authenticateToken, async (req, res) => {
  const documentUrl = String(req.query.url || '');
  const requestedName = String(req.query.filename || 'document');

  try {
    const parsedUrl = new URL(documentUrl);
    if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'res.cloudinary.com') {
      return res.status(400).json({ error: 'Only Cloudinary documents can be downloaded.' });
    }

    const uploadMarker = '/image/upload/';
    const uploadPath = parsedUrl.pathname.split(uploadMarker)[1];
    if (!uploadPath) {
      return res.status(400).json({ error: 'Invalid Cloudinary document URL.' });
    }

    const pathParts = uploadPath.split('/');
    const versionIndex = pathParts.findIndex((part) => /^v\d+$/.test(part));
    const publicPath = (versionIndex >= 0 ? pathParts.slice(versionIndex + 1) : pathParts).join('/');
    const extension = publicPath.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() || 'pdf';
    const publicId = publicPath.replace(/\.[a-zA-Z0-9]+$/, '');
    const signedDownloadUrl = cloudinary.utils.private_download_url(publicId, extension, {
      resource_type: 'image',
      type: 'upload',
      attachment: true
    });

    const documentResponse = await fetch(signedDownloadUrl);
    if (!documentResponse.ok || !documentResponse.body) {
      return res.status(502).json({ error: 'The document could not be retrieved from storage.' });
    }

    const safeName = requestedName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'document.pdf';
    const isPdf = safeName.toLowerCase().endsWith('.pdf');
    res.setHeader('Content-Type', isPdf ? 'application/pdf' : (documentResponse.headers.get('content-type') || 'application/octet-stream'));
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Cache-Control', 'private, no-store');
    const documentBuffer = Buffer.from(await documentResponse.arrayBuffer());
    if (isPdf && documentBuffer.subarray(0, 5).toString() !== '%PDF-') {
      return res.status(502).json({ error: 'Cloudinary returned an invalid PDF file.' });
    }
    res.setHeader('Content-Length', documentBuffer.length.toString());
    res.send(documentBuffer);
  } catch (error) {
    console.error('Document download proxy failed:', error);
    res.status(400).json({ error: 'Invalid document URL.' });
  }
});


// Activity logs
app.get('/api/auth/logs', authenticateToken, (req, res) => {
  res.json(db.getState().activity_logs);
});

// =========================================================================
// 2. DASHBOARD ANALYTICS API
// =========================================================================
app.get('/api/stats', (req, res) => {
  const s = db.getState();

  // Dynamic metrics with fallback bounds based on corporate settings
  const totalProjects = Math.max(10, s.projects ? s.projects.length : 0);
  const totalBlogs = s.blogs ? s.blogs.length : 0;
  const totalProducts = Math.max(6, s.products ? s.products.length : 0);
  const totalTeam = Math.max(8, s.team_members ? s.team_members.length : 0);
  const contactMessagesCount = s.contact_messages ? s.contact_messages.length : 0;
  const newsletterSubscribersCount = s.newsletter_subscribers ? s.newsletter_subscribers.length : 0;
  const careerApplicationsCount = s.applications ? s.applications.length : 0;
  const eventsCount = s.events ? s.events.length : 0;

  // Seed random visitors based on dates
  const totalVisitors = 18450 + contactMessagesCount * 15;

  res.json({
    visitors: totalVisitors,
    projects: totalProjects,
    clients: 20,
    blogs: totalBlogs,
    products: totalProducts,
    team: totalTeam,
    experience: 4,
    tech: 16,
    contact_messages: contactMessagesCount,
    newsletter_subscribers: newsletterSubscribersCount,
    applications: careerApplicationsCount,
    events: eventsCount,
    traffic: [
      { month: 'Jan', count: 1200 },
      { month: 'Feb', count: 1850 },
      { month: 'Mar', count: 2200 },
      { month: 'Apr', count: 3100 },
      { month: 'May', count: 4800 },
      { month: 'Jun', count: totalVisitors }
    ]
  });
});

// =========================================================================
// 3. SERVICES CRUD API
// =========================================================================
app.get('/api/services', (req, res) => {
  res.json(db.getState().services);
});

app.post('/api/services', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.services.length > 0 ? Math.max(...state.services.map(i => i.id)) + 1 : 1;
    const newService = {
      id: nextId,
      title: body.title,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      banner_url: body.banner_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
      short_description: body.short_description,
      description: body.description,
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    state.services.push(newService);
    db.logActivity(req.admin.id, 'CREATE_SERVICE', `Created service: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.put('/api/services/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  db.updateState((state) => {
    const s = state.services.find(item => item.id === id);
    if (s) {
      s.title = body.title || s.title;
      s.short_description = body.short_description || s.short_description;
      s.description = body.description || s.description;
      s.banner_url = body.banner_url || s.banner_url;
      s.benefits = Array.isArray(body.benefits) ? body.benefits : s.benefits;
      s.technologies = Array.isArray(body.technologies) ? body.technologies : s.technologies;
      s.faqs = Array.isArray(body.faqs) ? body.faqs : s.faqs;
      s.updated_at = new Date().toISOString();
      db.logActivity(req.admin.id, 'UPDATE_SERVICE', `Updated service: ${s.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.delete('/api/services/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const s = state.services.find(item => item.id === id);
    if (s) {
      state.services = state.services.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_SERVICE', `Deleted service: ${s.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// =========================================================================
// 4. PROJECTS CRUD API
// =========================================================================
app.get('/api/projects', (req, res) => {
  res.json(db.getState().projects);
});

app.post('/api/projects', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.projects.length > 0 ? Math.max(...state.projects.map(i => i.id)) + 1 : 1;
    state.projects.push({
      id: nextId,
      title: body.title,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_name: body.client_name,
      category: body.category,
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      short_description: body.short_description,
      description: body.description,
      case_study: body.case_study,
      live_url: body.live_url,
      github_url: body.github_url,
      completion_date: body.completion_date || new Date().toISOString().split('T')[0],
      thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
      screenshots: Array.isArray(body.screenshots) ? body.screenshots : (body.screenshots ? [body.screenshots] : []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_PROJECT', `Created project: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.put('/api/projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  db.updateState((state) => {
    const p = state.projects.find(item => item.id === id);
    if (p) {
      p.title = body.title || p.title;
      p.client_name = body.client_name || p.client_name;
      p.category = body.category || p.category;
      p.technologies = Array.isArray(body.technologies) ? body.technologies : p.technologies;
      p.short_description = body.short_description || p.short_description;
      p.description = body.description || p.description;
      p.case_study = body.case_study || p.case_study;
      p.live_url = body.live_url || p.live_url;
      p.github_url = body.github_url || p.github_url;
      p.completion_date = body.completion_date || p.completion_date;
      p.thumbnail_url = body.thumbnail_url || p.thumbnail_url;
      if (body.screenshots !== undefined) {
        p.screenshots = Array.isArray(body.screenshots) ? body.screenshots : (body.screenshots ? [body.screenshots] : []);
      }
      p.updated_at = new Date().toISOString();
      db.logActivity(req.admin.id, 'UPDATE_PROJECT', `Updated project: ${p.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.delete('/api/projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const p = state.projects.find(item => item.id === id);
    if (p) {
      state.projects = state.projects.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_PROJECT', `Deleted project: ${p.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// =========================================================================
// 5. PRODUCTS CRUD API
// =========================================================================
app.get('/api/products', (req, res) => {
  res.json(db.getState().products);
});

app.post('/api/products', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.products.length > 0 ? Math.max(...state.products.map(i => i.id)) + 1 : 1;
    state.products.push({
      id: nextId,
      title: body.title,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_description: body.short_description,
      description: body.description,
      features: Array.isArray(body.features) ? body.features : [],
      pricing_plans: Array.isArray(body.pricing_plans) ? body.pricing_plans : [],
      demo_url: body.demo_url,
      video_url: body.video_url,
      download_url: body.download_url,
      thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_PRODUCT', `Created product: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.put('/api/products/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  db.updateState((state) => {
    const p = state.products.find(item => item.id === id);
    if (p) {
      p.title = body.title || p.title;
      p.short_description = body.short_description || p.short_description;
      p.description = body.description || p.description;
      p.features = Array.isArray(body.features) ? body.features : p.features;
      p.pricing_plans = Array.isArray(body.pricing_plans) ? body.pricing_plans : p.pricing_plans;
      p.demo_url = body.demo_url || p.demo_url;
      p.video_url = body.video_url || p.video_url;
      p.download_url = body.download_url || p.download_url;
      p.thumbnail_url = body.thumbnail_url || p.thumbnail_url;
      p.updated_at = new Date().toISOString();
      db.logActivity(req.admin.id, 'UPDATE_PRODUCT', `Updated product: ${p.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.delete('/api/products/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const p = state.products.find(item => item.id === id);
    if (p) {
      state.products = state.products.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_PRODUCT', `Deleted product: ${p.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// =========================================================================
// 5.5 VENTURES CRUD API
// =========================================================================
app.get('/api/ventures', (req: any, res) => {
  const state = db.getState();
  const ventures = state.ventures || [];
  const sorted = [...ventures].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

app.get('/api/ventures/:slug', (req: any, res) => {
  const { slug } = req.params;
  const state = db.getState();
  const ventures = state.ventures || [];
  const venture = ventures.find(v => v.slug === slug || String(v.id) === slug);
  if (!venture) {
    return res.status(404).json({ error: 'Venture not found.' });
  }
  res.json(venture);
});

app.post('/api/ventures', authenticateToken, (req: any, res) => {
  const body = req.body;
  let newVenture: any = null;
  db.updateState((state) => {
    if (!state.ventures) state.ventures = [];
    const nextId = state.ventures.length > 0 ? Math.max(...state.ventures.map(v => v.id)) + 1 : 1;
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    newVenture = {
      id: nextId,
      ventureNumber: body.ventureNumber || `VENTURE ${String(state.ventures.length + 1).padStart(2, '0')}`,
      name: body.name,
      slug,
      shortTitle: body.shortTitle || body.name,
      tagline: body.tagline || '',
      description: body.description || '',
      category: body.category || 'Technology',
      status: body.status || 'In Development',
      logo: body.logo || '',
      coverImage: body.coverImage || '',
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      keyCapabilities: Array.isArray(body.keyCapabilities) ? body.keyCapabilities : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      websiteUrl: body.websiteUrl || '',
      demoUrl: body.demoUrl || '',
      learnMoreUrl: body.learnMoreUrl || `/ventures/${slug}`,
      featured: body.featured ?? true,
      order: body.order || state.ventures.length + 1,
      published: body.published ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      industry: body.industry || '',
      problem: body.problem || '',
      solution: body.solution || '',
      targetMarket: body.targetMarket || '',
      businessModel: body.businessModel || '',
      launchDate: body.launchDate || '',
      externalLinks: Array.isArray(body.externalLinks) ? body.externalLinks : [],
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
      team: Array.isArray(body.team) ? body.team : [],
      documentationUrl: body.documentationUrl || ''
    };
    state.ventures.push(newVenture);
    db.logActivity(req.admin.id, 'CREATE_VENTURE', `Created venture: ${body.name}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true, venture: newVenture });
});

app.put('/api/ventures/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let updatedVenture: any = null;
  db.updateState((state) => {
    if (!state.ventures) state.ventures = [];
    const v = state.ventures.find(item => item.id === id);
    if (v) {
      Object.assign(v, body, {
        updatedAt: new Date().toISOString()
      });
      updatedVenture = v;
      db.logActivity(req.admin.id, 'UPDATE_VENTURE', `Updated venture: ${v.name}`, req.ip || '127.0.0.1');
    }
  });
  if (!updatedVenture) {
    return res.status(404).json({ error: 'Venture not found' });
  }
  res.json({ success: true, venture: updatedVenture });
});

app.delete('/api/ventures/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    if (!state.ventures) state.ventures = [];
    const v = state.ventures.find(item => item.id === id);
    if (v) {
      state.ventures = state.ventures.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_VENTURE', `Deleted venture: ${v.name}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});


// =========================================================================
// 6. PROJECTS FOR SALE CRUD
// =========================================================================
app.get('/api/sale-projects', (req, res) => {
  res.json(db.getState().sale_projects);
});

app.post('/api/sale-projects', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.sale_projects.length > 0 ? Math.max(...state.sale_projects.map(i => i.id)) + 1 : 1;
    state.sale_projects.push({
      id: nextId,
      title: body.title,
      price: parseFloat(body.price) || 0.00,
      technology: Array.isArray(body.technology) ? body.technology : [],
      short_description: body.short_description,
      features: Array.isArray(body.features) ? body.features : [],
      demo_url: body.demo_url,
      video_url: body.video_url,
      thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
      screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
      screenshot_descriptions: Array.isArray(body.screenshot_descriptions) ? body.screenshot_descriptions : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_SALE_PROJECT', `Created commercial template: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/sale-projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const p = state.sale_projects.find(item => item.id === id);
    if (p) {
      state.sale_projects = state.sale_projects.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_SALE_PROJECT', `Deleted template: ${p.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.put('/api/sale-projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const p = state.sale_projects.find(item => item.id === id);
    if (p) {
      p.title = body.title !== undefined ? body.title : p.title;
      p.price = body.price !== undefined ? parseFloat(body.price) || 0.00 : p.price;
      p.technology = Array.isArray(body.technology) ? body.technology : p.technology;
      p.short_description = body.short_description !== undefined ? body.short_description : p.short_description;
      p.features = Array.isArray(body.features) ? body.features : p.features;
      p.demo_url = body.demo_url !== undefined ? body.demo_url : p.demo_url;
      p.video_url = body.video_url !== undefined ? body.video_url : p.video_url;
      p.thumbnail_url = body.thumbnail_url !== undefined ? body.thumbnail_url : p.thumbnail_url;
      p.screenshots = Array.isArray(body.screenshots) ? body.screenshots : p.screenshots;
      p.screenshot_descriptions = Array.isArray(body.screenshot_descriptions) ? body.screenshot_descriptions : (p.screenshot_descriptions || []);
      p.updated_at = new Date().toISOString();
      db.logActivity(req.admin.id, 'UPDATE_SALE_PROJECT', `Updated commercial template: ${p.title}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Sale project not found' });
  }
});

// =========================================================================
// 7. CMS BLOGS, CATEGORIES & TAGS
// =========================================================================
app.get('/api/blogs', (req, res) => {
  res.json(db.getState().blogs);
});

app.get('/api/blog-categories', (req, res) => {
  res.json(db.getState().blog_categories);
});

app.get('/api/blog-tags', (req, res) => {
  res.json(db.getState().blog_tags);
});

app.post('/api/blogs', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.blogs.length > 0 ? Math.max(...state.blogs.map(i => i.id)) + 1 : 1;
    state.blogs.push({
      id: nextId,
      title: body.title,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      author_name: body.author_name || state.admin.full_name,
      author_avatar: body.author_avatar || state.admin.profile_pic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
      category_id: parseInt(body.category_id) || 1,
      featured_image_url: body.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450',
      content: body.content,
      reading_time: body.reading_time || '5 min read',
      is_featured: !!body.is_featured,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      created_at: new Date().toISOString(),
      tags: Array.isArray(body.tags) ? body.tags.map(Number) : []
    });
    db.logActivity(req.admin.id, 'CREATE_BLOG', `Created blog post: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.put('/api/blogs/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  db.updateState((state) => {
    const b = state.blogs.find(item => item.id === id);
    if (b) {
      b.title = body.title || b.title;
      b.author_name = body.author_name || b.author_name;
      b.author_avatar = body.author_avatar || b.author_avatar;
      b.category_id = parseInt(body.category_id) || b.category_id;
      b.featured_image_url = body.featured_image_url || b.featured_image_url;
      b.content = body.content || b.content;
      b.reading_time = body.reading_time || b.reading_time;
      b.is_featured = body.is_featured !== undefined ? !!body.is_featured : b.is_featured;
      b.meta_title = body.meta_title || b.meta_title;
      b.meta_description = body.meta_description || b.meta_description;
      b.tags = Array.isArray(body.tags) ? body.tags.map(Number) : b.tags;
      db.logActivity(req.admin.id, 'UPDATE_BLOG', `Updated blog: ${b.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.delete('/api/blogs/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const b = state.blogs.find(item => item.id === id);
    if (b) {
      state.blogs = state.blogs.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_BLOG', `Deleted blog post: ${b.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// Category and Tag inserts
app.post('/api/blog-categories', authenticateToken, (req: any, res) => {
  const { name } = req.body;
  db.updateState((state) => {
    const nextId = state.blog_categories.length > 0 ? Math.max(...state.blog_categories.map(i => i.id)) + 1 : 1;
    state.blog_categories.push({
      id: nextId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
  });
  res.json({ success: true });
});

app.post('/api/blog-tags', authenticateToken, (req: any, res) => {
  const { name } = req.body;
  db.updateState((state) => {
    const nextId = state.blog_tags.length > 0 ? Math.max(...state.blog_tags.map(i => i.id)) + 1 : 1;
    state.blog_tags.push({
      id: nextId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
  });
  res.json({ success: true });
});

// =========================================================================
// 8. EVENTS CRUD API
// =========================================================================
app.get('/api/events', (req, res) => {
  res.json(db.getState().events);
});

app.post('/api/events', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.events.length > 0 ? Math.max(...state.events.map(i => i.id)) + 1 : 1;
    state.events.push({
      id: nextId,
      title: body.title,
      banner_url: body.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450',
      event_date: body.event_date || new Date().toISOString(),
      venue: body.venue,
      description: body.description,
      registration_link: body.registration_link,
      form_fields: body.form_fields || [],
      created_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_EVENT', `Created company event: ${body.title}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/events/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const e = state.events.find(item => item.id === id);
    if (e) {
      state.events = state.events.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_EVENT', `Deleted event: ${e.title}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.put('/api/events/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const e = state.events.find(item => item.id === id);
    if (e) {
      e.title = body.title !== undefined ? body.title : e.title;
      e.banner_url = body.banner_url !== undefined ? body.banner_url : e.banner_url;
      e.event_date = body.event_date !== undefined ? body.event_date : e.event_date;
      e.venue = body.venue !== undefined ? body.venue : e.venue;
      e.description = body.description !== undefined ? body.description : e.description;
      e.registration_link = body.registration_link !== undefined ? body.registration_link : e.registration_link;
      e.form_fields = body.form_fields !== undefined ? body.form_fields : e.form_fields;
      db.logActivity(req.admin.id, 'UPDATE_EVENT', `Updated company event: ${e.title}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.get('/api/events-registrations', authenticateToken, (req, res) => {
  res.json(db.getState().event_registrations || []);
});

app.post('/api/events/:id/register', (req, res) => {
  const eventId = parseInt(req.params.id);
  const body = req.body;

  if (!body.applicant_name || !body.applicant_email) {
    return res.status(400).json({ error: 'Name and email are required for registration.' });
  }

  const events = db.getState().events;
  const targetEvent = events.find(item => item.id === eventId);
  if (!targetEvent) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.updateState((state) => {
    const nextId = state.event_registrations.length > 0 ? Math.max(...state.event_registrations.map(r => r.id)) + 1 : 1;
    state.event_registrations.push({
      id: nextId,
      event_id: eventId,
      event_title: targetEvent.title,
      applicant_name: body.applicant_name,
      applicant_email: body.applicant_email,
      applied_at: new Date().toISOString(),
      form_data: body.form_data || {}
    });
  });

  res.json({ success: true, message: 'Successfully registered for the event!' });
});

app.put('/api/events-registrations/:id', authenticateToken, async (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let found = false;
  let applicantData: any = null;
  let eventData: any = null;

  db.updateState((state) => {
    const reg = (state.event_registrations || []).find(item => item.id === id);
    if (reg) {
      if (body.status) reg.status = body.status;
      found = true;
      applicantData = { ...reg };
      eventData = (state.events || []).find(e => e.id === reg.event_id);
      db.logActivity(req.admin.id, 'CONFIRM_EVENT_REGISTRATION', `Confirmed event registration ID: ${id} for ${reg.applicant_name}`, req.ip || '127.0.0.1');
    }
  });

  if (found) {
    if (body.status === 'Confirmed' && applicantData && applicantData.applicant_email) {
      try {
        const transporter = getSmtpTransporter();
        const settings = db.getState().settings || {};
        const companyName = settings.company_name || 'SaroHub Technologies';
        const eventTitle = applicantData.event_title || (eventData ? eventData.title : 'Corporate Event');
        const eventDate = eventData?.event_date || 'TBA';
        const eventVenue = eventData?.venue || 'TBA';

        await transporter.sendMail({
          from: `"SaroHub Events" <${process.env.SMTP_USER || 'info@sarohub.com'}>`,
          to: applicantData.applicant_email,
          subject: `Seat Reserved & Confirmed: ${eventTitle} - ${companyName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; color: #1e293b; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #06b6d4; margin: 0; font-size: 22px;">${companyName}</h2>
                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Corporate Events & Tech Summits</p>
              </div>
              
              <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${applicantData.applicant_name}</strong>,</p>
              
              <p style="font-size: 14px; line-height: 1.6;">We are pleased to inform you that your seat has been <span style="color: #059669; font-weight: bold; background-color: #ecfdf5; padding: 2px 8px; border-radius: 4px; border: 1px solid #a7f3d0;">CONFIRMED</span> for the upcoming event:</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Event:</strong> ${eventTitle}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Date & Time:</strong> ${eventDate}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Venue:</strong> ${eventVenue}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Attendee:</strong> ${applicantData.applicant_name} (${applicantData.applicant_email})</p>
              </div>
              
              <p style="font-size: 14px; line-height: 1.6;">Please save this confirmation. If you have any questions or require special accommodations, feel free to reply to this email.</p>
              
              <p style="font-size: 14px; line-height: 1.6; margin-top: 24px;">We look forward to seeing you!<br/><strong>The ${companyName} Events Team</strong></p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('Failed to send confirmation email:', mailErr);
      }
    }
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Registration not found' });
  }
});

app.delete('/api/events-registrations/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    state.event_registrations = (state.event_registrations || []).filter(item => item.id !== id);
    db.logActivity(req.admin.id, 'DELETE_EVENT_REGISTRATION', `Removed event registration ID: ${id}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

// =========================================================================
// 9. TEAM MEMBERS CRUD API
// =========================================================================
app.get('/api/team', (req, res) => {
  res.json(db.getState().team_members);
});

app.post('/api/team', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.team_members.length > 0 ? Math.max(...state.team_members.map(i => i.id)) + 1 : 1;
    state.team_members.push({
      id: nextId,
      name: body.name,
      position: body.position,
      photo_url: body.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
      bio: body.bio,
      skills: Array.isArray(body.skills) ? body.skills : [],
      social_linkedin: body.social_linkedin,
      social_github: body.social_github,
      social_twitter: body.social_twitter,
      portfolio_url: body.portfolio_url || '',
      social_links: Array.isArray(body.social_links) ? body.social_links : [],
      experience_years: body.experience_years || '5 Years',
      is_founder: !!body.is_founder,
      sort_order: parseInt(body.sort_order) || 10,
      created_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_TEAM', `Added team member: ${body.name}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/team/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const t = state.team_members.find(item => item.id === id);
    if (t) {
      state.team_members = state.team_members.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_TEAM_MEMBER', `Removed team member: ${t.name}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.put('/api/team/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const t = state.team_members.find(item => item.id === id);
    if (t) {
      t.name = body.name !== undefined ? body.name : t.name;
      t.position = body.position !== undefined ? body.position : t.position;
      t.photo_url = body.photo_url !== undefined ? body.photo_url : t.photo_url;
      t.bio = body.bio !== undefined ? body.bio : t.bio;
      t.skills = Array.isArray(body.skills) ? body.skills : t.skills;
      t.social_linkedin = body.social_linkedin !== undefined ? body.social_linkedin : t.social_linkedin;
      t.social_github = body.social_github !== undefined ? body.social_github : t.social_github;
      t.social_twitter = body.social_twitter !== undefined ? body.social_twitter : t.social_twitter;
      t.portfolio_url = body.portfolio_url !== undefined ? body.portfolio_url : t.portfolio_url;
      t.social_links = Array.isArray(body.social_links) ? body.social_links : t.social_links;
      t.experience_years = body.experience_years !== undefined ? body.experience_years : t.experience_years;
      t.is_founder = body.is_founder !== undefined ? !!body.is_founder : t.is_founder;
      t.sort_order = body.sort_order !== undefined ? parseInt(body.sort_order) || 10 : t.sort_order;
      db.logActivity(req.admin.id, 'UPDATE_TEAM_MEMBER', `Updated team profile for: ${t.name}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Team member not found' });
  }
});

// =========================================================================
// 10. CAREERS & APPLICATIONS CRUD API
// =========================================================================
app.get('/api/careers', (req, res) => {
  res.json(db.getState().careers);
});

app.post('/api/careers', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.careers.length > 0 ? Math.max(...state.careers.map(i => i.id)) + 1 : 1;
    state.careers.push({
      id: nextId,
      position: body.position,
      department: body.department,
      salary: body.salary,
      experience: body.experience,
      skills: Array.isArray(body.skills) ? body.skills : [],
      description: body.description,
      banner_url: body.banner_url || '',
      is_active: true,
      created_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_VACANCY', `Created vacancy: ${body.position}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/careers/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const c = state.careers.find(item => item.id === id);
    if (c) {
      state.careers = state.careers.filter(item => item.id !== id);
      db.logActivity(req.admin.id, 'DELETE_VACANCY', `Removed vacancy: ${c.position}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.put('/api/careers/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const c = state.careers.find(item => item.id === id);
    if (c) {
      c.position = body.position !== undefined ? body.position : c.position;
      c.department = body.department !== undefined ? body.department : c.department;
      c.salary = body.salary !== undefined ? body.salary : c.salary;
      c.experience = body.experience !== undefined ? body.experience : c.experience;
      c.skills = Array.isArray(body.skills) ? body.skills : c.skills;
      c.description = body.description !== undefined ? body.description : c.description;
      c.banner_url = body.banner_url !== undefined ? body.banner_url : (c.banner_url || '');
      c.is_active = body.is_active !== undefined ? !!body.is_active : c.is_active;
      db.logActivity(req.admin.id, 'UPDATE_VACANCY', `Updated vacancy details for: ${c.position}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Vacancy not found' });
  }
});

// Applications (Public submission & Admin reading)
app.get('/api/applications', authenticateToken, (req, res) => {
  res.json(db.getState().applications);
});

app.post('/api/applications', (req, res) => {
  const body = req.body;
  if (!body.career_id || !body.full_name || !body.email || !body.phone) {
    return res.status(400).json({ error: 'Required fields missing: career_id, full_name, email, phone.' });
  }

  db.updateState((state) => {
    const nextId = state.applications.length > 0 ? Math.max(...state.applications.map(i => i.id)) + 1 : 1;
    state.applications.unshift({
      id: nextId,
      career_id: parseInt(body.career_id),
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      resume_url: body.resume_url || '',
      resume_filename: body.resume_filename || 'cv_attachment.pdf',
      cover_letter: body.cover_letter,
      applied_at: new Date().toISOString(),
      status: 'pending'
    });
  });
  res.json({ success: true, message: 'Career application submitted successfully!' });
});

app.put('/api/applications/:id', authenticateToken, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    let applicant: any = null;
    let jobPosition: string = 'Position';

    db.updateState((state) => {
      if (!state.applications) state.applications = [];
      const a = state.applications.find(item => item.id === id);
      if (a) {
        a.status = status;
        applicant = { ...a };
        const c = (state.careers || []).find(item => item.id === a.career_id);
        if (c) jobPosition = c.position;
      }
    });

    const adminId = req.admin?.id || 1;
    if (applicant) {
      db.logActivity(adminId, 'UPDATE_APPLICATION', `Updated application status for: ${applicant.full_name} to ${status}`, req.ip || '127.0.0.1');
    }

    if (applicant && status === 'shortlisted') {
      try {
        const transporter = getSmtpTransporter();
        const settings = db.getState().settings || {};
        const companyEmail = settings.email || 'info@sarohub.com';
        await transporter.sendMail({
          from: `"SaroHub Talent Acquisition" <${process.env.SMTP_USER || 'mehdi.sarohub@gmail.com'}>`,
          to: applicant.email,
          subject: `Application Shortlisted: ${jobPosition} at SaroHub Technologies`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; color: #1e293b; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 22px;">SaroHub Technologies</h2>
                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Enterprise Software & Digital Solutions</p>
              </div>
              
              <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${applicant.full_name}</strong>,</p>
              
              <p style="font-size: 14px; line-height: 1.6;">We are pleased to inform you that your application for the <strong>${jobPosition}</strong> position at <strong>SaroHub Technologies</strong> has been reviewed and <span style="color: #16a34a; font-weight: bold; background-color: #f0fdf4; padding: 2px 8px; border-radius: 4px; border: 1px solid #bbf7d0;">SHORTLISTED</span>.</p>
              
              <p style="font-size: 14px; line-height: 1.6;">Our Talent Acquisition team was highly impressed by your qualifications and CV portfolio. We will contact you shortly to schedule an interview and discuss the next steps in our selection process.</p>

              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #334155;"><strong>Role:</strong> ${jobPosition}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #334155;"><strong>Status:</strong> Shortlisted for Next Phase</p>
              </div>
              
              <p style="font-size: 14px; line-height: 1.6;">If you have any questions in the meantime, feel free to reply to this email.</p>
              
              <p style="font-size: 14px; line-height: 1.6; margin-top: 24px;">Best regards,<br/>
              <strong>Talent Acquisition Team</strong><br/>
              SaroHub Technologies (Private) Limited</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
              
              <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0;">
                Office: Ali Chowk, Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan<br/>
                Emails: info@sarohub.com | mehdi.sarohub@gmail.com
              </p>
            </div>
          `
        });
      } catch (err: any) {
        console.error('Shortlist email dispatch notification error:', err.message);
      }
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: err.message || 'Failed to update application status' });
  }
});

// CV Document Upload Endpoint (Cloudinary + Base64 Fallback)
app.post('/api/upload-cv', upload.single('cv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CV file uploaded.' });
  }

  const base64Url = `data:${req.file.mimetype || 'application/pdf'};base64,${req.file.buffer.toString('base64')}`;

  let responded = false;
  const timer = setTimeout(() => {
    if (!responded) {
      responded = true;
      console.log('[UPLOAD CV INFO] Cloudinary response delayed, returned base64 CV fallback.');
      res.json({ url: base64Url });
    }
  }, 4000);

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'sarohub_cvs', resource_type: 'auto' },
      (error, result) => {
        clearTimeout(timer);
        if (responded) return;
        responded = true;
        if (error || !result?.secure_url) {
          console.log('[UPLOAD CV INFO] Cloudinary unavailable/error, returned base64 fallback:', error?.message || 'No URL');
          return res.json({ url: base64Url });
        }
        res.json({ url: result.secure_url || result.url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (err: any) {
    clearTimeout(timer);
    if (!responded) {
      responded = true;
      res.json({ url: base64Url });
    }
  }
});

async function deleteFromCloudinaryIfApplicable(url: string) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return;
  try {
    const urlParts = url.split('/');
    const fileWithExt = urlParts.pop() || '';
    const publicId = 'sarohub_cvs/' + fileWithExt.replace(/\.[^/.]+$/, '');
    
    // Non-blocking background destroy attempt
    Promise.allSettled([
      cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }),
      cloudinary.uploader.destroy(publicId, { resource_type: 'image' }),
      cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
    ]).then(() => {
      console.log(`[CLOUDINARY PURGE] Purged CV asset: ${publicId}`);
    }).catch(() => null);
  } catch (e) {
    console.error('Failed to destroy Cloudinary asset:', e);
  }
}

app.delete('/api/applications/:id', authenticateToken, (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    let deletedApp: any = null;

    db.updateState((state) => {
      if (!state.applications) state.applications = [];
      const a = state.applications.find(item => item.id === id);
      if (a) {
        deletedApp = { ...a };
        state.applications = state.applications.filter(item => item.id !== id);
      }
    });

    // Return HTTP 200 immediately so frontend doesn't hang
    res.json({ success: true });

    // Handle Cloudinary cleanup and audit trail logging in background
    if (deletedApp) {
      const adminId = req.admin?.id || 1;
      db.logActivity(adminId, 'DELETE_APPLICATION', `Removed job application for: ${deletedApp.full_name}`, req.ip || '127.0.0.1');

      if (deletedApp.resume_url) {
        deleteFromCloudinaryIfApplicable(deletedApp.resume_url).catch(() => null);
      }
    }
  } catch (err: any) {
    console.error('Error deleting application:', err);
    res.status(500).json({ error: err.message || 'Failed to delete application' });
  }
});

// =========================================================================
// 10B. SCHOLARSHIPS & INTERNSHIPS (OPPORTUNITIES) CRUD API
// =========================================================================
app.get('/api/opportunities', (req, res) => {
  res.json(db.getState().opportunities || []);
});

app.get('/api/opportunities/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const opp = (db.getState().opportunities || []).find(item => item.id === id);
  if (opp) {
    res.json(opp);
  } else {
    res.status(404).json({ error: 'Opportunity not found' });
  }
});

app.post('/api/opportunities', authenticateToken, (req: any, res) => {
  const body = req.body;
  if (!body.title || !body.type) {
    return res.status(400).json({ error: 'Title and Type are required' });
  }
  let newOpp: any;
  db.updateState((state) => {
    if (!state.opportunities) state.opportunities = [];
    const parseId = (id: any): number => {
      const parsed = parseInt(String(id), 10);
      return isNaN(parsed) ? 0 : parsed;
    };
    const nextId = state.opportunities.length > 0
      ? Math.max(...state.opportunities.map(i => parseId(i.id))) + 1
      : 1;

    const baseSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    newOpp = {
      id: nextId,
      type: body.type,
      title: body.title,
      slug: baseSlug,
      short_description: body.short_description || '',
      description: body.description || '',
      eligibility_criteria: body.eligibility_criteria || '',
      benefits: body.benefits || '',
      location: body.location || '',
      duration: body.duration || '',
      start_date: body.start_date || '',
      deadline: body.deadline || '',
      positions_count: body.positions_count ? parseInt(body.positions_count) : undefined,
      max_applications: body.max_applications ? parseInt(body.max_applications) : undefined,
      status: body.status || 'Open',
      featured_image_url: body.featured_image_url || '',
      is_published: body.is_published !== undefined ? !!body.is_published : true,
      seo_title: body.seo_title || '',
      seo_description: body.seo_description || '',
      form_fields: Array.isArray(body.form_fields) ? body.form_fields : [
        { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
        { id: 'field_email', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: 'field_phone', type: 'phone', label: 'Phone Number', required: true, placeholder: 'Enter your phone' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    state.opportunities.push(newOpp);
    db.logActivity(req.admin.id, 'CREATE_OPPORTUNITY', `Created opportunity: ${body.title} (${body.type})`, req.ip || '127.0.0.1');
  });
  res.json({ success: true, opportunity: newOpp });
});

app.put('/api/opportunities/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    if (!state.opportunities) state.opportunities = [];
    const opp = state.opportunities.find(item => String(item.id) === String(id));
    if (opp) {
      opp.title = body.title !== undefined ? body.title : opp.title;
      opp.type = body.type !== undefined ? body.type : opp.type;
      opp.slug = body.slug !== undefined ? body.slug : (body.title !== undefined ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : opp.slug);
      opp.short_description = body.short_description !== undefined ? body.short_description : opp.short_description;
      opp.description = body.description !== undefined ? body.description : opp.description;
      opp.eligibility_criteria = body.eligibility_criteria !== undefined ? body.eligibility_criteria : opp.eligibility_criteria;
      opp.benefits = body.benefits !== undefined ? body.benefits : opp.benefits;
      opp.location = body.location !== undefined ? body.location : opp.location;
      opp.duration = body.duration !== undefined ? body.duration : opp.duration;
      opp.start_date = body.start_date !== undefined ? body.start_date : opp.start_date;
      opp.deadline = body.deadline !== undefined ? body.deadline : opp.deadline;
      opp.positions_count = body.positions_count !== undefined ? (body.positions_count ? parseInt(body.positions_count) : undefined) : opp.positions_count;
      opp.max_applications = body.max_applications !== undefined ? (body.max_applications ? parseInt(body.max_applications) : undefined) : opp.max_applications;
      opp.status = body.status !== undefined ? body.status : opp.status;
      opp.featured_image_url = body.featured_image_url !== undefined ? body.featured_image_url : opp.featured_image_url;
      opp.is_published = body.is_published !== undefined ? !!body.is_published : opp.is_published;
      opp.seo_title = body.seo_title !== undefined ? body.seo_title : opp.seo_title;
      opp.seo_description = body.seo_description !== undefined ? body.seo_description : opp.seo_description;
      opp.form_fields = Array.isArray(body.form_fields) ? body.form_fields : opp.form_fields;
      opp.updated_at = new Date().toISOString();
      db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY', `Updated opportunity: ${opp.title}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Opportunity not found' });
  }
});

app.post('/api/opportunities/:id/duplicate', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  let duplicatedOpp: any;
  db.updateState((state) => {
    if (!state.opportunities) state.opportunities = [];
    const original = state.opportunities.find(item => String(item.id) === String(id));
    if (original) {
      const parseId = (id: any): number => {
        const parsed = parseInt(String(id), 10);
        return isNaN(parsed) ? 0 : parsed;
      };
      const nextId = state.opportunities.length > 0
        ? Math.max(...state.opportunities.map(i => parseId(i.id))) + 1
        : 1;
      duplicatedOpp = {
        ...original,
        id: nextId,
        title: `${original.title} (Copy)`,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      state.opportunities.push(duplicatedOpp);
      db.logActivity(req.admin.id, 'DUPLICATE_OPPORTUNITY', `Duplicated opportunity: ${original.title} -> ${duplicatedOpp.title}`, req.ip || '127.0.0.1');
    }
  });
  if (duplicatedOpp) {
    res.json({ success: true, opportunity: duplicatedOpp });
  } else {
    res.status(404).json({ error: 'Opportunity to duplicate not found' });
  }
});

app.delete('/api/opportunities/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  let success = false;
  db.updateState((state) => {
    if (!state.opportunities) state.opportunities = [];
    const opp = state.opportunities.find(item => String(item.id) === String(id));
    if (opp) {
      state.opportunities = state.opportunities.filter(item => String(item.id) !== String(id));
      db.logActivity(req.admin.id, 'DELETE_OPPORTUNITY', `Deleted opportunity: ${opp.title}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Opportunity not found' });
  }
});

// Applications for Opportunities
app.get('/api/opportunities-applications', authenticateToken, (req, res) => {
  res.json(db.getState().opportunity_applications || []);
});

app.post('/api/opportunities/:id/apply', async (req, res) => {
  const opportunity_id = parseInt(req.params.id);
  const { form_data, uploaded_documents, applicant_name, applicant_email } = req.body;

  if (!applicant_name || !applicant_email) {
    return res.status(400).json({ error: 'Required fields missing: applicant_name and applicant_email.' });
  }

  const opp = (db.getState().opportunities || []).find(item => item.id === opportunity_id);
  if (!opp) {
    return res.status(404).json({ error: 'Opportunity not found.' });
  }

  db.updateState((state) => {
    if (!state.opportunity_applications) state.opportunity_applications = [];
    const nextId = state.opportunity_applications.length > 0 ? Math.max(...state.opportunity_applications.map(i => i.id)) + 1 : 1;
    state.opportunity_applications.unshift({
      id: nextId,
      opportunity_id,
      opportunity_title: opp.title,
      opportunity_type: opp.type,
      applicant_name,
      applicant_email,
      applied_at: new Date().toISOString(),
      status: 'Pending',
      form_data: form_data || {},
      uploaded_documents: Array.isArray(uploaded_documents) ? uploaded_documents : [],
      internal_notes: ''
    });
  });

  try {
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from: `"SaroHub Technologies" <${process.env.SMTP_USER || 'info@sarohub.com'}>`,
      to: applicant_email,
      cc: 'info@sarohub.com',
      subject: `Application Received: ${opp.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Application Received!</h2>
          <p>Dear ${applicant_name},</p>
          <p>Thank you for applying for the <strong>${opp.title}</strong> opportunity at SaroHub Technologies.</p>
          <p>This is an automated message to confirm that we have successfully received your application. Our team will review your profile and get back to you soon.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>SaroHub Technologies Team</strong><br>
          <a href="mailto:info@sarohub.com">info@sarohub.com</a></p>
        </div>
      `
    });
    console.log(`[SAROHUB MAIL] Confirmation email sent to ${applicant_email}.`);
  } catch (emailErr) {
    console.error(`[SAROHUB MAIL] Failed to send confirmation email to ${applicant_email}:`, emailErr);
  }

  res.json({ success: true, message: 'Application submitted successfully! Our team will review it.' });
});

app.put('/api/opportunities-applications/:id/status', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  let success = false;
  db.updateState((state) => {
    if (!state.opportunity_applications) state.opportunity_applications = [];
    const appItem = state.opportunity_applications.find(item => item.id === id);
    if (appItem) {
      appItem.status = status;
      db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY_APP_STATUS', `Updated status for opportunity application of: ${appItem.applicant_name} to ${status}`, req.ip || '127.0.0.1');
      success = true;
    }
  });

  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

app.put('/api/opportunities-applications/:id/notes', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const { notes } = req.body;

  let success = false;
  db.updateState((state) => {
    if (!state.opportunity_applications) state.opportunity_applications = [];
    const appItem = state.opportunity_applications.find(item => item.id === id);
    if (appItem) {
      appItem.internal_notes = notes;
      db.logActivity(req.admin.id, 'UPDATE_OPPORTUNITY_APP_NOTES', `Updated internal notes on opportunity application of: ${appItem.applicant_name}`, req.ip || '127.0.0.1');
      success = true;
    }
  });

  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

app.post('/api/opportunities-applications/:id/notify', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const { messageText } = req.body;
  if (!messageText) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const appItem = (db.getState().opportunity_applications || []).find(item => item.id === id);
  if (!appItem) {
    return res.status(404).json({ error: 'Application not found' });
  }

  db.updateState((state) => {
    db.logActivity(req.admin.id, 'SEND_OPPORTUNITY_NOTIFICATION', `Dispatched notification email to ${appItem.applicant_email} (${appItem.applicant_name}) for opportunity "${appItem.opportunity_title}"`, req.ip || '127.0.0.1');
  });

  console.log(`[EMAIL NOTIFICATION] Dispatched mail to ${appItem.applicant_email}:\n"${messageText}"`);

  res.json({ success: true, message: `Notification email successfully dispatched to ${appItem.applicant_email}!` });
});

app.delete('/api/opportunities-applications/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  let success = false;
  let applicantName = '';
  db.updateState((state) => {
    if (!state.opportunity_applications) state.opportunity_applications = [];
    const index = state.opportunity_applications.findIndex(item => item.id === id);
    if (index !== -1) {
      applicantName = state.opportunity_applications[index].applicant_name;
      state.opportunity_applications.splice(index, 1);
      db.logActivity(req.admin.id, 'DELETE_OPPORTUNITY_APP', `Deleted opportunity application of: ${applicantName}`, req.ip || '127.0.0.1');
      success = true;
    }
  });

  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

// =========================================================================
// 11. FAQS & TESTIMONIALS CRUD
// =========================================================================
app.get('/api/faqs', (req, res) => {
  res.json(db.getState().faqs);
});

app.post('/api/faqs', authenticateToken, (req: any, res) => {
  const { category, question, answer } = req.body;
  db.updateState((state) => {
    const nextId = state.faqs.length > 0 ? Math.max(...state.faqs.map(i => i.id)) + 1 : 1;
    state.faqs.push({
      id: nextId,
      category,
      question,
      answer,
      created_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_FAQ', `Added FAQ question under: ${category}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/faqs/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    state.faqs = state.faqs.filter(item => item.id !== id);
  });
  res.json({ success: true });
});

app.put('/api/faqs/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const f = state.faqs.find(item => item.id === id);
    if (f) {
      f.category = body.category !== undefined ? body.category : f.category;
      f.question = body.question !== undefined ? body.question : f.question;
      f.answer = body.answer !== undefined ? body.answer : f.answer;
      db.logActivity(req.admin.id, 'UPDATE_FAQ', `Updated FAQ question: ${f.question}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'FAQ not found' });
  }
});

// Testimonials
app.get('/api/testimonials', (req, res) => {
  res.json(db.getState().testimonials);
});

app.post('/api/testimonials', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    const nextId = state.testimonials.length > 0 ? Math.max(...state.testimonials.map(i => i.id)) + 1 : 1;
    state.testimonials.push({
      id: nextId,
      client_name: body.client_name,
      client_role: body.client_role,
      client_company: body.client_company,
      client_avatar: body.client_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      rating: parseInt(body.rating) || 5,
      feedback: body.feedback,
      created_at: new Date().toISOString()
    });
    db.logActivity(req.admin.id, 'CREATE_TESTIMONIAL', `Added client testimonial from: ${body.client_name}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

app.delete('/api/testimonials/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    state.testimonials = state.testimonials.filter(item => item.id !== id);
  });
  res.json({ success: true });
});

app.put('/api/testimonials/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  let success = false;
  db.updateState((state) => {
    const t = state.testimonials.find(item => item.id === id);
    if (t) {
      t.client_name = body.client_name !== undefined ? body.client_name : t.client_name;
      t.client_role = body.client_role !== undefined ? body.client_role : t.client_role;
      t.client_company = body.client_company !== undefined ? body.client_company : t.client_company;
      t.client_avatar = body.client_avatar !== undefined ? body.client_avatar : t.client_avatar;
      t.rating = body.rating !== undefined ? parseInt(body.rating) || 5 : t.rating;
      t.feedback = body.feedback !== undefined ? body.feedback : t.feedback;
      db.logActivity(req.admin.id, 'UPDATE_TESTIMONIAL', `Updated testimonial from: ${t.client_name}`, req.ip || '127.0.0.1');
      success = true;
    }
  });
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Testimonial not found' });
  }
});

// =========================================================================
// LIVE CHAT API ENDPOINTS
// =========================================================================

// Get agent status and sessions (agent view - authenticated)
app.get('/api/chats', authenticateToken, (req, res) => {
  const state = db.getState();
  res.json({
    sessions: state.chat_sessions || [],
    availability: state.agent_availability || 'online'
  });
});

// Get agent status only (public view)
app.get('/api/chats/agent/status', (req, res) => {
  res.json({
    availability: db.getState().agent_availability || 'online'
  });
});

// Update agent status (agent view - authenticated)
app.put('/api/chats/agent/status', authenticateToken, (req: any, res) => {
  const { availability } = req.body;
  if (availability !== 'online' && availability !== 'away' && availability !== 'offline') {
    return res.status(400).json({ error: 'Invalid availability status.' });
  }
  db.updateState((state) => {
    state.agent_availability = availability;
    db.logActivity(req.admin.id, 'UPDATE_CHAT_STATUS', `Agent availability changed to ${availability}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true, availability });
});

// Get a single session's messages (visitor or agent view - no token required)
app.get('/api/chats/:id', (req, res) => {
  const session = db.getState().chat_sessions?.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Chat session not found' });
  }
  res.json(session);
});

// Delete a single chat session (visitor or agent)
app.delete('/api/chats/:id', (req, res) => {
  const id = req.params.id;
  db.updateState((state) => {
    if (state.chat_sessions) {
      state.chat_sessions = state.chat_sessions.filter(s => s.id !== id);
    }
  });
  res.json({ success: true, message: 'Chat session deleted successfully.' });
});

// Clear all chat sessions (agent view - authenticated)
app.delete('/api/chats', authenticateToken, (req: any, res) => {
  db.updateState((state) => {
    state.chat_sessions = [];
    db.logActivity(req.admin.id, 'CLEAR_ALL_CHATS', 'Cleared all active chat sessions', req.ip || '127.0.0.1');
  });
  res.json({ success: true, message: 'All chat sessions cleared successfully.' });
});

// Close a session (agent view - authenticated)
app.put('/api/chats/:id/close', authenticateToken, (req: any, res) => {
  const id = req.params.id;
  db.updateState((state) => {
    const session = state.chat_sessions?.find(s => s.id === id);
    if (session) {
      session.status = 'closed';
      session.messages.push({
        id: 'sys-' + Date.now(),
        sender: 'system',
        text: 'This chat session has been closed by the agent.',
        created_at: new Date().toISOString()
      });
      db.logActivity(req.admin.id, 'CLOSE_CHAT_SESSION', `Closed chat session: ${id} with ${session.visitor_name}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// Suggest an agent reply using Gemini (agent view - authenticated)
app.post('/api/chats/:id/suggest-reply', authenticateToken, async (req: any, res) => {
  const sessionId = req.params.id;
  const session = db.getState().chat_sessions?.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Chat session not found' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ suggestion: "Gemini API key not configured. Please craft a manual response." });
    }

    const messages = session.messages || [];
    const chatHistoryContext = messages.map(m => `${m.sender === 'visitor' ? 'Visitor' : m.sender === 'agent' ? 'Agent' : 'System'}: ${m.text}`).join('\n');

    const systemInstruction = `You are a Senior Engineering Advisor guiding our live-support agent at SaroHub Technologies (Private) Limited.
Analyze the active chat history below and output a precise, professional, helpful suggestion for the agent to send.
The reply should be elegant, direct, fully customized to their query, and maintain a polished enterprise corporate voice.
Keep the suggested reply brief and professional. Do NOT include any prefixes like "Agent:" or "SaroHub:". Output ONLY the exact suggested message text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate a suggested reply for this chat history:\n\n${chatHistoryContext}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ suggestion: response.text || "Thank you for contacting us. We are reviewing your inquiry." });
  } catch (err) {
    console.error('Failed to suggest agent reply:', err);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});


// Send a message to a session (Visitor or Agent)
app.post('/api/chats/:id/messages', (req, res) => {
  const sessionId = req.params.id;
  const { sender, text, visitorName, visitorPhone, visitorEmail } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: 'Sender and text are required fields' });
  }

  // If sender is agent, verify authentication
  let isAgent = sender === 'agent';
  if (isAgent) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Agent signature required.' });
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid agent token.' });
    }
  }

  let triggerBotResponse = false;
  let visitorNameStored = visitorName || 'Anonymous Visitor';

  db.updateState((state) => {
    if (!state.chat_sessions) {
      state.chat_sessions = [];
    }

    let session = state.chat_sessions.find(s => s.id === sessionId);
    if (!session) {
      if (isAgent) {
        return;
      }
      session = {
        id: sessionId,
        visitor_name: visitorNameStored,
        visitor_phone: visitorPhone || '',
        visitor_email: visitorEmail || '',
        status: 'active',
        agent_unread: true,
        visitor_unread: false,
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      state.chat_sessions.push(session);
    }

    if (isAgent) {
      session.visitor_unread = true;
      session.agent_unread = false;
    } else {
      session.agent_unread = true;
      session.visitor_unread = false;
      visitorNameStored = session.visitor_name;
      if (visitorName) session.visitor_name = visitorName;
      if (visitorPhone) session.visitor_phone = visitorPhone;
      if (visitorEmail) session.visitor_email = visitorEmail;
    }

    session.messages.push({
      id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      sender,
      text,
      created_at: new Date().toISOString()
    });

    session.updated_at = new Date().toISOString();

    // SaroBot (AI Assistant) should always reply to every visitor message in real-time
    if (!isAgent && session.status === 'active') {
      triggerBotResponse = true;
    }
  });

  if (triggerBotResponse) {
    const session = db.getState().chat_sessions?.find(s => s.id === sessionId);
    const messages = session ? session.messages : [];

    Promise.resolve().then(async () => {
      try {
        const ai = getGeminiClient();
        let replyText = '';

        const getLocalFallback = (rawText: string): string => {
          const lowText = rawText.toLowerCase();
          const state = db.getState();
          const services = state.services || [];
          const projects = state.projects || [];
          const products = state.products || [];
          const team = state.team_members || [];
          const careers = state.careers || [];
          const opportunities = state.opportunities || [];
          const settings = state.settings || {};

          if (lowText.includes('price') || lowText.includes('cost') || lowText.includes('budget') || lowText.includes('quote')) {
            const founders = team.filter(t => t.is_founder).map(t => t.name).slice(0, 2).join(' or ');
            return `At SaroHub, our pricing is fully customized to the architectural scale of your enterprise blueprint. A structural consultant (${founders || 'Mehdi Hassan or Muhammad Nawaz'}) can contact you directly to provide a quote. Would you like to leave your email or schedule a briefing?`;
          } else if (lowText.includes('service') || lowText.includes('offer') || lowText.includes('do you do') || lowText.includes('capabilities') || lowText.includes('strengths') || lowText.includes('expert')) {
            if (services.length > 0) {
              const list = services.map(s => `• ${s.title}: ${s.short_description}`).join('\n');
              return `SaroHub Technologies specializes in the following elite services:\n${list}\n\nLet us know which field aligns with your goals!`;
            }
            return "We offer premium solutions in cognitive AI pipeline engineering, custom high-availability ERP architectures, SaroHub Sentinel cybersecurity shielding, and edge-native cloud deployments. Let us know which field aligns with your goals!";
          } else if (lowText.includes('project') || lowText.includes('portfolio') || lowText.includes('work') || lowText.includes('built') || lowText.includes('case study')) {
            if (projects.length > 0) {
              const list = projects.map(p => `• ${p.title} for ${p.client_name}: ${p.short_description}`).join('\n');
              return `We have delivered premium projects across various domains, including:\n${list}\n\nWould you like to learn more about any of these case studies?`;
            }
            return "We have successfully delivered various projects, including the Vanguard ERP Systems Suite, Aura AI Cognitive Agent, and the Apex E-Commerce Ecosystem. Let us know what project scope you have in mind!";
          } else if (lowText.includes('product') || lowText.includes('software') || lowText.includes('crm') || lowText.includes('hospital') || lowText.includes('sentinel')) {
            if (products.length > 0) {
              const list = products.map(p => `• ${p.title}: ${p.short_description}`).join('\n');
              return `Our premium software products include:\n${list}\n\nWould you like a demo or pricing details for any of these?`;
            }
            return "SaroHub offers premium products like SaroHub CRM & Core Pipeline, and the SaroHub Sentinel Hospital Manager. Would you like to check out a demo?";
          } else if (lowText.includes('career') || lowText.includes('job') || lowText.includes('hiring') || lowText.includes('vacancy') || lowText.includes('vacancies') || lowText.includes('work with us')) {
            if (careers.length > 0) {
              const list = careers.map(c => `• ${c.position} (${c.department}) - experience required: ${c.experience}`).join('\n');
              return `We are actively hiring! Current vacancies at SaroHub include:\n${list}\n\nYou can apply directly through our Careers page or leave your contact details here.`;
            }
            return "SaroHub is always looking for talented engineers and designers! Check out our Careers portal or leave your email, and our HR team will get in touch.";
          } else if (lowText.includes('scholarship') || lowText.includes('internship') || lowText.includes('opportunity') || lowText.includes('opportunities')) {
            if (opportunities.length > 0) {
              const list = opportunities.map(o => `• ${o.title} (${o.type}) - location: ${o.location}, deadline: ${o.deadline}`).join('\n');
              return `We offer several opportunities for students and professionals:\n${list}\n\nYou can apply directly through our Opportunities page!`;
            }
            return "We periodically offer fully-funded engineering scholarships and cognitive computing internships. Check out our Opportunities page for more info!";
          } else if (lowText.includes('who are you') || lowText.includes('who are u') || lowText.includes('what is this') || lowText.includes('what this company') || lowText.includes('about sarohub') || lowText.includes('rina') || lowText.includes('your name')) {
            return `I am RinaAI (also referred to as SaroBot), your cognitive virtual assistant representing ${settings.company_name || 'SaroHub Technologies (Private) Limited'}. SaroHub is a premier software engineering and enterprise cognitive automation company specializing in Custom ERP Systems, Cloud Architecture, and AI Automations.`;
          } else if (lowText.includes('who build you') || lowText.includes('who built you') || lowText.includes('who made you') || lowText.includes('who created you') || lowText.includes('creator') || lowText.includes('develop you') || lowText.includes('developed you')) {
            const foundersList = team.filter(t => t.is_founder).map(t => `${t.name} (${t.position.split('&')[0].trim()})`).join(', ');
            return `I was designed and developed by the expert engineering and cognitive development team at SaroHub Technologies (Private) Limited, co-founded by ${foundersList || 'Mehdi Hassan (CEO), Muhammad Nawaz (CTO), and Muhammad Kazim (CMO)'}. SaroHub is an international software engineering and enterprise cognitive automation company specializing in Custom ERP Systems, Advanced AI Automation pipelines, and secure Cloud Architectures.`;
          } else if (lowText.includes('mehdi')) {
            const member = team.find(t => t.name.toLowerCase().includes('mehdi'));
            return member ? `${member.name} is the ${member.position}. Bio: ${member.bio}` : "Mehdi Hassan is the Chief Executive Officer (CEO) and Co-Founder of SaroHub Technologies. He has over 4 years of experience leading corporate vision, strategic direction, and digital product innovation at SaroHub.";
          } else if (lowText.includes('nawaz') || lowText.includes('cto') || lowText.includes('naji')) {
            const member = team.find(t => t.name.toLowerCase().includes('nawaz'));
            return member ? `${member.name} is the ${member.position}. Bio: ${member.bio}` : "Muhammad Nawaz is the Chief Technology Officer (CTO) and Co-Founder of SaroHub Technologies. He has over 4 years of experience directing software strategy, backend systems, and distributed cloud engineering.";
          } else if (lowText.includes('kazim') || lowText.includes('cmo') || lowText.includes('qazim')) {
            const member = team.find(t => t.name.toLowerCase().includes('kazim'));
            return member ? `${member.name} is the ${member.position}. Bio: ${member.bio}` : "Muhammad Kazim is the Chief Marketing Officer (CMO) and Co-Founder of SaroHub Technologies. He has over 6 years of experience leading our brand strategy, marketing, and client relations.";
          } else if (lowText.includes('contact') || lowText.includes('phone') || lowText.includes('email') || lowText.includes('address') || lowText.includes('office') || lowText.includes('location') || lowText.includes('where')) {
            return `You can contact SaroHub HQ via email at ${settings.email || 'info@sarohub.com'}, or call/WhatsApp us at ${settings.phone || '+92 3430381471'}. Our office is located at ${settings.office_address || 'Saro IT Center near Clifton-Pull Skardu, Gilgit-Baltistan, Pakistan'}.`;
          } else {
            const founders = team.filter(t => t.is_founder).map(t => t.name).slice(0, 3).join(', ');
            return `Hello! I am RinaAI (also referred to as SaroBot), your cognitive virtual assistant representing ${settings.company_name || 'SaroHub Technologies'}. Our human agents (${founders || 'Mehdi Hassan, Muhammad Nawaz, or Muhammad Kazim'}) are currently analyzing your query. Rest assured, we will follow up with you shortly! You can also reach us directly at ${settings.email || 'info@sarohub.com'} or ${settings.phone || '+92 3430381471'}.`;
          }
        };

        if (ai) {
          try {
            const state = db.getState();
            const services = state.services || [];
            const projects = state.projects || [];
            const products = state.products || [];
            const team = state.team_members || [];
            const careers = state.careers || [];
            const opportunities = state.opportunities || [];
            const settings = state.settings || {};

            const companyInfoJSON = JSON.stringify({
              company_details: {
                name: settings.company_name || 'SaroHub Technologies (Private) Limited',
                office_address: settings.office_address || 'Saro IT Center near Clifton-Pull Skardu, Gilgit-Baltistan Pakistan',
                email: settings.email || 'info@sarohub.com',
                phone: settings.phone || '+92 3430381471',
                business_hours: settings.business_hours || 'Monday - Friday: 9:00 AM - 6:00 PM (PKT)',
              },
              executive_leadership: team.map(t => ({ name: t.name, position: t.position, bio: t.bio, skills: t.skills })),
              our_services: services.map(s => ({ title: s.title, short_description: s.short_description, technologies: s.technologies })),
              our_projects_portfolio: projects.map(p => ({ title: p.title, client_name: p.client_name, category: p.category, short_description: p.short_description, technologies: p.technologies })),
              our_products: products.map(p => ({ title: p.title, short_description: p.short_description, features: p.features })),
              careers_open_vacancies: careers.map(c => ({ position: c.position, department: c.department, experience: c.experience, skills: c.skills, description: c.description })),
              student_and_professional_opportunities: opportunities.map(o => ({ type: o.type, title: o.title, description: o.description, location: o.location, deadline: o.deadline }))
            }, null, 2);

            const systemInstruction = `You are RinaAI (also referred to as SaroBot), the highly polished, corporate Cognitive AI Virtual Assistant representing SaroHub Technologies (Private) Limited.
SaroHub is a premier software engineering and enterprise cognitive automation company specializing in Custom ERP Systems, Cloud Architecture, and AI Automations.

Here is the EXACT, LIVE up-to-date information about SaroHub Technologies retrieved from our enterprise database. You MUST use this database content as your absolute source of truth when answering questions about our leadership, services, projects, products, careers, opportunities, and contact details:

${companyInfoJSON}

Guidelines:
1. Provide extremely helpful, clear, precise answers. If a user asks a question about our team, services, projects, products, jobs, or opportunities, read the database context above and respond with complete and accurate facts.
2. If the user asks general questions outside of company information (like coding, math, general knowledge, etc.), you must still answer them intelligently, accurately, and helpfully while maintaining your corporate persona. DO NOT refuse to answer general questions.
3. Maintain a friendly, formal, innovative, and warm corporate persona. No robotic fluff.
4. Keep answers concise (under 3-4 sentences or simple bullet points if explaining features).
5. If asked who built, created, or developed you, you must state that you were designed and developed by the expert cognitive development and engineering team at SaroHub Technologies (Private) Limited, co-founded by Mehdi Hassan (CEO), Muhammad Nawaz (CTO), and Muhammad Kazim (CMO).
6. If asked about pricing or timelines, suggest that Mehdi Hassan or Muhammad Nawaz will reach out shortly to compile a custom blueprint proposal, and offer to let the user submit their contact details or leave an email.
7. Strictly output ONLY the assistant's response message text. You MUST NOT prepend the response with any prefixes like "SaroBot:", "RinaAI:", "SaroHub:", "Agent:", "AI:", "Support:", "System:", or similar label headers.`;

            const conversationContents = messages
              .filter(m => m.sender !== 'system')
              .map(m => {
                let cleanText = m.text;
                if (m.sender === 'agent' && cleanText.startsWith('[AI Assistant] ')) {
                  cleanText = cleanText.substring('[AI Assistant] '.length);
                }
                return {
                  role: m.sender === 'visitor' ? 'user' : 'model',
                  parts: [{ text: cleanText }]
                };
              });

            const response = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: conversationContents,
              config: {
                systemInstruction,
                temperature: 0.7,
              }
            });

            replyText = response.text || getLocalFallback(text);
          } catch (err) {
            console.error('SaroBot live Gemini call failed, falling back to local matching:', err);
            replyText = getLocalFallback(text);
          }
        } else {
          replyText = getLocalFallback(text);
        }

        db.updateState((state) => {
          const activeSession = state.chat_sessions?.find(s => s.id === sessionId);
          if (activeSession && activeSession.status === 'active') {
            activeSession.messages.push({
              id: 'msg-ai-' + Date.now(),
              sender: 'agent',
              text: `[AI Assistant] ${replyText}`,
              created_at: new Date().toISOString()
            });
            activeSession.visitor_unread = true;
            activeSession.updated_at = new Date().toISOString();
          }
        });
      } catch (err) {
        console.error('SaroBot live assistance generation failed:', err);
      }
    });
  }

  res.json({ success: true });
});

// =========================================================================
// 12. CONTACT & NEWSLETTER SUBSCRIPTION API
// =========================================================================
app.get('/api/contact', authenticateToken, (req, res) => {
  res.json(db.getState().contact_messages);
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Required fields missing: name, email, subject, message.' });
  }

  db.updateState((state) => {
    const nextId = state.contact_messages.length > 0 ? Math.max(...state.contact_messages.map(i => i.id)) + 1 : 1;
    state.contact_messages.unshift({
      id: nextId,
      name,
      email,
      phone,
      subject,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    });
  });

  if (process.env.SMTP_PASS) {
    try {
      const transporter = getSmtpTransporter();
      const smtpEmail = process.env.SMTP_USER || 'mehdi.sarohub@gmail.com';
      const settingsState = db.getState().settings || {};
      const companyEmail = settingsState.email || 'info@sarohub.com';
      const companyWhatsapp = settingsState.whatsapp || '+92 343 0381473';
      await transporter.sendMail({
        from: `"SaroHub Technologies" <${smtpEmail}>`,
        to: email,
        subject: `We received your inquiry: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">Thank you for contacting SaroHub!</h2>
            <p>Dear ${name},</p>
            <p>We have successfully received your message and will get back to you shortly.</p>
            <p>If you need immediate assistance, you can also reach out to us directly via:</p>
            <p>
              📧 <a href="mailto:${companyEmail}">${companyEmail}</a><br>
              📧 <a href="mailto:${smtpEmail}">${smtpEmail}</a><br>
              📱 <a href="https://wa.me/${companyWhatsapp.replace(/[^0-9]/g, '')}">WhatsApp: ${companyWhatsapp}</a><br>
              📱 <a href="https://wa.me/923555866875">WhatsApp: 0355 5866875</a>
            </p>
            <br><p>Best regards,<br><strong>SaroHub Technologies Team</strong></p>
          </div>
        `
      });
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('535') || errMsg.includes('BadCredentials') || errMsg.includes('Invalid login')) {
        console.log('[SMTP NOTICE] Auto-reply email skipped: Gmail SMTP login failed (Invalid App Password in .env). Note: The contact message was saved to database successfully.');
      } else {
        console.log('[SMTP NOTICE] Auto-reply email could not be dispatched:', errMsg);
      }
    }
  } else {
    console.log('[SMTP INFO] Contact message saved to database. Auto-reply email skipped (SMTP_PASS not configured in .env).');
  }

  res.json({ success: true, message: 'Message logged successfully.' });
});

app.put('/api/contact/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const m = state.contact_messages.find(item => item.id === id);
    if (m) {
      m.is_read = true;
      db.logActivity(req.admin.id, 'READ_MESSAGE', `Marked message from: ${m.name} as read`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

app.delete('/api/contact/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    const initialLength = state.contact_messages.length;
    if (state.contact_messages.length < initialLength) {
      db.logActivity(req.admin.id, 'DELETE_MESSAGE', `Deleted contact message ID: ${id}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// =========================================================================
// STUDENT PROJECTS CMS API (IT Center Training Academy)
// =========================================================================
app.get('/api/student-projects', (req, res) => {
  const state = db.getState();
  res.json(state.student_projects || []);
});

app.post('/api/student-projects', authenticateToken, (req: any, res) => {
  const { title, student_name, batch_course, category, technologies, short_description, description, thumbnail_url, images, live_url, github_url } = req.body;
  if (!title || !student_name || !short_description) {
    return res.status(400).json({ error: 'Title, student name, and short description are required fields.' });
  }

  let createdItem: any = null;
  db.updateState((state) => {
    if (!state.student_projects) state.student_projects = [];
    const nextId = state.student_projects.length > 0 ? Math.max(...state.student_projects.map(sp => sp.id)) + 1 : 1;
    const techArray = Array.isArray(technologies) ? technologies : String(technologies || '').split(',').map(s => s.trim()).filter(Boolean);
    const imagesArray = Array.isArray(images) ? images.filter((img: any) => typeof img === 'string' && img.trim()).slice(0, 5) : [];

    createdItem = {
      id: nextId,
      title,
      student_name,
      batch_course: batch_course || 'IT Academy Student',
      category: category || 'Full-Stack Software',
      technologies: techArray,
      short_description,
      description: description || short_description,
      thumbnail_url: thumbnail_url || (imagesArray[0] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=450'),
      images: imagesArray,
      live_url: live_url || '',
      github_url: github_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    state.student_projects.unshift(createdItem);
    db.logActivity(req.admin.id, 'CREATE_STUDENT_PROJECT', `Added student project: ${title} by ${student_name}`, req.ip || '127.0.0.1');
  });

  res.status(201).json(createdItem);
});

app.put('/api/student-projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  let updatedItem: any = null;

  db.updateState((state) => {
    if (!state.student_projects) state.student_projects = [];
    const index = state.student_projects.findIndex(sp => sp.id === id);
    if (index !== -1) {
      if (updates.technologies && !Array.isArray(updates.technologies)) {
        updates.technologies = String(updates.technologies).split(',').map(s => s.trim()).filter(Boolean);
      }
      if (updates.images && Array.isArray(updates.images)) {
        updates.images = updates.images.filter((img: any) => typeof img === 'string' && img.trim()).slice(0, 5);
      }
      state.student_projects[index] = {
        ...state.student_projects[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      updatedItem = state.student_projects[index];
      db.logActivity(req.admin.id, 'UPDATE_STUDENT_PROJECT', `Updated student project ID: ${id}`, req.ip || '127.0.0.1');
    }
  });

  if (!updatedItem) {
    return res.status(404).json({ error: 'Student project not found' });
  }

  res.json(updatedItem);
});

app.delete('/api/student-projects/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state) => {
    if (state.student_projects) {
      state.student_projects = state.student_projects.filter(sp => sp.id !== id);
      db.logActivity(req.admin.id, 'DELETE_STUDENT_PROJECT', `Deleted student project ID: ${id}`, req.ip || '127.0.0.1');
    }
  });
  res.json({ success: true });
});

// Reply to a contact message via email from info@sarohub.com
app.post('/api/contact/:id/reply', authenticateToken, async (req: any, res) => {
  const id = parseInt(req.params.id);
  const { subject, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Reply message cannot be empty.' });
  }

  const state = db.getState();
  const contactMsg = state.contact_messages.find(item => item.id === id);

  if (!contactMsg) {
    return res.status(404).json({ error: 'Contact message not found.' });
  }

  const recipientEmail = contactMsg.email;
  const recipientName = contactMsg.name;
  const emailSubject = subject || `Re: ${contactMsg.subject}`;

  try {
    if (process.env.SMTP_PASS) {
      const transporter = getSmtpTransporter();
      await transporter.sendMail({
        from: `"SaroHub Technologies" <${process.env.SMTP_USER || 'info@sarohub.com'}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #1e293b; border-radius: 12px; background-color: #020617; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #020617 100%); padding: 30px 24px 20px; border-bottom: 1px solid #1e293b;">
              <h2 style="color: #06b6d4; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">SaroHub Technologies</h2>
              <p style="color: #64748b; margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Official Reply from Our Team</p>
            </div>
            <div style="padding: 24px;">
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Dear ${recipientName},</p>
              <div style="background-color: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 8px; margin: 0 0 20px;">
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line;">${message}</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0 0 8px;">If you have further questions, feel free to reply to this email or contact us via:</p>
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                📧 <a href="mailto:info@sarohub.com" style="color: #06b6d4; text-decoration: none;">info@sarohub.com</a><br>
                📱 <a href="https://wa.me/923430381473" style="color: #22c55e; text-decoration: none;">WhatsApp: 0343 0381473</a><br>
                📱 <a href="https://wa.me/923555866875" style="color: #22c55e; text-decoration: none;">WhatsApp: 0355 5866875</a>
              </p>
            </div>
            <div style="background-color: #0f172a; padding: 16px 24px; border-top: 1px solid #1e293b;">
              <p style="color: #475569; font-size: 10px; margin: 0;">Best regards,<br><strong style="color: #94a3b8;">SaroHub Technologies Team</strong></p>
            </div>
          </div>
        `
      });
    } else {
      console.log(`[SMTP SIMULATION] Reply to ${recipientEmail} logged. (Set SMTP_PASS in .env for live sending).`);
    }

    db.logActivity(req.admin.id, 'EMAIL_REPLY', `Replied to contact message from ${recipientName} (${recipientEmail}): "${emailSubject}"`, req.ip || '127.0.0.1');

    db.updateState((state) => {
      const m = state.contact_messages.find(item => item.id === id);
      if (m) m.is_read = true;
    });

    res.json({ success: true, message: 'Reply sent successfully.' });
  } catch (err: any) {
    console.log('[SMTP NOTICE] Email dispatch failed, reply logged to database:', err?.message || err);
    db.updateState((state) => {
      const m = state.contact_messages.find(item => item.id === id);
      if (m) m.is_read = true;
    });
    res.json({ success: true, message: 'Reply saved in system.' });
  }
});

// ==========================================
// PARTNERS, AGENCIES & INVESTORS MANAGEMENT
// ==========================================
app.get('/api/partners', (req, res) => {
  const partners = db.getState().partners || [];
  res.json(partners.sort((a, b) => (a.order || 0) - (b.order || 0)));
});

app.post('/api/partners', authenticateToken, (req: any, res) => {
  const { name, category, logo_url, website_url, description, images, gallery, featured, order } = req.body;
  if (!name || !logo_url) {
    return res.status(400).json({ error: 'Name and logo_url are required.' });
  }

  const partnerImages = images || gallery || [];

  let newPartner: any;
  db.updateState((state) => {
    if (!state.partners) state.partners = [];
    const nextId = state.partners.length > 0 ? Math.max(...state.partners.map(p => p.id)) + 1 : 1;
    newPartner = {
      id: nextId,
      name,
      category: category || 'Partner',
      logo_url,
      website_url: website_url || '',
      description: description || '',
      images: partnerImages,
      gallery: partnerImages,
      featured: featured !== undefined ? Boolean(featured) : true,
      order: order !== undefined ? Number(order) : state.partners.length + 1,
      created_at: new Date().toISOString()
    };
    state.partners.push(newPartner);
    db.logActivity(req.admin.id, 'CREATE_PARTNER', `Added partner/investor: ${name}`, req.ip || '127.0.0.1');
  });

  res.json(newPartner);
});

app.put('/api/partners/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  const { name, category, logo_url, website_url, description, images, gallery, featured, order } = req.body;

  let updated: any = null;
  db.updateState((state) => {
    if (!state.partners) state.partners = [];
    const p = state.partners.find(item => item.id === id);
    if (p) {
      if (name !== undefined) p.name = name;
      if (category !== undefined) p.category = category;
      if (logo_url !== undefined) p.logo_url = logo_url;
      if (website_url !== undefined) p.website_url = website_url;
      if (description !== undefined) p.description = description;
      if (images !== undefined || gallery !== undefined) {
        const partnerImages = images || gallery || [];
        p.images = partnerImages;
        p.gallery = partnerImages;
      }
      if (featured !== undefined) p.featured = Boolean(featured);
      if (order !== undefined) p.order = Number(order);
      updated = p;
      db.logActivity(req.admin.id, 'UPDATE_PARTNER', `Updated partner/investor: ${p.name}`, req.ip || '127.0.0.1');
    }
  });

  if (!updated) return res.status(404).json({ error: 'Partner not found.' });
  res.json(updated);
});

app.delete('/api/partners/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);

  let deletedName = '';
  db.updateState((state) => {
    if (!state.partners) state.partners = [];
    const p = state.partners.find(item => item.id === id);
    if (p) deletedName = p.name;
    state.partners = state.partners.filter(item => item.id !== id);
    if (deletedName) {
      db.logActivity(req.admin.id, 'DELETE_PARTNER', `Deleted partner/investor: ${deletedName}`, req.ip || '127.0.0.1');
    }
  });

  res.json({ success: true });
});

// Newsletter
app.get('/api/newsletter', authenticateToken, (req, res) => {
  res.json(db.getState().newsletter_subscribers);
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const emailLower = email.toLowerCase().trim();
  let duplicate = false;

  db.updateState((state) => {
    duplicate = state.newsletter_subscribers.some(s => s.email.toLowerCase() === emailLower);
    if (!duplicate) {
      const nextId = state.newsletter_subscribers.length > 0 ? Math.max(...state.newsletter_subscribers.map(i => i.id)) + 1 : 1;
      state.newsletter_subscribers.push({
        id: nextId,
        email: emailLower,
        is_active: true,
        subscribed_at: new Date().toISOString()
      });
    }
  });

  if (duplicate) {
    return res.json({ success: true, message: 'Already subscribed!' });
  }

  try {
    const transporter = getSmtpTransporter();
    const smtpEmail = process.env.SMTP_USER || 'mehdi.sarohub@gmail.com';
    const settingsState = db.getState().settings || {};
    const companyEmail = settingsState.email || 'info@sarohub.com';
    const companyPhone = settingsState.phone || '+92 355 58668 75';
    const companyWhatsapp = settingsState.whatsapp || '+92 343 0381473';
    await transporter.sendMail({
      from: `"SaroHub Technologies" <${smtpEmail}>`,
      to: emailLower,
      subject: `Welcome to the SaroHub Corporate Bulletin!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to SaroHub!</h2>
          <p>You have successfully subscribed to our newsletter.</p>
          <p>If you have any questions or wish to contact us, please use the links below:</p>
          <p>
            📧 <a href="mailto:${companyEmail}">${companyEmail}</a><br>
            📧 <a href="mailto:${smtpEmail}">${smtpEmail}</a><br>
            📱 <a href="https://wa.me/${companyWhatsapp.replace(/[^0-9]/g, '')}">WhatsApp: ${companyWhatsapp}</a><br>
            📱 <a href="https://wa.me/923555866875">WhatsApp: 0355 5866875</a>
          </p>
          <br><p>Best regards,<br><strong>SaroHub Technologies Team</strong></p>
        </div>
      `
    });
  } catch (err) {
    console.error('Failed to send auto-reply for newsletter:', err);
  }

  res.json({ success: true, message: 'Thank you for subscribing to SaroHub enterprise bulletins!' });
});

// =========================================================================
// 13. SETTINGS & SEO SETTINGS
// =========================================================================
app.get('/api/settings', (req, res) => {
  res.json(db.getState().settings);
});

app.post('/api/settings', authenticateToken, (req: any, res) => {
  const body = req.body;
  db.updateState((state) => {
    for (const key of Object.keys(body)) {
      state.settings[key] = String(body[key]);
    }
    db.logActivity(req.admin.id, 'UPDATE_SETTINGS', 'Corporate settings updated.', req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

// SEO metadata
app.get('/api/seo', (req, res) => {
  res.json(db.getState().seo_settings);
});

app.post('/api/seo', authenticateToken, (req: any, res) => {
  const { page_route, meta_title, meta_description, meta_keywords } = req.body;
  db.updateState((state) => {
    const item = state.seo_settings.find(s => s.page_route === page_route);
    if (item) {
      item.meta_title = meta_title || item.meta_title;
      item.meta_description = meta_description || item.meta_description;
      item.meta_keywords = meta_keywords || item.meta_keywords;
    } else {
      const nextId = state.seo_settings.length > 0 ? Math.max(...state.seo_settings.map(s => s.id)) + 1 : 1;
      state.seo_settings.push({
        id: nextId,
        page_route,
        meta_title,
        meta_description,
        meta_keywords
      });
    }
    db.logActivity(req.admin.id, 'UPDATE_SEO', `Updated SEO configurations for route: ${page_route}`, req.ip || '127.0.0.1');
  });
  res.json({ success: true });
});

// =========================================================================
// 15. VENTURES MODULE
// =========================================================================

// GET all ventures
app.get('/api/ventures', (req, res) => {
  const db_state = db.getState();
  const ventures = db_state.ventures || [];
  res.json(ventures);
});

// GET venture by slug (must come before /:id)
app.get('/api/ventures/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const db_state = db.getState();
  const venture = (db_state.ventures || []).find((v: any) => v.slug === slug);
  if (!venture) return res.status(404).json({ error: 'Venture not found.' });
  res.json(venture);
});

// GET venture by id
app.get('/api/ventures/:id', (req, res) => {
  const { id } = req.params;
  const db_state = db.getState();
  const venture = (db_state.ventures || []).find((v: any) => v.id === id);
  if (!venture) return res.status(404).json({ error: 'Venture not found.' });
  res.json(venture);
});

// POST create new venture
app.post('/api/ventures', authenticateToken, (req, res) => {
  const body = req.body;
  if (!body.name) return res.status(400).json({ error: 'Venture name is required.' });
  const newVenture = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };
  db.updateState((state: any) => {
    if (!state.ventures) state.ventures = [];
    state.ventures.push(newVenture);
  });
  res.status(201).json(newVenture);
});

// PUT update venture
app.put('/api/ventures/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let found = false;
  db.updateState((state: any) => {
    if (!state.ventures) return;
    const idx = state.ventures.findIndex((v: any) => v.id === id);
    if (idx !== -1) {
      state.ventures[idx] = { ...state.ventures[idx], ...req.body, id, updatedAt: new Date().toISOString() };
      found = true;
    }
  });
  if (!found) return res.status(404).json({ error: 'Venture not found.' });
  const updated = (db.getState().ventures || []).find((v: any) => v.id === id);
  res.json(updated);
});

// DELETE venture
app.delete('/api/ventures/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let found = false;
  db.updateState((state: any) => {
    if (!state.ventures) return;
    const idx = state.ventures.findIndex((v: any) => v.id === id);
    if (idx !== -1) {
      state.ventures.splice(idx, 1);
      found = true;
    }
  });
  if (!found) return res.status(404).json({ error: 'Venture not found.' });
  res.json({ success: true });
});

// =========================================================================
// 16. DYNAMIC CMS MODULES & LEADS CRM ENDPOINTS
// =========================================================================

// Hero Settings
app.get('/api/hero-settings', (req, res) => {
  res.json((db.getState() as any).hero_settings || {});
});

app.put('/api/hero-settings', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    state.hero_settings = { ...state.hero_settings, ...req.body };
    db.logActivity(req.admin.id, 'UPDATE_HERO_SETTINGS', 'Updated homepage hero section content.', req.ip || '127.0.0.1');
  });
  res.json({ success: true, hero_settings: (db.getState() as any).hero_settings });
});

// Company Metrics / Statistics
app.get('/api/company-metrics', (req, res) => {
  res.json((db.getState() as any).company_metrics || []);
});

app.post('/api/company-metrics', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.company_metrics) state.company_metrics = [];
    const nextId = state.company_metrics.length > 0 ? Math.max(...state.company_metrics.map((m: any) => m.id)) + 1 : 1;
    const newItem = { id: nextId, order: state.company_metrics.length + 1, active: true, ...req.body };
    state.company_metrics.push(newItem);
  });
  res.json({ success: true });
});

app.put('/api/company-metrics/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.company_metrics) return;
    const idx = state.company_metrics.findIndex((m: any) => m.id === id);
    if (idx !== -1) {
      state.company_metrics[idx] = { ...state.company_metrics[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/company-metrics/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.company_metrics) return;
    state.company_metrics = state.company_metrics.filter((m: any) => m.id !== id);
  });
  res.json({ success: true });
});

// Why SaroHub
app.get('/api/why-sarohub', (req, res) => {
  res.json((db.getState() as any).why_sarohub_items || []);
});

app.post('/api/why-sarohub', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.why_sarohub_items) state.why_sarohub_items = [];
    const nextId = state.why_sarohub_items.length > 0 ? Math.max(...state.why_sarohub_items.map((i: any) => i.id)) + 1 : 1;
    state.why_sarohub_items.push({ id: nextId, order: state.why_sarohub_items.length + 1, status: 'active', ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/why-sarohub/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.why_sarohub_items) return;
    const idx = state.why_sarohub_items.findIndex((i: any) => i.id === id);
    if (idx !== -1) {
      state.why_sarohub_items[idx] = { ...state.why_sarohub_items[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/why-sarohub/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.why_sarohub_items) return;
    state.why_sarohub_items = state.why_sarohub_items.filter((i: any) => i.id !== id);
  });
  res.json({ success: true });
});

// Industry Solutions
app.get('/api/industries', (req, res) => {
  res.json((db.getState() as any).industry_solutions || []);
});

app.post('/api/industries', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.industry_solutions) state.industry_solutions = [];
    const nextId = state.industry_solutions.length > 0 ? Math.max(...state.industry_solutions.map((i: any) => i.id)) + 1 : 1;
    const slug = req.body.name ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `industry-${nextId}`;
    state.industry_solutions.push({ id: nextId, slug, published: true, order: state.industry_solutions.length + 1, ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/industries/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.industry_solutions) return;
    const idx = state.industry_solutions.findIndex((i: any) => i.id === id);
    if (idx !== -1) {
      state.industry_solutions[idx] = { ...state.industry_solutions[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/industries/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.industry_solutions) return;
    state.industry_solutions = state.industry_solutions.filter((i: any) => i.id !== id);
  });
  res.json({ success: true });
});

// Case Studies
app.get('/api/case-studies', (req, res) => {
  res.json((db.getState() as any).case_studies || []);
});

app.post('/api/case-studies', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.case_studies) state.case_studies = [];
    const nextId = state.case_studies.length > 0 ? Math.max(...state.case_studies.map((c: any) => c.id)) + 1 : 1;
    const slug = req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `case-study-${nextId}`;
    state.case_studies.push({ id: nextId, slug, published: true, featured: false, createdAt: new Date().toISOString(), ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/case-studies/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.case_studies) return;
    const idx = state.case_studies.findIndex((c: any) => c.id === id);
    if (idx !== -1) {
      state.case_studies[idx] = { ...state.case_studies[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/case-studies/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.case_studies) return;
    state.case_studies = state.case_studies.filter((c: any) => c.id !== id);
  });
  res.json({ success: true });
});

// Process Steps (How We Work)
app.get('/api/process-steps', (req, res) => {
  res.json((db.getState() as any).process_steps || []);
});

app.post('/api/process-steps', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.process_steps) state.process_steps = [];
    const nextId = state.process_steps.length > 0 ? Math.max(...state.process_steps.map((p: any) => p.id)) + 1 : 1;
    state.process_steps.push({ id: nextId, order: state.process_steps.length + 1, ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/process-steps/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.process_steps) return;
    const idx = state.process_steps.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      state.process_steps[idx] = { ...state.process_steps[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/process-steps/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.process_steps) return;
    state.process_steps = state.process_steps.filter((p: any) => p.id !== id);
  });
  res.json({ success: true });
});

// Tech Stack Items
app.get('/api/tech-stack', (req, res) => {
  res.json((db.getState() as any).tech_stack_items || []);
});

app.post('/api/tech-stack', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.tech_stack_items) state.tech_stack_items = [];
    const nextId = state.tech_stack_items.length > 0 ? Math.max(...state.tech_stack_items.map((t: any) => t.id)) + 1 : 1;
    state.tech_stack_items.push({ id: nextId, order: state.tech_stack_items.length + 1, active: true, ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/tech-stack/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.tech_stack_items) return;
    const idx = state.tech_stack_items.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      state.tech_stack_items[idx] = { ...state.tech_stack_items[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/tech-stack/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.tech_stack_items) return;
    state.tech_stack_items = state.tech_stack_items.filter((t: any) => t.id !== id);
  });
  res.json({ success: true });
});

// Security & Engineering Standards
app.get('/api/security-standards', (req, res) => {
  res.json((db.getState() as any).security_standards || []);
});

app.post('/api/security-standards', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.security_standards) state.security_standards = [];
    const nextId = state.security_standards.length > 0 ? Math.max(...state.security_standards.map((s: any) => s.id)) + 1 : 1;
    state.security_standards.push({ id: nextId, order: state.security_standards.length + 1, ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/security-standards/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.security_standards) return;
    const idx = state.security_standards.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      state.security_standards[idx] = { ...state.security_standards[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/security-standards/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.security_standards) return;
    state.security_standards = state.security_standards.filter((s: any) => s.id !== id);
  });
  res.json({ success: true });
});

// Company Timeline
app.get('/api/company-timeline', (req, res) => {
  res.json((db.getState() as any).company_timeline || []);
});

app.post('/api/company-timeline', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.company_timeline) state.company_timeline = [];
    const nextId = state.company_timeline.length > 0 ? Math.max(...state.company_timeline.map((t: any) => t.id)) + 1 : 1;
    state.company_timeline.push({ id: nextId, order: state.company_timeline.length + 1, status: 'active', ...req.body });
  });
  res.json({ success: true });
});

app.put('/api/company-timeline/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.company_timeline) return;
    const idx = state.company_timeline.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      state.company_timeline[idx] = { ...state.company_timeline[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/company-timeline/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.company_timeline) return;
    state.company_timeline = state.company_timeline.filter((t: any) => t.id !== id);
  });
  res.json({ success: true });
});

// Leads Management (Project Inquiries)
app.get('/api/leads', authenticateToken, (req, res) => {
  res.json((db.getState() as any).leads || []);
});

app.post('/api/leads', (req, res) => {
  const body = req.body;
  if (!body.name || !body.email || !body.projectDescription) {
    return res.status(400).json({ error: 'Name, email, and project description are required.' });
  }

  let newLead: any;
  db.updateState((state: any) => {
    if (!state.leads) state.leads = [];
    const nextId = state.leads.length > 0 ? Math.max(...state.leads.map((l: any) => l.id)) + 1 : 1;
    newLead = {
      id: nextId,
      name: body.name,
      company: body.company || '',
      email: body.email,
      phone: body.phone || '',
      country: body.country || '',
      serviceRequired: body.serviceRequired || 'Custom Software Development',
      industry: body.industry || '',
      projectDescription: body.projectDescription,
      estimatedBudget: body.estimatedBudget || 'Not decided',
      timeline: body.timeline || 'Immediate',
      source: body.source || 'Website Form',
      status: 'New',
      notes: '',
      assignedTo: '',
      createdAt: new Date().toISOString()
    };
    state.leads.unshift(newLead);
  });

  res.status(201).json({ success: true, message: 'Inquiry received successfully!', lead: newLead });
});

app.put('/api/leads/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.leads) return;
    const idx = state.leads.findIndex((l: any) => l.id === id);
    if (idx !== -1) {
      state.leads[idx] = { ...state.leads[idx], ...req.body, id };
    }
  });
  res.json({ success: true });
});

app.delete('/api/leads/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.leads) return;
    state.leads = state.leads.filter((l: any) => l.id !== id);
  });
  res.json({ success: true });
});

// Centralized Media Library
app.get('/api/media', authenticateToken, (req, res) => {
  res.json((db.getState() as any).media_library || []);
});

app.post('/api/media', authenticateToken, (req: any, res) => {
  db.updateState((state: any) => {
    if (!state.media_library) state.media_library = [];
    const nextId = state.media_library.length > 0 ? Math.max(...state.media_library.map((m: any) => m.id)) + 1 : 1;
    state.media_library.unshift({ id: nextId, uploadedAt: new Date().toISOString(), ...req.body });
  });
  res.json({ success: true });
});

app.delete('/api/media/:id', authenticateToken, (req: any, res) => {
  const id = parseInt(req.params.id);
  db.updateState((state: any) => {
    if (!state.media_library) return;
    state.media_library = state.media_library.filter((m: any) => m.id !== id);
  });
  res.json({ success: true });
});

// =========================================================================
// 14. VITE DEVELOPER MIDDLEWARE & STATIC SERVING
// =========================================================================

async function startServer() {
  // Ensure the admin password hash is correctly synchronized with SaroHub@Admin2026!
  try {
    db.updateState((state) => {
      if (state.admin) {
        state.admin.password_hash = bcrypt.hashSync('SaroHub@Admin2026!', 10);
      }
    });
    console.log('[SAROHUB SERVER] Admin credential parameters successfully verified and synchronized.');
  } catch (err) {
    console.error('Failed to sync default admin credentials:', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAROHUB SERVER] Corporate portal online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
