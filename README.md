# 📂 CSV Uploader – ShadowSight Dashboard Utility

A client-side CSV uploader built with **Next.js**, **React**, and **Tailwind CSS**. This utility allows users to drag and drop multiple CSV files, shows real-time upload progress with a progress bar, and defers file parsing until the user explicitly clicks "Save". All uploaded files are retained after the Save action, ensuring data persistence within the session.

---

## ⚙️ Features

- 🔄 Drag-and-drop file upload with `react-dropzone`
- 📁 Multi-file support with live upload progress bars
- 🎯 Custom Tailwind components with primary color `#5750F1`
- 📊 File size display and upload status
- ✅ Parse all files only on "Save"
- 💾 Retains uploaded documents after "Save"
- 💡 Responsive grid layout for uploaded file cards

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/csv-uploader.git
cd csv-uploader

### 2. Install dependencies

```bash
npm install
# or
yarn install

### 3. Start the development server

```bash
npm run dev
# or
yarn dev
