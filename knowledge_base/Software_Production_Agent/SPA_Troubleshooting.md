
# S.P.A. Troubleshooting & FAQ

## Table of Contents
1. [Common Setup Issues](#common-setup-issues)
2. [Platform-Specific Troubleshooting](#platform-specific-troubleshooting)
3. [Performance Issues](#performance-issues)
4. [Integration Problems](#integration-problems)
5. [Frequently Asked Questions](#frequently-asked-questions)

## Common Setup Issues

### S.P.A. System Installation Problems

**Problem**: `spa-init.sh` script fails with permission denied
```bash
Error: Permission denied: ./spa-init.sh
```

**Solution**:
```bash
# Make script executable
chmod +x ~/SPA_System/spa-init.sh

# If still failing, run with bash directly
bash ~/SPA_System/spa-init.sh

# Check file ownership
ls -la ~/SPA_System/spa-init.sh
sudo chown $USER:$USER ~/SPA_System/spa-init.sh
```

**Problem**: Missing dependencies during initialization
```bash
Error: npm: command not found
Error: python3: command not found
```

**Solution**:
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt update
sudo apt install python3 python3-pip

# Install Git
sudo apt install git

# Verify installations
node --version
npm --version
python3 --version
git --version
```

**Problem**: Environment variables not persisting
```bash
Error: JWT_SECRET is not defined
```

**Solution**:
```bash
# Check current shell
echo $SHELL

# Add to appropriate profile file
# For bash:
echo 'export JWT_SECRET="your-secret-here"' >> ~/.bashrc
source ~/.bashrc

# For zsh:
echo 'export JWT_SECRET="your-secret-here"' >> ~/.zshrc
source ~/.zshrc

# Verify environment variable
echo $JWT_SECRET
```

### Project Creation Issues

**Problem**: Template files not copying correctly
```bash
Error: No such file or directory: ~/SPA_System/Templates/
```

**Solution**:
```bash
# Check if templates exist
ls -la ~/SPA_System/Templates/

# If missing, recreate template structure
mkdir -p ~/SPA_System/Templates/saas-mvp
mkdir -p ~/SPA_System/Templates/api-service
mkdir -p ~/SPA_System/Templates/mobile-app

# Copy from backup or re-download S.P.A. System
```

**Problem**: Git repository initialization fails
```bash
Error: fatal: not a git repository
```

**Solution**:
```bash
# Initialize git repository
cd your-project-directory
git init

# Configure git if not done globally
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add initial commit
git add .
git commit -m "Initial commit"
```

### Database Connection Issues

**Problem**: PostgreSQL connection refused
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL configuration
sudo -u postgres psql -c "SHOW port;"
sudo -u postgres psql -c "SHOW listen_addresses;"

# Test connection
psql -h localhost -p 5432 -U your_username -d your_database
```

**Problem**: Authentication failed for user
```bash
Error: password authentication failed for user "username"
```

**Solution**:
```bash
# Reset user password
sudo -u postgres psql
ALTER USER your_username PASSWORD 'new_password';
\q

# Update connection string
export DATABASE_URL="postgresql://username:new_password@localhost:5432/dbname"

# Check pg_hba.conf for authentication method
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Change 'peer' to 'md5' for local connections if needed
sudo systemctl restart postgresql
```

## Platform-Specific Troubleshooting

### GitHub Integration Issues

**Problem**: GitHub Actions workflow fails with authentication error
```yaml
Error: HttpError: Bad credentials
```

**Solution**:
```bash
# Verify token permissions
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Check token scopes
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user/repos

# Generate new token with correct permissions:
# - repo (full control)
# - workflow (update workflows)
# - admin:repo_hook (manage webhooks)

# Update repository secrets
# Go to: Repository → Settings → Secrets and variables → Actions
```

**Problem**: Workflow runs but deployment fails
```yaml
Error: Site not found
```

**Solution**:
```bash
# Check Netlify site ID
netlify sites:list

# Verify environment variables in GitHub
# Repository → Settings → Secrets and variables → Actions
# Required secrets:
# - NETLIFY_AUTH_TOKEN
# - NETLIFY_SITE_ID

# Test deployment locally
netlify deploy --dir=dist --prod
```

**Problem**: Branch protection rules preventing merges
```bash
Error: Required status check "ci" is expected
```

**Solution**:
```bash
# Check branch protection settings
gh api repos/:owner/:repo/branches/main/protection

# Update workflow to match required checks
# Ensure job names match protection rule requirements

# Temporarily disable protection for emergency fixes
gh api repos/:owner/:repo/branches/main/protection \
  --method DELETE
```

### Windsurf IDE Issues

**Problem**: Windsurf won't start or crashes on launch
```bash
Error: Windsurf has stopped working
```

**Solution**:
```bash
# Clear Windsurf cache and settings
rm -rf ~/.codeium/windsurf/logs
rm -rf ~/.codeium/windsurf/CachedData

# Reset Windsurf settings
mv ~/.codeium/windsurf/User/settings.json ~/.codeium/windsurf/User/settings.json.backup

# Restart Windsurf
windsurf

# If still failing, reinstall
# Download latest version from windsurf.ai
```

**Problem**: Extensions not loading or causing crashes
```bash
Error: Extension activation failed
```

**Solution**:
```bash
# Disable all extensions
windsurf --disable-extensions

# Enable extensions one by one to identify problematic ones
# Go to Extensions → Disable All → Enable individually

# Remove problematic extension
rm -rf ~/.codeium/windsurf/extensions/problematic-extension

# Clear extension cache
rm -rf ~/.codeium/windsurf/CachedExtensions
```

**Problem**: S.P.A. project not opening correctly
```bash
Error: Cannot read properties of undefined
```

**Solution**:
```bash
# Open project from command line
cd ~/SPA_System
windsurf .

# If workspace is corrupted, recreate
rm .vscode/settings.json
windsurf --new-window

# Check file permissions
chmod -R 755 ~/SPA_System
```

### Bolt Platform Issues

**Problem**: Deployment fails with build errors
```bash
Error: Build failed with exit code 1
```

**Solution**:
```bash
# Check build logs in Bolt dashboard
# Common issues:
# 1. Missing environment variables
# 2. Incorrect build command
# 3. Node.js version mismatch

# Test build locally
npm run build

# Check package.json scripts
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}

# Verify environment variables in Bolt
# Go to: Project Settings → Environment Variables
```

**Problem**: Netlify integration not working
```bash
Error: Failed to connect to Netlify
```

**Solution**:
```bash
# Re-authorize Netlify connection
# In Bolt: Settings → Integrations → Netlify → Reconnect

# Check Netlify permissions
# Ensure Bolt has access to your Netlify account

# Manual deployment as fallback
netlify deploy --dir=dist --prod
```

**Problem**: Real-time features not working
```bash
Error: WebSocket connection failed
```

**Solution**:
```bash
# Check WebSocket configuration
# Ensure CORS is properly configured for WebSocket

# Verify environment variables
VITE_WS_URL=wss://your-backend.railway.app

# Test WebSocket connection
# Use browser dev tools → Network → WS tab
```

### ChatGPT Integration Issues

**Problem**: Custom GPT not responding correctly
```bash
Error: I don't have access to that information
```

**Solution**:
```bash
# Check knowledge base upload
# Files must be under 20MB each
# Supported formats: .txt, .md, .pdf, .docx

# Re-upload S.P.A. documentation
# Go to: GPT Editor → Knowledge → Upload files

# Verify GPT instructions
# Ensure instructions reference uploaded knowledge base
```

**Problem**: GPT giving inconsistent responses
```bash
Error: Responses don't follow S.P.A. methodology
```

**Solution**:
```bash
# Update GPT instructions with specific prompts
# Add examples of expected responses
# Include S.P.A. workflow steps in instructions

# Test with specific prompts
"Act as the S.P.A. Product Owner agent and..."
"Following S.P.A. best practices, please..."
```

## Performance Issues

### Frontend Performance Problems

**Problem**: Slow page load times
```bash
Issue: First Contentful Paint > 3 seconds
```

**Solution**:
```typescript
// Implement code splitting
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Use React.memo for expensive components
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Optimize bundle size
// Check bundle analyzer
npm install --save-dev webpack-bundle-analyzer
npm run build -- --analyze

// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';
```

**Problem**: Memory leaks in React components
```bash
Issue: Memory usage continuously increasing
```

**Solution**:
```typescript
// Clean up subscriptions and timers
useEffect(() => {
  const subscription = api.subscribe();
  const timer = setInterval(() => {}, 1000);

  return () => {
    subscription.unsubscribe();
    clearInterval(timer);
  };
}, []);

// Use AbortController for API calls
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data));

  return () => controller.abort();
}, []);
```

**Problem**: Slow API responses
```bash
Issue: API calls taking > 2 seconds
```

**Solution**:
```typescript
// Implement request caching
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Use optimistic updates
const mutation = useMutation({
  mutationFn: updateTask,
  onMutate: async (newTask) => {
    await queryClient.cancelQueries(['tasks']);
    const previousTasks = queryClient.getQueryData(['tasks']);
    queryClient.setQueryData(['tasks'], old => [...old, newTask]);
    return { previousTasks };
  },
});
```

### Backend Performance Problems

**Problem**: Database queries are slow
```sql
Issue: Query execution time > 1 second
```

**Solution**:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);

-- Use composite indexes for complex queries
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM tasks WHERE project_id = $1 AND status = $2;

-- Optimize with materialized views for complex aggregations
CREATE MATERIALIZED VIEW project_stats AS
SELECT 
  project_id,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'done' THEN 1 END) as completed_tasks
FROM tasks
GROUP BY project_id;
```

**Problem**: High memory usage in Node.js
```bash
Issue: Memory usage > 512MB for simple operations
```

**Solution**:
```typescript
// Implement connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use streaming for large datasets
import { pipeline } from 'stream';
import { Transform } from 'stream';

const processLargeDataset = () => {
  return pipeline(
    dataSource,
    new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        // Process chunk
        callback(null, processedChunk);
      }
    }),
    destination,
    (err) => {
      if (err) console.error('Pipeline failed:', err);
      else console.log('Pipeline succeeded');
    }
  );
};
```

**Problem**: API rate limiting issues
```bash
Issue: 429 Too Many Requests
```

**Solution**:
```typescript
// Implement rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Implement request queuing
import Queue from 'bull';

