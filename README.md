# 🌍 EcoTracker App

EcoTracker is a mobile and web-based application built to empower local Pakistani citizens to report environmental or civic issues in their surroundings. Whether it's water leakage, garbage dumps, broken roads, or streetlight problems — users can report the problem directly from their phones with location, description, and images.

---

## 🚀 Tech Stack

### 📱 Frontend
- React Native (Expo)
- Google Maps (Expo Maps)

### 🌐 Backend
- Node.js
- Express.js
- MongoDB

---

## 💡 Key Features

### 👥 User Panel
- 📍 **Report Issues** with location (auto-detected), description, and image
- 🗺️ Google Maps integration (via Expo) to mark issue location
- 📄 View **report history** (all previously submitted reports)
- 🔐 User **authentication** (Login/Signup)

### 🛠️ Admin Panel
- 🔐 Admin login
- 📥 View all incoming reports
- 🧾 View full details of each report
- 🔁 Update report status: `Pending → In Progress → Resolved/Rejected`
- 📲 Status updates are sent to the respective users

---

## 📸 Screenshots

### 📱 Login & Signup
![Ecotracker Signup Screen](https://github.com/user-attachments/assets/1fda6138-8c81-43f4-909f-52d7994a93d6)

![Ecotracker Login Screen](https://github.com/user-attachments/assets/4035e61a-87f8-4f89-b06e-f2b6dd12996d)

### 📱 User 

![Ecotracker Home Screen](https://github.com/user-attachments/assets/47e5540a-fde4-4c6f-962b-0c7feaba3e84)
![Ecotracker Home Screen 2](https://github.com/user-attachments/assets/705e4ce3-2833-46a9-9e52-b48975fe7b34)

![Ecotracker User Report Screen](https://github.com/user-attachments/assets/f3b50f15-7c5f-454d-88f3-dab333f8d1d8)
![Ecotracker User Report Screen 2](https://github.com/user-attachments/assets/b5a79680-62d8-4bbf-bd0a-26c231163cd6)

![Ecotracker User Analytics Screen](https://github.com/user-attachments/assets/931a8c9d-795e-4489-922c-371491cda9a8)
![Ecotracker User Analytics Screen 2](https://github.com/user-attachments/assets/34b8f9b1-6039-4dbf-968b-3c8a18b7a4da)


### 🧑‍💼 Admin Panel - Report Management

![EcoTracker Admin Dashboard](https://github.com/user-attachments/assets/f2153ca7-3209-4930-9a95-3e10bde71935)

![EcoTracker Admin Report details](https://github.com/user-attachments/assets/cf4eddc3-ad2f-429f-9c91-cd13083a13be)

![EcoTracker Admin inprogress filter](https://github.com/user-attachments/assets/8603869f-8978-417f-aab8-638654febf55)

![EcoTracker Admin resolved filter](https://github.com/user-attachments/assets/7f0756d7-5105-42e5-b439-a53c7696c025)

![EcoTracker Admin rejected filter](https://github.com/user-attachments/assets/a52aeedd-f46c-4b05-bd75-4beb8514495c)

---

## 🧪 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ecotracker.git

# Install dependencies
cd ecotracker
npm install

# Start Expo
npx expo start
Make sure your backend server is running (Node + MongoDB).

🌐 Use Case
EcoTracker is specially designed to serve local communities in Pakistan, where reporting small municipal issues is often ignored or inefficient. This app ensures:

Easy public issue reporting

Transparency in issue resolution

Community engagement

A centralized platform for civic feedback

🙌 Contribution
Pull requests are welcome! For any major change, please open an issue first.

📬 Contact
Email: rohanameen55@gmail.com
LinkedIn: www.linkedin.com/in/rohan-ameen-200a87278
