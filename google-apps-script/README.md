# Bliss Balance Footwear - Google Sheets & Drive Setup Guide

---

## 📁 Files Included in `google-apps-script/`

1. **`Code.gs`**: The Google Apps Script engine (Handles automatic Google Drive photo uploads, Google Sheets live sync, system logs, reviews, and orders).
2. **`Bliss_Balance_Database_Template.csv`**: Standard CSV template featuring the clean UK/India Footwear database layout.

---

## 🛠️ Step-by-Step Google Apps Script & Sheets Setup

### Step 1: Open Your Google Sheet
1. Open your Google Sheet named **`Website`** (or create a new Google Sheet named **`Website`**).
2. Click on **Extensions** ➔ **Apps Script** in the top menu bar.

---

### Step 2: Paste the Updated Code
1. In the Apps Script Editor, select all existing text in `Code.gs` and delete it.
2. Open [`google-apps-script/Code.gs`](file:///c:/Users/bhave/OneDrive/Desktop/Projects/Bliss%20Balance/google-apps-script/Code.gs), copy the entire file content, and paste it into `Code.gs`.
3. Click **Save** 💾 (Ctrl + S).

---

### Step 3: Run One-Time Setup
1. In the Apps Script Editor top menu, select **`setup`** from the function dropdown.
2. Click **Run** ▶️.
3. Grant permissions if prompted (Click *Advanced* ➔ *Go to Bliss Balance Script (unsafe)* ➔ *Allow*).
4. The execution log will display:
   `SUCCESS: Bliss Balance Database (Website) & Drive Folder (Bliss_Balance_Product_Photos) ready!`

---

### Step 4: Deploy as Web App (Crucial Step!)
1. Click the blue **Deploy** button at top right ➔ **Manage deployments** (or **New deployment**).
2. Click the ✏️ **Edit** icon next to your active Web App deployment.
3. In the **Version** dropdown, select **`New version`**.
4. Set **Who has access** to **`Anyone`**.
5. Click **Deploy**.
6. Copy the **Web App URL** (e.g. `https://script.google.com/macros/s/.../exec`).

---

### Step 5: Paste Web App URL in Admin Station
1. Open your website `/admin` station.
2. Go to **Tab 4: APPSCRIPT & EMAIL ENGINE**.
3. Paste the Web App URL into the **Google Apps Script Web App URL** input box and click **SAVE APPSCRIPT CONFIG**.

---

## 📸 Automatic Google Drive Photo Hosting Features
- When a product is created/updated, base64 image data is **automatically saved as PNG files** inside the Google Drive folder: **`Bliss_Balance_Product_Photos`**.
- Direct public Google Drive URLs (`https://drive.google.com/uc?id=...`) are populated in Column L (`Image URL (Google Drive)`) of your Google Sheet!
- Your Excel / Google Sheets rows remain 100% clean, formatted, and readable!