const emailQueue = new Queue('email processing', process.env.REDIS_URL);

emailQueue.process(async (job) => {
  const { email, subject, body } = job.data;
  await sendEmail(email, subject, body);
});
```

## Integration Problems

### API Integration Issues

**Problem**: CORS errors in development
```bash
Error: Access to fetch blocked by CORS policy
```

**Solution**:
```typescript
// Backend CORS configuration
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Frontend proxy configuration (Vite)
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**Problem**: Authentication token expiration
```bash
Error: 401 Unauthorized - Token expired
```

**Solution**:
```typescript
// Implement token refresh
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', { refreshToken });
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${token}`;
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### Third-Party Service Issues

**Problem**: Stripe webhook verification fails
```bash
Error: Invalid signature
```

**Solution**:
```typescript
// Proper webhook handling
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'customer.subscription.updated':
        // Handle subscription update
        break;
    }

    res.json({received: true});
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

**Problem**: Email delivery failures
```bash
Error: SendGrid API error 403
```

**Solution**:
```typescript
// Verify SendGrid configuration
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, // Must be verified in SendGrid
      subject,
      html,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Email send error:', error);
    
    if (error.response) {
      console.error('SendGrid error:', error.response.body);
    }
    
    throw error;
  }
};

// Check domain authentication in SendGrid dashboard
// Verify sender identity
// Check API key permissions
```

## Frequently Asked Questions

### General S.P.A. Questions

**Q: How do I update the S.P.A. System to the latest version?**

A: 
```bash
# Backup current system
cp -r ~/SPA_System ~/SPA_System_backup

