# 🚀 Deploy New Backend Repository to GitHub & Render

## Step 1: Create New GitHub Repository

1. **Go to GitHub.com** and log in
2. **Click "New repository"** (green button)
3. **Repository name**: `hotel-room-management-backend`
4. **Description**: `Hotel room management backend API with multi-user synchronization`
5. **Make it Public** (for free Render deployment)
6. **Don't initialize** with README (we have our own files)
7. **Click "Create repository"**

## Step 2: Upload Backend Files to GitHub

### Option A: Using GitHub Web Interface (Easiest)

1. **In your new repository**, click "uploading an existing file"
2. **Drag and drop** these files from `c:\Users\Admin\Desktop\hotel\rooms\backend-room-management\`:
   - `server.js`
   - `package.json` 
   - `README.md`
   - `.gitignore`
3. **Commit message**: "Add hotel room management backend with multi-user sync"
4. **Click "Commit changes"**

### Option B: Using Git Commands (If you prefer)

```bash
# Navigate to the backend folder
cd c:\Users\Admin\Desktop\hotel\rooms\backend-room-management

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Add hotel room management backend with multi-user sync"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hotel-room-management-backend.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Render

1. **Go to [render.com](https://render.com)** and log in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub account** (if not already connected)
4. **Select your repository**: `hotel-room-management-backend`
5. **Fill in the details**:
   - **Name**: `hotel-room-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. **Click "Create Web Service"**

## Step 4: Get Your New Backend URL

After deployment (5-10 minutes), you'll get a URL like:
```
https://hotel-room-backend-XXXX.onrender.com
```

## Step 5: Update Frontend to Use New Backend

Update the API URL in your frontend:

1. **Open**: `c:\Users\Admin\Desktop\hotel\rooms\src\services\roomService.js`
2. **Change line 2** from:
   ```javascript
   const API_BASE_URL = 'https://backend-mini-1-8hth.onrender.com';
   ```
   **To**:
   ```javascript
   const API_BASE_URL = 'https://hotel-room-backend-XXXX.onrender.com';
   ```
   (Replace XXXX with your actual Render URL)

## Step 6: Test Your New Backend

Visit your new backend URL in browser:
- **Main page**: `https://hotel-room-backend-XXXX.onrender.com/`
- **Health check**: `https://hotel-room-backend-XXXX.onrender.com/health`
- **Rooms API**: `https://hotel-room-backend-XXXX.onrender.com/api/rooms`

You should see:
- ✅ API information on main page
- ✅ Health status on /health
- ✅ 3 sample rooms on /api/rooms

## Benefits of New Repository

✅ **Clean separation** - Room management backend separate from work submissions
✅ **No conflicts** - Won't interfere with existing backend
✅ **Easy to manage** - Dedicated repository for room features
✅ **Scalable** - Can add more room-related features
✅ **Better organization** - Clear purpose and structure

## What You'll Get

### 🏨 **Room Management Features**
- **Admin**: Add, edit, delete rooms
- **Student**: Update room status only
- **Multi-user sync**: Changes appear on all devices
- **Offline support**: Works without internet

### 📊 **Sample Data**
- 3 rooms ready for testing
- Different room types and statuses
- Philippine peso pricing

### 🔒 **Security**
- Role-based permissions
- Input validation
- Error handling

## Next Steps

1. **Create the repository** on GitHub
2. **Upload the files** (4 files total)
3. **Deploy to Render**
4. **Update frontend API URL**
5. **Test the system**

Once deployed, your hotel room management system will work across multiple machines with real-time synchronization! 🎉
