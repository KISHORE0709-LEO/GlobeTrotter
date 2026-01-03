# Data Import Guide

## 📊 **How to Add Your Real Data**

### **Step 1: Prepare Your CSV Files**

Put your CSV files in the `data/` folder with these exact names:

#### **destinations.csv** (Required columns):
```csv
name,country_name,latitude,longitude,population,average_cost_per_day,description
Paris,France,48.8566,2.3522,2161000,150.00,"City description"
```

#### **attractions.csv** (Required columns):
```csv
name,city_name,category,description,latitude,longitude,average_visit_duration,average_cost,rating,image_url,website_url
Eiffel Tower,Paris,landmark,"Description",48.8584,2.2945,90,29.00,4.6,https://image.jpg,https://website.com
```

### **Step 2: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 3: Import Your Data**
```bash
cd backend
npm run import-data
```

### **Step 4: Verify Import**
Check your database in pgAdmin - you should see:
- New cities in `cities` table
- New attractions in `attractions` table
- Countries automatically created

## 🎯 **What Each Section Needs**

### **Search & Filtering:**
- ✅ destinations.csv (cities with costs for budget filtering)
- ✅ attractions.csv (for activity filtering)

### **Trending Sites:**
- ✅ attractions.csv (uses rating and visit data)
- Auto-calculated from user trip data

### **Community:**
- Uses real user trips and reviews
- Auto-populated from user activity

### **My Trips:**
- ✅ Real user data from registration/login
- Trip creation through frontend

## 📝 **Sample Data Included**

I've created sample files with:
- **15 popular destinations** worldwide
- **20 famous attractions** with real coordinates
- **Proper categories** for filtering
- **Real cost data** for budget filtering

## 🚀 **Quick Start**

1. Use the sample data I provided (already realistic)
2. Or replace with your own data using the same format
3. Run `npm run import-data` 
4. All filtering and search will work immediately!

## 🔍 **Filtering Features Enabled**

- **Budget filtering** (by average_cost_per_day)
- **Location search** (by city/country name)
- **Category filtering** (landmark, museum, temple, etc.)
- **Rating sorting** (highest rated first)
- **Cost sorting** (budget to luxury)