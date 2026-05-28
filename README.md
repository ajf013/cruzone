# CruzOne Projects Portal

A high-performance, responsive personal projects showcase designed with a premium glassmorphic dark-mode UI. It serves as a fully featured Progressive Web Application (PWA) that aggregates baseline GitHub project repositories and permits adding and managing projects dynamically.

---

## 🚀 Tech Stack

### Languages & Frameworks
| Technology | Badge | Version | Description |
| :--- | :--- | :--- | :--- |
| **React** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | `^19.2.6` | Client framework for dynamic UI and state rendering |
| **Vite** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=FFD62B) | `^8.0.12` | Next-generation frontend build tooling and dev server |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | `Custom` | Vanilla layout stylesheet with responsive design systems |
| **JavaScript** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | `ESNext` | Core script compilation |

### Libraries & Infrastructure
| Library/Service | Badge | Version | Description |
| :--- | :--- | :--- | :--- |
| **GSAP** | ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white) | `^3.15.0` | Professional-grade layout scaling and slider transitions |
| **PWA** | ![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=progressive-web-apps&logoColor=white) | `Service Worker` | Offline cache support and stand-alone home-screen app installs |
| **ESLint** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) | `^10.3.0` | Code quality and syntax validation engine |

---

## 🗺️ System Architecture

The portal dynamically switches between a GSAP-powered horizontal carousel slider on desktop viewports and a stacked card feed on mobile screen sizes.

```mermaid
graph TD
    subgraph Client Application (React & GSAP)
        A[index.html] --> B[main.jsx]
        B --> C[App.jsx]
        C --> D{Viewport Width?}
        
        %% Layout Rendering
        D -- ">= 992px (Desktop)" --> E[GSAP Horizontal Carousel Slider]
        D -- "< 992px (Mobile)" --> F[Stacked Flex Column Project Feed]
        
        %% State Management
        C --> G[(LocalStorage Projects)]
        C --> H[(Theme State)]
    end

    subgraph Service Worker & Offline Cache (PWA)
        I[sw.js] <--> |Caches Assets & screenshots| J[(Cache Storage)]
        C --> |Register SW| I
    end
```

---

## 🔄 PWA Update & Hard Refresh Lifecycle

The application actively checks for version mismatches between client local storage and the server definition using an automated fetch query, prompting a hard reload when updates occur.

```mermaid
flowchart TD
    A[App Mounts] --> B[Register sw.js]
    B --> C[Fetch version.json?t=timestamp]
    
    C --> D{Is server version different from localStorage version?}
    D -- No --> E[Continue normal usage]
    
    D -- Yes --> F[Display Update Banner on UI]
    F --> G[User clicks 'Update & Refresh']
    
    G --> H[Update localStorage version string]
    H --> I[Unregister all active Service Workers]
    I --> J[Delete all browser cache databases in 'caches']
    J --> K[Trigger window.location.reload force=true]
    K --> L[App mounts fresh with latest assets & code]
```

---

## 📂 Directory Structure

```directory
.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vite.config.js
├── public/
│   ├── favicon.svg          # Tab icon
│   ├── icon.png             # Official brand logo image
│   ├── icons.svg            # Vector UI icon definitions
│   ├── manifest.json        # PWA installation configurations
│   ├── sw.js                # Offline Service Worker cache implementation
│   ├── version.json         # Server version mapping for update notification
│   └── projects/            # Baseline project mockup screenshot assets
└── src/
    ├── main.jsx             # Entry point
    ├── App.jsx              # Main Application containing Carousel Slider, Grid, and State controller
    ├── index.css            # Stylesheet containing design system, desktop animations & mobile layout overrides
    └── assets/              # Local static assets
```

---

## 👥 Author

### 👤 Francis Ponnu Cruz I
> **Azure Cloud & DevOps Engineer | Microsoft Certified Trainer (MCT)**

#### 🌐 Connect with Me:
[![GitHub](https://img.shields.io/badge/GitHub-ajf013-181717?style=flat-square&logo=github)](https://github.com/ajf013)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Francis_Cruz-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ajf013-francis-cruz/)
[![Twitter/X](https://img.shields.io/badge/X-@Itsme__Ajf013-000000?style=flat-square&logo=x)](https://x.com/Itsme_Ajf013)
[![Website](https://img.shields.io/badge/Website-fcruz.org-2D3748?style=flat-square&logo=googlechrome&logoColor=white)](https://fcruz.org)
[![Linktree](https://img.shields.io/badge/Linktree-AJF013-39E09B?style=flat-square&logo=linktree&logoColor=white)](https://linktr.ee/AJF013)