# Pull latest updates (if using git)
cd ~/SPA_System
git pull origin main

# Or download latest release
wget https://github.com/spa-system/releases/latest/spa-system.tar.gz
tar -xzf spa-system.tar.gz

# Run update script
./scripts/update-spa.sh
```

**Q: Can I use S.P.A. System with existing projects?**

A:
```bash
# Yes, integrate S.P.A. into existing project
cd your-existing-project

# Copy S.P.A. configuration
cp -r ~/SPA_System/.spa .
cp ~/SPA_System/package.json ./spa-package.json

# Install S.P.A. dependencies
npm install --save-dev @spa-system/cli @spa-system/quality-gates

# Initialize S.P.A. configuration
npx spa init --existing-project
```

**Q: How do I customize S.P.A. agents for my specific needs?**

A:
```yaml
# Edit agent specifications in ~/SPA_System/Agent_Definitions/
# Example: Custom Developer agent
# ~/SPA_System/Agent_Definitions/Developer/agent_spec.yaml

name: "Custom Developer"
role: "Full-Stack Developer"
expertise:
  - "React/TypeScript"
  - "Node.js/Express"
  - "Your specific tech stack"
prompts:
  code_review: "Review this code following our company standards..."
  implementation: "Implement this feature using our architecture..."
```

### Development Workflow Questions

**Q: What's the recommended Git workflow with S.P.A.?**

A:
```bash
# Feature branch workflow
git checkout -b feature/new-feature

