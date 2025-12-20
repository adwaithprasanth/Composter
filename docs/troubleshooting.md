# Troubleshooting Guide

Common issues and solutions for Composter.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Authentication Issues](#authentication-issues)
- [CLI Issues](#cli-issues)
- [API Issues](#api-issues)
- [MCP Issues](#mcp-issues)
- [Database Issues](#database-issues)
- [Frontend Issues](#frontend-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### `npm install -g composter-cli` fails

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**

**Option 1: Use npx (no installation)**
```bash
npx composter-cli login
```

**Option 2: Fix npm permissions**
```bash
# Create directory for global packages
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Try again
npm install -g composter-cli
```

**Option 3: Use sudo (not recommended)**
```bash
sudo npm install -g composter-cli
```

### Module not found errors

**Symptoms:**
```
Error: Cannot find module 'xyz'
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Authentication Issues

### "Not authenticated" error

**Symptoms:**
```
Error: Not authenticated. Please run 'composter login'
```

**Solution:**
```bash
# Login again
composter login

# Check session file exists
ls -la ~/.config/composter/session.json

# If file exists but still fails, delete and re-login
rm ~/.config/composter/session.json
composter login
```

### Session expired

**Symptoms:**
```
Error: Session expired. Please login again.
```

**Solution:**
```bash
# Sessions last 30 days, just re-login
composter login
```

### "Invalid credentials" on login

**Symptoms:**
```
Error: Invalid email or password
```

**Solutions:**
1. Double-check email and password
2. Reset password on web dashboard: [composter.vercel.app](https://composter.vercel.app)
3. Try creating new account if forgotten

### CORS errors in browser

**Symptoms:**
```
Access to fetch at 'https://composter.onrender.com' has been blocked by CORS policy
```

**Solutions:**

**For Users:**
- This shouldn't happen with the hosted version
- Clear browser cache and cookies
- Try incognito/private mode

**For Self-Hosters:**
```bash
# Check CLIENT_URL in api/.env matches your frontend URL
CLIENT_URL="https://your-frontend.com"

# Restart API server
cd api && npm restart
```

## CLI Issues

### Command not found: composter

**Symptoms:**
```bash
$ composter
command not found: composter
```

**Solutions:**

**Option 1: Check installation**
```bash
npm list -g composter-cli
```

**Option 2: Use full path**
```bash
# Find where npm installs global packages
npm root -g

# Use full path
~/.npm-global/bin/composter login
```

**Option 3: Use npx**
```bash
npx composter-cli login
```

### "ECONNREFUSED" error

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solution:**

**For Users:**
- API might be down, check status
- Check internet connection

**For Self-Hosters:**
```bash
# Check API is running
curl http://localhost:3000/health

# Check .env file
cat cli/.env
# Should be: BASE_URL="http://localhost:3000/api"

# If using production:
# BASE_URL="https://composter.onrender.com/api"
```

### Components not appearing after push

**Symptoms:**
Component pushed successfully but not showing in `composter ls`

**Solution:**
```bash
# Check category exists
composter lscat

# List components in category
composter ls <category-name>

# If still missing, try pulling from web dashboard
# Go to: https://composter.vercel.app/dashboard
```

### File not found when pushing

**Symptoms:**
```
Error: File not found: ./component.jsx
```

**Solution:**
```bash
# Check file exists
ls -la ./component.jsx

# Use absolute path
composter push buttons "Button" /full/path/to/Button.jsx

# Check current directory
pwd
```

## API Issues

### API health check fails

**Symptoms:**
```bash
$ curl http://localhost:3000/health
curl: (7) Failed to connect to localhost port 3000
```

**Solution:**
```bash
# Check if API is running
ps aux | grep node

# Check if port is in use
lsof -i :3000

# Start API
cd api && npm run dev

# Check logs
cd api && npm run dev 2>&1 | tee api.log
```

### Database connection errors

**Symptoms:**
```
Error: Can't reach database server
```

**Solution:**
```bash
# Check DATABASE_URL in api/.env
cat api/.env | grep DATABASE_URL

# Test PostgreSQL connection
psql "$DATABASE_URL" -c "SELECT 1;"

# If using Neon/cloud database:
# - Check database is not paused
# - Verify connection string is correct
# - Test network connectivity
```

### Better Auth migration errors

**Symptoms:**
```
Error: relation "user" does not exist
```

**Solution:**
```bash
cd api

# Run Prisma migrations first
npx prisma migrate dev

# Then Better Auth migrations
npx @better-auth/cli migrate

# Verify tables exist
psql "$DATABASE_URL" -c "\dt"
```

### Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in api/.env
PORT=3001
```

## MCP Issues

### AI assistant doesn't recognize Composter

**Symptoms:**
AI responds with "I don't have access to Composter" or doesn't use MCP tools

**Solutions:**

1. **Verify config file exists:**
   ```bash
   # Claude Desktop (macOS)
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Cursor
   cat .cursor/mcp.json
   
   # VS Code
   cat .vscode/mcp.json
   ```

2. **Validate JSON syntax:**
   ```bash
   # Use jq to check
   cat mcp.json | jq .
   ```

3. **Restart AI assistant completely:**
   - Quit the application (don't just close window)
   - Reopen

4. **Check logs:**
   ```bash
   # Claude Desktop logs
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

### "Composter MCP server not found"

**Symptoms:**
```
Error: MCP server 'composter' failed to start
```

**Solution:**
```bash
# Check composter-mcp is installed
npm list -g composter-mcp

# Install if missing
npm install -g composter-mcp

# Verify npx can find it
npx composter-mcp --version

# Test MCP server manually
npx composter-mcp
```

### MCP authentication fails

**Symptoms:**
```
Error: Authentication failed - no valid session found
```

**Solution:**
```bash
# Login via CLI first
composter login

# Verify session exists
cat ~/.config/composter/session.json

# Check session hasn't expired
# Sessions last 30 days

# Re-login if needed
rm ~/.config/composter/session.json
composter login
```

### MCP returns empty results

**Symptoms:**
AI says "You don't have any categories" but you know you do

**Solution:**
```bash
# Verify via CLI first
composter lscat

# Check session is valid
composter ls

# If CLI works but MCP doesn't:
# 1. Restart AI assistant
# 2. Re-run MCP init
npx composter-mcp init claude  # or cursor/vscode/windsurf

# 3. Check MCP logs for errors
```

## Database Issues

### Prisma migration errors

**Symptoms:**
```
Error: Migration failed to apply
```

**Solution:**
```bash
cd api

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or apply migrations incrementally
npx prisma migrate deploy

# If migrations are out of sync:
npx prisma migrate resolve --applied <migration_name>
```

### "relation already exists"

**Symptoms:**
```
Error: relation "Category" already exists
```

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# If migrations are applied but Prisma thinks they're not:
npx prisma migrate resolve --applied <migration_name>

# Or start fresh (WARNING: deletes data)
npx prisma migrate reset
```

### Database locked

**Symptoms:**
```
Error: database is locked
```

**Solution:**
```bash
# Close all connections to database
# Kill any running API processes
pkill -f "node.*api"

# Restart PostgreSQL
sudo systemctl restart postgresql

# Try migration again
npx prisma migrate dev
```

## Frontend Issues

### Blank page after deployment

**Symptoms:**
Frontend shows blank page, no errors

**Solution:**
```bash
# Check browser console (F12)
# Look for errors

# Common issue: API URL incorrect
# Check frontend/.env
VITE_API_URL="https://your-api.com"

# Rebuild
npm run build

# Check build output
ls -la dist/
```

### Components not loading

**Symptoms:**
Dashboard shows "No components found" but they exist

**Solution:**
```bash
# Check network tab (F12) for API errors
# Verify API is accessible

# Test API directly
curl https://your-api.com/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check CORS configuration in api/.env
CLIENT_URL="https://your-frontend.com"
```

### Build failures

**Symptoms:**
```
npm run build failed
```

**Solution:**
```bash
# Clear cache
rm -rf node_modules .vite

# Reinstall
npm install

# Check Node version (needs 18+)
node --version

# Try building with verbose output
npm run build -- --debug
```

## Performance Issues

### Slow API responses

**Symptoms:**
API calls take >5 seconds

**Solutions:**

1. **Check database connection latency:**
   ```bash
   # If using cloud database, test ping
   ping your-database.com
   ```

2. **Enable database joins in Better Auth:**
   ```javascript
   // api/auth/auth.js
   export const auth = betterAuth({
     experimental: { joins: true }
   });
   ```

3. **Add database indexes:**
   ```sql
   CREATE INDEX idx_component_category ON "Component"("category");
   CREATE INDEX idx_component_user ON "Component"("userId");
   ```

4. **Use connection pooling:**
   ```javascript
   // api/prisma.js
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + "?connection_limit=10"
       }
     }
   });
   ```

### High memory usage

**Symptoms:**
API process using excessive RAM

**Solution:**
```bash
# Monitor memory
top -p $(pgrep -f "node.*api")

# Restart API regularly (use PM2)
pm2 restart composter-api

# Adjust Node memory limit
NODE_OPTIONS="--max-old-space-size=512" npm start
```

### Frontend slow to load

**Symptoms:**
Initial page load takes >10 seconds

**Solutions:**

1. **Enable production build:**
   ```bash
   npm run build
   npm run preview  # Don't use 'dev' in production
   ```

2. **Check bundle size:**
   ```bash
   npm run build -- --stats
   # Analyze build/stats.html
   ```

3. **Use CDN for assets** (if self-hosting)

## Getting More Help

If these solutions don't help:

1. **Check GitHub Issues:** [github.com/binit2-1/Composter/issues](https://github.com/binit2-1/Composter/issues)

2. **Search Discussions:** [github.com/binit2-1/Composter/discussions](https://github.com/binit2-1/Composter/discussions)

3. **Open New Issue:**
   - Include error messages
   - Describe steps to reproduce
   - Mention your environment (OS, Node version, etc.)
   - Share relevant logs

4. **Check Logs:**
   ```bash
   # API logs
   cd api && npm run dev 2>&1 | tee debug.log
   
   # MCP logs
   tail -f ~/.composter/mcp.log
   
   # System logs
   journalctl -u composter-api -n 100
   ```

## Debug Mode

Enable verbose logging for troubleshooting:

**CLI:**
```bash
export DEBUG=composter:*
composter login
```

**API:**
```bash
export DEBUG=*
cd api && npm run dev
```

**MCP:**
```json
{
  "mcpServers": {
    "composter": {
      "command": "npx",
      "args": ["composter-mcp"],
      "env": {
        "DEBUG": "composter:*"
      }
    }
  }
}
```

## See Also

- [Getting Started Guide](getting-started.md)
- [CLI Reference](cli-reference.md)
- [API Reference](api-reference.md)
- [MCP Integration](mcp-integration.md)
- [Self-Hosting Guide](self-hosting.md)
- [Contributing Guide](../CONTRIBUTING.md)
