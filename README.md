# CruzOne Projects Portal

A high-performance, responsive personal projects showcase designed with a premium glassmorphic dark-mode UI. It serves as a fully featured Progressive Web Application (PWA) that aggregates baseline GitHub project repositories, fetches dynamic projects from a serverless database, showcases verified credentials, and provides interactive cloud architecture playgrounds.

---

## ✨ Features

1. **MCT Badge & Certification Showcase**: A visually stunning verified showcase of Microsoft and AWS certifications, complete with tier-colored glassmorphic backlight glows (Expert: Purple, Associate: Blue, Fundamentals: Teal, AWS: Orange, Challenge: Green) and a golden Microsoft Certified Trainer (MCT) verification banner linked directly to MS Learn.
2. **Interactive Azure Architecture Playgrounds**: Immersive, responsive SVG resource maps for key cloud-native projects. Users can click or hover on nodes to see resource descriptions, role definitions, and copy raw HashiCorp Terraform configuration code to their clipboards.
3. **Serverless NoSQL Database Integration**: Real-time project syncing using Azure Table Storage ($0.00 cost backend) with read-only operations using SAS tokens compiled client-side, and administrative write/delete CRUD operations powered by an admin-supplied SAS key.
4. **Mobile Ergonomics**: Restructured layout stacking project cards vertically on mobile screen widths (< 992px) for normal touch-scrolling, with dedicated mobile footer docks.
5. **SEO & Social Sharing Optimization**: Seamless metadata integration with Open Graph and Twitter tags for optimized sharing views, and semantic HTML structure layout for crawlability.
6. **Dynamic PWA Updates**: Fully installable offline app checking and notifying users of version updates dynamically.

---

## 🚀 Tech Stack

### Languages & Frameworks
| Technology | Badge | Version | Description |
| :--- | :--- | :--- | :--- |
| **React** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | `^19.2.6` | Client framework for dynamic UI and state rendering |
| **Vite** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=FFD62B) | `^8.0.12` | Next-generation frontend build tooling and dev server |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | `Custom` | Vanilla layout stylesheet with responsive design systems |
| **JavaScript** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | `ESNext` | Core script compilation |

### Backend & Cloud Services
| Service | Badge | Tier / Cost | Description |
| :--- | :--- | :--- | :--- |
| **Azure Table Storage** | ![Azure Storage](https://img.shields.io/badge/Azure_Storage-0089D6?style=flat-square&logo=microsoftazure&logoColor=white) | `Serverless ($0/mo)` | Low-cost, serverless NoSQL database storing projects |
| **Azure Static Web Apps** | ![Azure Static Web Apps](https://img.shields.io/badge/Azure_SWA-0089D6?style=flat-square&logo=microsoftazure&logoColor=white) | `Free Tier ($0/mo)` | Global production hosting for client distribution |
| **SAS Tokens** | ![SAS Security](https://img.shields.io/badge/Shared_Access_Signatures-0089D6?style=flat-square&logo=microsoftazure&logoColor=white) | `Built-in` | Restricts API access with read-only vs admin-write privileges |

### Frontend Utilities
| Library | Badge | Version | Description |
| :--- | :--- | :--- | :--- |
| **GSAP** | ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white) | `^3.15.0` | Professional-grade layout scaling and slider transitions |
| **PWA** | ![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=progressive-web-apps&logoColor=white) | `Service Worker` | Offline cache support and stand-alone home-screen app installs |
| **ESLint** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) | `^10.3.0` | Code quality and syntax validation engine |

---

## 🗺️ System Architecture

The portal dynamically switches active view tabs using GSAP fades, retrieves dynamic database objects, and renders interactive playgrounds.

```mermaid
graph TD
    subgraph "Client Application (React)"
        A[index.html] --> B[main.jsx]
        B --> C[App.jsx]
        
        %% Tab Switching
        C --> D{Active Tab State?}
        D -- "Projects Tab" --> E[Desktop Carousel / Mobile Stack Feed]
        D -- "Certifications Tab" --> F[MCT Showcase & Certifications Grid]
        
        %% Architecture Modal
        E --> G[View Architecture Button]
        G --> H[Interactive SVG Playground Canvas]
        H --> |Hover or Click Node| I[Load Node Terraform Code & Descriptions]
        I --> |Copy Button| J[navigator.clipboard Copy Code]
    end

    subgraph "Serverless Database & API"
        K[(Azure Table Storage)]
        C --> |Fetch via GET + Read SAS| K
        C --> |Admin POST/DELETE + Write SAS| K
    end

    subgraph "Service Worker & Offline Cache (PWA)"
        L[sw.js] <--> |"Cache assets & screenshots"| M[(Cache Storage)]
        C --> |Register SW| L
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
    ├── App.jsx              # Main Application containing Carousel Slider, Grid, Node Playgrounds, and State controller
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