# Use S.P.A. agents for development
# Commit with conventional commits
git commit -m "feat: add user authentication"

# Run quality gates before push
npm run spa:quality-check

# Push and create PR
git push origin feature/new-feature
gh pr create --title "Add user authentication"
```

**Q: How do I handle environment-specific configurations?**

A:
```bash
# Use environment-specific files
.env.development
.env.staging
.env.production

# S.P.A. configuration per environment
.spa/config.development.yml
.spa/config.production.yml

# Load appropriate config
export SPA_ENV=production
npm run spa:deploy
```

**Q: Can I use S.P.A. with different deployment platforms?**

A:
```bash
# S.P.A. supports multiple platforms
# Configure in .spa/deployment.yml

platforms:
  - name: "netlify"
    frontend: true
  - name: "vercel"
    frontend: true
  - name: "railway"
    backend: true
  - name: "aws"
    backend: true
    
# Deploy to specific platform
npm run spa:deploy --platform=vercel
```

### Scaling and Performance Questions

**Q: How do I scale S.P.A. projects for enterprise use?**

A:
```bash
# Enable enterprise features
npm install @spa-system/enterprise

# Configure for team collaboration
.spa/team-config.yml:
  team_size: large
  code_review: required
  quality_gates: strict
  monitoring: enabled

# Set up CI/CD for multiple environments
.github/workflows/enterprise-deploy.yml
```

**Q: What monitoring should I implement?**

A:
```typescript
// Application monitoring
import { SpaMonitoring } from '@spa-system/monitoring';

const monitoring = new SpaMonitoring({
  apiKey: process.env.SPA_MONITORING_KEY,
  environment: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
});

// Performance monitoring
monitoring.trackPerformance('api_response_time', responseTime);
monitoring.trackError('database_error', error);
monitoring.trackUserAction('task_created', { projectId, userId });
```

**Q: How do I optimize for mobile performance?**

A:
```typescript
// Mobile-specific optimizations
// Implement service worker
// Use lazy loading
// Optimize images
// Minimize bundle size

// Progressive Web App features
const PWAConfig = {
  name: 'TaskMaster Pro',
  short_name: 'TaskMaster',
  theme_color: '#000000',
  background_color: '#ffffff',
  display: 'standalone',
  start_url: '/',
  icons: [
    {
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    }
  ]
};
```

### Troubleshooting Resources

**Q: Where can I find more help?**

A:
- **Documentation**: All guides in `~/SPA_System/docs/`
- **Community**: S.P.A. Discord/Slack channels
- **GitHub Issues**: Report bugs and feature requests
- **Expert Consultation**: Use specialized ChatGPT agents
- **Video Tutorials**: S.P.A. YouTube channel
- **Office Hours**: Weekly community calls

**Q: How do I report bugs or request features?**

A:
```bash
# Create detailed bug report
spa bug-report --include-logs --include-config

# Submit feature request
spa feature-request --description "Add mobile app support"

# Contribute to S.P.A. System
git clone https://github.com/spa-system/spa-system
cd spa-system
npm install
npm run test
# Make changes and submit PR
```

Remember: The S.P.A. System is designed to be self-healing and adaptive. Most issues can be resolved by following the systematic troubleshooting approach outlined in this guide. When in doubt, consult the specialized S.P.A. agents for expert guidance tailored to your specific situation.
