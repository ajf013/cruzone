import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUser, useClerk, SignIn } from '@clerk/clerk-react';
import { deduceLiveUrl, getScreenshotUrl } from './services/aiService';

// Baseline projects mapping to real GitHub profile ajf013
const BASELINE_PROJECTS = [
  {
    id: "baseline-ats-analyzer",
    place: "Azure AI / React",
    title: "ATS RESUME",
    title2: "ANALYZER",
    description: "Analyze your resume for ATS compatibility, skill gaps & get actionable improvement suggestions — powered by Azure AI.",
    image: "./projects/ats_analyzer.png",
    liveUrl: "https://atsscore.fcruz.org/",
    repoUrl: "https://github.com/ajf013/ATS-Resume-Score-Checker",
    isManual: false,
    hasArchitecture: false
  },
  {
    id: "baseline-cloudsentry",
    place: "NextJS / Gemini",
    title: "CLOUD",
    title2: "SENTRY",
    description: "AI-powered security scanner for Azure subscriptions. Provides cloud node maps, threat monitoring alerts, and compliance auditing checks.",
    image: "./projects/cloudsentry.png",
    liveUrl: "https://cloudsentry.fcruz.org/",
    repoUrl: "https://github.com/ajf013/CloudSentry",
    isManual: false,
    hasArchitecture: true
  },
  {
    id: "baseline-finops",
    place: "React / FinOps",
    title: "AZURE FINANCIAL",
    title2: "INSIGHTS",
    description: "Cloud spend management dashboard with glassmorphism UI. Integrates real-time budget enforcement and cloud cost calculations.",
    image: "./projects/financial_insights.png",
    liveUrl: "https://finops.fcruz.org/",
    repoUrl: "https://github.com/ajf013/Azure-Financial-Insights",
    isManual: false,
    hasArchitecture: true
  },
  {
    id: "baseline-cruzops",
    place: "React / Azure OpenAI",
    title: "CRUZOPS",
    title2: "AI",
    description: "ChatGPT-like conversational scripting assistant for Azure. Generates administration scripts via conversational AI.",
    image: "./projects/cruzops_ai.png",
    liveUrl: "https://pscli.fcruz.org/",
    repoUrl: "https://github.com/ajf013/CruzOps-AI",
    isManual: false,
    hasArchitecture: true
  },
  {
    id: "baseline-unicompile",
    place: "NextJS / WASM",
    title: "UNI",
    title2: "COMPILE",
    description: "Multi-language online compiler running online and offline. Runs client-side sandboxed execution of compiler binaries.",
    image: "./projects/unicompile.png",
    liveUrl: "https://unicompile.fcruz.org/",
    repoUrl: "https://github.com/ajf013/UniCompile",
    isManual: false,
    hasArchitecture: false
  },
  {
    id: "baseline-sticky-notes",
    place: "React / Supabase",
    title: "STICKY NOTES",
    title2: "APP",
    description: "Real-time synchronized dashboard notes manager. Features interactive sticky notes with Supabase backend database sync.",
    image: "./projects/sticky_notes.png",
    liveUrl: "https://sticky-notes.fcruz.org/",
    repoUrl: "https://github.com/ajf013/sticky-notes-app",
    isManual: false,
    hasArchitecture: false
  },
  {
    id: "baseline-converter",
    place: "React / WASM",
    title: "CONVERTER",
    title2: "APP",
    description: "Privacy-friendly offline browser file conversion tool. Conducts client-side format conversion for images, docs, and audio.",
    image: "./projects/converter_app.png",
    liveUrl: "https://convertme.fcruz.org/",
    repoUrl: "https://github.com/ajf013/converter-app",
    isManual: false,
    hasArchitecture: false
  },
  {
    id: "baseline-music-player",
    place: "React / YouTube API",
    title: "MUSIC PLAYER",
    title2: "REACT",
    description: "Advanced audio player with YouTube sync and loop controls. Features custom audio player interface with Semantic UI styling.",
    image: "./projects/music_player.png",
    liveUrl: "https://music.fcruz.org/",
    repoUrl: "https://github.com/ajf013/musicplayerreact",
    isManual: false,
    hasArchitecture: false
  },
  {
    id: "baseline-portfolio",
    place: "React / Node",
    title: "FRANCIS AJF",
    title2: "PORTFOLIO",
    description: "Personal portfolio website showcasing skills & certificates. Features dynamic timeline animations and rendering logic.",
    image: "./projects/francis_portfolio.png",
    liveUrl: "https://fcruz.org",
    repoUrl: "https://github.com/ajf013/francis-ajf-portfolio",
    isManual: false,
    hasArchitecture: false
  }
];

const FALLBACK_GITHUB_PROFILE = {
  avatar_url: "https://avatars.githubusercontent.com/u/74620353?v=4",
  name: "Francis Ponnu Cruz I",
  login: "ajf013",
  bio: "Microsoft Certified Trainer (MCT) | Solutions Architect Expert | Specialized in Azure, React, Node.js & AI integrations.",
  location: "Sydney, Australia",
  company: "CruzOne Solutions",
  blog: "https://fcruz.org",
  public_repos: 28,
  followers: 142,
  following: 86,
  created_at: "2020-11-16T12:00:00Z"
};

const FALLBACK_GITHUB_REPOS = [
  {
    name: "ATS-Resume-Score-Checker",
    description: "Analyze your resume for ATS compatibility, skill gaps & get actionable improvement suggestions — powered by Azure AI.",
    language: "JavaScript",
    stargazers_count: 32,
    forks_count: 8,
    html_url: "https://github.com/ajf013/ATS-Resume-Score-Checker"
  },
  {
    name: "CloudSentry",
    description: "AI-powered security scanner for Azure subscriptions. Provides cloud node maps, threat monitoring alerts, and compliance auditing checks.",
    language: "JavaScript",
    stargazers_count: 24,
    forks_count: 5,
    html_url: "https://github.com/ajf013/CloudSentry"
  },
  {
    name: "Azure-Financial-Insights",
    description: "Cloud spend management dashboard with glassmorphism UI. Integrates real-time budget enforcement and cloud cost calculations.",
    language: "CSS",
    stargazers_count: 18,
    forks_count: 3,
    html_url: "https://github.com/ajf013/Azure-Financial-Insights"
  },
  {
    name: "CruzOps-AI",
    description: "ChatGPT-like conversational scripting assistant for Azure. Generates administration scripts via conversational AI.",
    language: "JavaScript",
    stargazers_count: 15,
    forks_count: 2,
    html_url: "https://github.com/ajf013/CruzOps-AI"
  }
];

const FALLBACK_GITHUB_README = `
<div align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=0078D4&center=true&vCenter=true&width=700&lines=Hi+there%2C+I'm+Francis+Cruz+%F0%9F%91%8B;Azure+Cloud+%26+DevOps+Engineer+%E2%98%81%EF%B8%8F;Microsoft+Certified+Trainer+(MCT)+%F0%9F%8E%93;Building+Secure+%26+Scalable+Cloud+Solutions" alt="Typing SVG" /></a>
 
<br/>
<a href="https://github.com/ajf013?tab=repositories"><img src="https://img.shields.io/badge/dynamic/json?color=0078D4&label=Repositories&query=%24.public_repos&url=https%3A%2F%2Fapi.github.com%2Fusers%2Fajf013&logo=github&logoColor=white&style=flat" alt="GitHub Repositories" /></a>
&nbsp;
<img src="https://img.shields.io/badge/Joined-2020%20(%7E6%20Years)-0078D4?style=flat&logo=github&logoColor=white" alt="Joined GitHub" />
&nbsp;
<img src="https://komarev.com/ghpvc/?username=ajf013&label=Profile%20Views&color=0078D4&style=flat" alt="Profile Views" />
&nbsp;
<a href="https://github.com/ajf013"><img src="https://img.shields.io/github/followers/ajf013?label=Followers&style=flat&color=0078D4" alt="GitHub followers" /></a>
&nbsp;
<a href="https://www.linkedin.com/in/ajf013-francis-cruz/"><img src="https://img.shields.io/badge/LinkedIn-Connect-0078D4?style=flat&logo=linkedin" alt="LinkedIn" /></a>
</div>

---

## 💁 About Me

\`\`\`yaml
Name:        Francis Ponnu Cruz I
Title:       Azure Cloud & DevOps Engineer | Microsoft Certified Trainer (MCT)
Company:     Wipro
Location:    Coimbatore, Tamil Nadu, India
Education:
  - M.Tech in Computing Systems & Infrastructure — BITS Pilani (Wipro WILP, 2025)
  - BCA — KG College of Arts & Science, Bharathiar University (2021)
Focus:       Cloud Architecture · DevOps · Security · Automation · SRE
Status:      🟢 Open to new opportunities
\`\`\`

I'm a results-driven Azure Cloud & DevOps Engineer with **4+ years** of experience designing, automating, and securing enterprise-scale cloud infrastructure. I specialize in Infrastructure as Code, CI/CD pipelines, cloud governance, and AI-powered cloud solutions. I enjoy turning complex cloud challenges into clean, automated, and cost-efficient architectures.

---

## 🎯 What I'm Currently Focused On

- 🏗️ Deepening expertise in **Cloud Solutions Architecture** (working toward AZ-305 real-world projects)
- 🔁 Expanding **DevOps & SRE** practices — GitOps, observability, and reliability engineering
- 🤖 Exploring **Azure AI Services** and building intelligent cloud-native applications
- 📖 Upskilling in **FinOps** and cloud cost governance at scale
- 🌐 **Open to new roles** in Azure Cloud, DevOps, and Cloud Architecture
`;

const CERTIFICATIONS = [
  {
    id: "mct",
    title: "Microsoft Certified Trainer",
    subtitle: "MCT (2023 - 2026)",
    issuer: "Microsoft",
    date: "Active",
    badge: "mct",
    type: "Trainer",
    desc: "Microsoft's premier technical training credential, verifying pedagogy skills and authorization to deliver official curriculum.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "solutions-architect",
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    subtitle: "Expert",
    issuer: "Microsoft",
    date: "July 3, 2023",
    badge: "expert",
    type: "Expert",
    desc: "Validates expertise in designing cloud solutions spanning compute, network, storage, governance, and security infrastructures.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "designing-azure-solutions",
    title: "Microsoft Certified: Designing Azure Infrastructure Solutions",
    subtitle: "Specialty",
    issuer: "Microsoft",
    date: "June 15, 2023",
    badge: "associate",
    type: "Specialty",
    desc: "Validates advanced skills in designing Azure infrastructure solutions, including compute, storage, networking, and security.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-administrator",
    title: "Microsoft Certified: Azure Administrator Associate",
    subtitle: "Associate",
    issuer: "Microsoft",
    date: "September 16, 2021",
    badge: "associate",
    type: "Associate",
    desc: "Validates skills in implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks in cloud environments.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-security",
    title: "Microsoft Certified: Azure Security Engineer Associate",
    subtitle: "Associate",
    issuer: "Microsoft",
    date: "November 4, 2022",
    badge: "associate",
    type: "Associate",
    desc: "Validates capabilities in implementing threat protection, managing identity access, and securing networks, data, and applications.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-network",
    title: "Microsoft Certified: Azure Network Engineer Associate",
    subtitle: "Associate",
    issuer: "Microsoft",
    date: "July 31, 2022",
    badge: "associate",
    type: "Associate",
    desc: "Validates routing and network design capabilities, virtual networking, load balancing, hybrid connections, and network security policies.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "aws-practitioner",
    title: "AWS Certified Cloud Practitioner",
    subtitle: "Amazon Web Services",
    issuer: "Amazon Web Services",
    date: "February 18, 2022",
    badge: "aws",
    type: "AWS",
    desc: "Validates a high-level understanding of AWS Cloud services, basic security guidelines, compliance, and billing systems.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-fundamentals",
    title: "Microsoft Certified: Azure Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "March 24, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates foundational knowledge of cloud concepts, core Azure services, management tools, security, governance, and cost tracking.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-data",
    title: "Microsoft Certified: Azure Data Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "July 30, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates foundational knowledge of core data concepts and how they are implemented using Azure data services.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "azure-ai",
    title: "Microsoft Certified: Azure AI Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "March 26, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates foundational understanding of machine learning (ML) and artificial intelligence (AI) workloads and their Azure implementations.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "security-fundamentals",
    title: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "August 12, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates baseline knowledge of security, compliance, and identity solutions across Microsoft cloud services.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "power-platform",
    title: "Microsoft Certified: Power Platform Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "September 5, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates understanding of the business value and product capabilities of Power Platform (Power Apps, Power BI, Automate).",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "m365-fundamentals",
    title: "Microsoft 365 Certified: Fundamentals",
    subtitle: "Fundamentals",
    issuer: "Microsoft",
    date: "August 17, 2021",
    badge: "fundamentals",
    type: "Fundamentals",
    desc: "Validates foundational understanding of the options available in Microsoft 365, cloud service lifecycles, and security practices.",
    verifyUrl: "https://www.credly.com/users/fcruz"
  },
  {
    id: "ms-challenge",
    title: "MS Cloud Skills Challenge Champion",
    subtitle: "Microsoft Americas Team",
    issuer: "Microsoft",
    date: "February 21, 2021",
    badge: "challenge",
    type: "Champion",
    desc: "Special recognition from the Microsoft Americas Azure Team for cloud skill mastery challenges.",
    verifyUrl: "https://learn.microsoft.com/en-us/users/fcruz-1301/credentials/certifications"
  }
];

const ARCHITECTURES = {
  "baseline-cloudsentry": {
    title: "CloudSentry Architecture",
    description: "Multi-layered serverless security auditing architecture powered by Azure Functions, Cosmos DB, and Azure OpenAI to scan, store, and analyze cloud vulnerabilities.",
    nodes: [
      {
        id: "client",
        label: "React Frontend",
        type: "IaaS",
        x: 15,
        y: 50,
        role: "Hosts the dashboard, displays alerts, cloud node maps, and compliance reports.",
        terraform: `resource "azurerm_static_web_app" "portal" {
  name                = "stapp-cloudsentry-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2"
  sku_tier            = "Free"
}`
      },
      {
        id: "apim",
        label: "Azure API Management",
        type: "Network",
        x: 35,
        y: 50,
        role: "Secures external API endpoints, enforces rate-limiting policies, and handles CORS validation.",
        terraform: `resource "azurerm_api_management" "apim" {
  name                = "apim-cloudsentry-gateway"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  publisher_name      = "CruzOne"
  publisher_email     = "admin@fcruz.org"
  sku_name            = "Consumption_0"
}`
      },
      {
        id: "keyvault",
        label: "Azure Key Vault",
        type: "Security",
        x: 35,
        y: 20,
        role: "Safely stores the subscription scanner credentials, Service Principal keys, and API tokens.",
        terraform: `resource "azurerm_key_vault" "kv" {
  name                = "kv-cloudsentry-prod"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
  purge_protection_enabled = false
}`
      },
      {
        id: "function",
        label: "Azure Function (Scanner)",
        type: "Compute",
        x: 60,
        y: 50,
        role: "Triggered on schedules or events. Iterates through subscription configurations to detect compliance drift.",
        terraform: `resource "azurerm_linux_function_app" "scanner" {
  name                = "func-cloudsentry-scanner"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id
  storage_account_name       = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key
  
  site_config {
    application_stack {
      node_version = "18"
    }
  }
}`
      },
      {
        id: "cosmos",
        label: "Azure Cosmos DB",
        type: "Database",
        x: 85,
        y: 50,
        role: "Stores raw scan results, historical threat logs, compliance baseline histories, and audit records.",
        terraform: `resource "azurerm_cosmosdb_account" "db" {
  name                = "cosmos-cloudsentry-data"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}`
      },
      {
        id: "openai",
        label: "Azure OpenAI Service",
        type: "AI",
        x: 60,
        y: 80,
        role: "Processes vulnerability descriptions, evaluates impact risk, and generates custom remediation scripts.",
        terraform: `resource "azurerm_cognitive_account" "openai" {
  name                = "cog-cloudsentry-openai"
  location            = "eastus"
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "OpenAI"
  sku_name            = "S0"
}`
      }
    ],
    connections: [
      { from: "client", to: "apim" },
      { from: "apim", to: "function" },
      { from: "keyvault", to: "function" },
      { from: "function", to: "cosmos" },
      { from: "function", to: "openai" }
    ]
  },
  "baseline-finops": {
    title: "Azure Financial Insights Architecture",
    description: "FinOps architecture aggregating cost analytics via Microsoft Cost Management APIs, storing logs in serverless Azure Table Storage, and alerting administrators of budget drifts.",
    nodes: [
      {
        id: "client",
        label: "React Client",
        type: "IaaS",
        x: 15,
        y: 50,
        role: "Renders spend graphs, optimization cards, and provides budget configuration controls.",
        terraform: `resource "azurerm_static_web_app" "finops_portal" {
  name                = "stapp-finops-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "westeurope"
  sku_tier            = "Free"
}`
      },
      {
        id: "costapi",
        label: "Cost Management API",
        type: "Network",
        x: 40,
        y: 25,
        role: "Microsoft API querying real-time subscription consumption and resource group invoice data.",
        terraform: `resource "azurerm_subscription_cost_anomaly_alert" "cost_alert" {
  name            = "anomaly-detector"
  subscription_id = "/subscriptions/6556862d-2bee-43e2-bd37-4493ea5c1c70"
  email_receivers = ["admin@fcruz.org"]
}`
      },
      {
        id: "tablestorage",
        label: "Azure Table Storage",
        type: "Database",
        x: 40,
        y: 75,
        role: "Zero-cost database storing budget thresholds, configured metrics, and historical logs.",
        terraform: `resource "azurerm_storage_table" "budgets" {
  name                 = "budgets"
  storage_account_name = azurerm_storage_account.sa.name
}`
      },
      {
        id: "alertfunc",
        label: "Budget Watcher Function",
        type: "Compute",
        x: 65,
        y: 50,
        role: "Compares current daily spend logs with configured budgets, executing anomaly detection tasks.",
        terraform: `resource "azurerm_linux_function_app" "budget_watcher" {
  name                       = "func-finops-budgetwatcher"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  service_plan_id            = azurerm_service_plan.asp.id
  storage_account_name       = azurerm_storage_account.sa.name
  storage_account_access_key = azurerm_storage_account.sa.primary_access_key
}`
      },
      {
        id: "monitor",
        label: "Azure Monitor / Alerts",
        type: "Security",
        x: 88,
        y: 50,
        role: "Generates push notifications, metrics alerts, and sends WhatsApp or Email alerts to the administrator.",
        terraform: `resource "azurerm_monitor_action_group" "ops" {
  name                = "finops-action-group"
  resource_group_name = azurerm_resource_group.rg.name
  short_name          = "finops-alert"

  email_receiver {
    name          = "send_admin"
    email_address = "admin@fcruz.org"
  }
}`
      }
    ],
    connections: [
      { from: "client", to: "costapi" },
      { from: "client", to: "tablestorage" },
      { from: "costapi", to: "tablestorage" },
      { from: "costapi", to: "alertfunc" },
      { from: "tablestorage", to: "alertfunc" },
      { from: "alertfunc", to: "monitor" }
    ]
  },
  "baseline-cruzops": {
    title: "CruzOps AI Architecture",
    description: "Secure, managed NLP scripting pipeline invoking Azure OpenAI Service (GPT-4o) using Managed Identities to generate cloud configuration scripts instantly.",
    nodes: [
      {
        id: "client",
        label: "Web Chat UI",
        type: "IaaS",
        x: 15,
        y: 50,
        role: "User-facing terminal chat interface that accepts natural language queries and renders scripts.",
        terraform: `resource "azurerm_static_web_app" "cruzops_portal" {
  name                = "stapp-cruzops-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2"
  sku_tier            = "Free"
}`
      },
      {
        id: "appservice",
        label: "Azure App Service",
        type: "Compute",
        x: 35,
        y: 50,
        role: "Hosts the back-end middleware, orchestrates prompt safety filters, and routes OpenAI responses.",
        terraform: `resource "azurerm_linux_web_app" "backend" {
  name                = "app-cruzops-backend"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {}
  
  identity {
    type = "SystemAssigned"
  }
}`
      },
      {
        id: "identity",
        label: "Managed Identity",
        type: "Security",
        x: 35,
        y: 20,
        role: "System-assigned active directory identity that authenticates the App Service to the Key Vault securely.",
        terraform: `// Included inside the Web App identity block:
// identity {
//   type = "SystemAssigned"
// }`
      },
      {
        id: "keyvault",
        label: "Azure Key Vault",
        type: "Security",
        x: 60,
        y: 20,
        role: "Stores OpenAI API endpoint configurations, deployment keys, and rate metrics safely.",
        terraform: `resource "azurerm_key_vault_access_policy" "read_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_web_app.backend.identity[0].principal_id

  secret_permissions = ["Get", "List"]
}`
      },
      {
        id: "openai",
        label: "Azure OpenAI (GPT-4o)",
        type: "AI",
        x: 60,
        y: 50,
        role: "Private AI endpoint. Resolves natural language requests into structured CLI or Terraform code.",
        terraform: `resource "azurerm_cognitive_deployment" "gpt4" {
  name                 = "gpt-4o"
  cognitive_account_id = azurerm_cognitive_account.openai.id
  model {
    format  = "OpenAI"
    name    = "gpt-4o"
    version = "2024-05-13"
  }
  sku {
    name = "Standard"
  }
}`
      },
      {
        id: "loganalytics",
        label: "Log Analytics Workspace",
        type: "Database",
        x: 85,
        y: 50,
        role: "Logs audit logs, request telemetry, prompt token costs, and system performance.",
        terraform: `resource "azurerm_log_analytics_workspace" "logs" {
  name                = "log-cruzops-audit"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}`
      }
    ],
    connections: [
      { from: "client", to: "appservice" },
      { from: "appservice", to: "identity" },
      { from: "identity", to: "keyvault" },
      { from: "appservice", to: "openai" },
      { from: "openai", to: "loganalytics" }
    ]
  }
};

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  
  // Regex to match:
  // 1. Linked image: [![alt](img_src)](url)
  // 2. Plain image: ![alt](img_src)
  // 3. Link: [text](url)
  // 4. Bold: **text**
  // 5. Italic: *text*
  // 6. Inline code: `code`
  const tokenRegex = /(\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)|!\[[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  
  const parts = text.split(tokenRegex);
  return parts.map((part, idx) => {
    if (!part) return null;
    
    // Check linked image: [![alt](img_src)](url)
    const linkedImgMatch = /^\[\!\[([^\]]*)\]\(([^)]*)\)\]\(([^)]*)\)$/.exec(part);
    if (linkedImgMatch) {
      const alt = linkedImgMatch[1];
      const img_src = linkedImgMatch[2];
      const url = linkedImgMatch[3];
      return (
        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="readme-link">
          <img src={img_src} alt={alt} className="readme-badge-inline" />
        </a>
      );
    }
    
    // Check plain image: ![alt](img_src)
    const imgMatch = /^!\[([^\]]*)\]\(([^)]*)\)$/.exec(part);
    if (imgMatch) {
      const alt = imgMatch[1];
      const img_src = imgMatch[2];
      const isTyping = img_src.includes('typing-svg');
      return (
        <img 
          key={idx} 
          src={img_src} 
          alt={alt} 
          className={isTyping ? "readme-typing-svg" : "readme-badge-inline"} 
        />
      );
    }
    
    // Check link: [text](url)
    const linkMatch = /^\[([^\]]*)\]\(([^)]*)\)$/.exec(part);
    if (linkMatch) {
      const textVal = linkMatch[1];
      const url = linkMatch[2];
      return (
        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="readme-link">
          {parseInlineMarkdown(textVal)}
        </a>
      );
    }
    
    // Check bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={idx}>{parseInlineMarkdown(boldText)}</strong>;
    }
    
    // Check italic: *text*
    if (part.startsWith('*') && part.endsWith('*')) {
      const italicText = part.slice(1, -1);
      return <em key={idx}>{parseInlineMarkdown(italicText)}</em>;
    }
    
    // Check inline code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeText = part.slice(1, -1);
      return <code key={idx} className="readme-inline-code">{codeText}</code>;
    }
    
    // Fallback plain text
    return part;
  });
};

const filterReadmeSections = (markdown) => {
  if (!markdown) return '';
  const lines = markdown.split('\n');
  
  const headerLines = [];
  const aboutLines = [];
  const focusLines = [];
  
  let section = 'header';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.trim();
    
    if (cleanLine.startsWith('## ') || cleanLine.startsWith('### ')) {
      const headingText = cleanLine.toLowerCase();
      if (headingText.includes('about')) {
        section = 'about';
      } else if (headingText.includes('focused') || headingText.includes('focus')) {
        section = 'focus';
      } else {
        section = 'ignored';
      }
    }
    
    if (cleanLine === '---') {
      continue;
    }
    
    if (section === 'header') {
      headerLines.push(line);
    } else if (section === 'about') {
      aboutLines.push(line);
    } else if (section === 'focus') {
      focusLines.push(line);
    }
  }
  
  const cleanSectionLines = (secLines) => {
    let start = 0;
    while (start < secLines.length && !secLines[start].trim()) {
      start++;
    }
    let end = secLines.length - 1;
    while (end >= start && !secLines[end].trim()) {
      end--;
    }
    return secLines.slice(start, end + 1);
  };
  
  const cleanHeader = cleanSectionLines(headerLines);
  const cleanAbout = cleanSectionLines(aboutLines);
  const cleanFocus = cleanSectionLines(focusLines);
  
  const result = [];
  result.push(...cleanHeader);
  if (cleanAbout.length > 0) {
    result.push('', '---', '');
    result.push(...cleanAbout);
  }
  if (cleanFocus.length > 0) {
    result.push('', '---', '');
    result.push(...cleanFocus);
  }
  
  return result.join('\n');
};

const renderMarkdown = (markdown) => {
  if (!markdown) return null;
  
  const cleanMarkdown = filterReadmeSections(markdown);
  const lines = cleanMarkdown.split('\n');
  const html = [];
  
  let inYaml = false;
  let yamlLines = [];
  let inCode = false;
  let codeLines = [];
  let codeLang = '';
  
  let currentList = null; // 'ul' or 'ol'
  let listItems = [];
  
  let inBlockquote = false;
  let blockquoteLines = [];
  
  let inTable = false;
  let tableHeader = null;
  let tableRows = [];
  let tableAlignments = [];

  // Helper to flush current open block elements
  const flushBlocks = (keyPrefix) => {
    if (currentList) {
      const ListTag = currentList;
      html.push(
        <ListTag key={`${keyPrefix}-list`} className={`readme-${currentList}`}>
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineMarkdown(item)}</li>
          ))}
        </ListTag>
      );
      currentList = null;
      listItems = [];
    }
    
    if (inBlockquote) {
      html.push(
        <blockquote key={`${keyPrefix}-blockquote`} className="readme-blockquote">
          {blockquoteLines.map((lineText, idx) => (
            <p key={idx}>{parseInlineMarkdown(lineText)}</p>
          ))}
        </blockquote>
      );
      inBlockquote = false;
      blockquoteLines = [];
    }
    
    if (inTable) {
      if (tableHeader) {
        html.push(
          <div key={`${keyPrefix}-table-container`} className="readme-table-container">
            <table className="readme-table">
              <thead>
                <tr>
                  {tableHeader.map((cell, idx) => {
                    const align = tableAlignments[idx] || 'left';
                    return <th key={idx} style={{ textAlign: align }}>{parseInlineMarkdown(cell)}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => {
                      const align = tableAlignments[cIdx] || 'left';
                      return <td key={cIdx} style={{ textAlign: align }}>{parseInlineMarkdown(cell)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      inTable = false;
      tableHeader = null;
      tableRows = [];
      tableAlignments = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/<!--[\s\S]*?-->/g, '').trim();
    
    // Code block check
    if (cleanLine.startsWith('```')) {
      flushBlocks(`code-pre-${i}`);
      if (inCode || inYaml) {
        if (inYaml) {
          html.push(
            <pre key={`yaml-${i}`} className="readme-yaml">
              <code>{yamlLines.join('\n')}</code>
            </pre>
          );
          inYaml = false;
          yamlLines = [];
        } else {
          html.push(
            <pre key={`code-${i}`} className="readme-code">
              <div className="readme-code-header">
                <span className="readme-code-lang">{codeLang || 'text'}</span>
              </div>
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
          inCode = false;
          codeLines = [];
        }
      } else {
        const lang = cleanLine.substring(3).trim();
        if (lang === 'yaml') {
          inYaml = true;
        } else {
          inCode = true;
          codeLang = lang;
        }
      }
      continue;
    }
    
    if (inYaml) {
      yamlLines.push(line);
      continue;
    }
    
    if (inCode) {
      codeLines.push(line);
      continue;
    }
    
    // If line is empty or just contains HTML comment leftovers
    if (!cleanLine) {
      flushBlocks(`empty-${i}`);
      continue;
    }
    
    // Handle HTML breaks
    if (cleanLine === '<br>' || cleanLine === '<br />' || cleanLine === '<br >' || cleanLine === '<br/>') {
      flushBlocks(`br-${i}`);
      html.push(<br key={`br-${i}`} />);
      continue;
    }
    
    // Blockquote check
    if (cleanLine.startsWith('>')) {
      flushBlocks(`bq-pre-${i}`);
      inBlockquote = true;
      const quoteText = cleanLine.substring(1).trim();
      blockquoteLines.push(quoteText);
      continue;
    }
    
    // Table check
    if (cleanLine.startsWith('|')) {
      if (!inTable) {
        flushBlocks(`table-pre-${i}`);
        inTable = true;
      }
      
      const cells = cleanLine
        .split('|')
        .map(c => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        
      if (!tableHeader) {
        tableHeader = cells;
      } else if (cleanLine.includes('---') || cleanLine.includes('-:')) {
        tableAlignments = cells.map(cell => {
          const left = cell.startsWith(':');
          const right = cell.endsWith(':');
          if (left && right) return 'center';
          if (right) return 'right';
          return 'left';
        });
      } else {
        tableRows.push(cells);
      }
      continue;
    }
    
    // List item check: Unordered List
    if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
      if (currentList !== 'ul') {
        flushBlocks(`list-pre-ul-${i}`);
        currentList = 'ul';
      }
      listItems.push(cleanLine.substring(2).trim());
      continue;
    }
    
    // List item check: Ordered List
    const olMatch = /^(\d+)\.\s+(.*)$/.exec(cleanLine);
    if (olMatch) {
      if (currentList !== 'ol') {
        flushBlocks(`list-pre-ol-${i}`);
        currentList = 'ol';
      }
      listItems.push(olMatch[2].trim());
      continue;
    }
    
    // Flush blocks on normal lines
    flushBlocks(`std-pre-${i}`);
    
    // Handle HTML Center Blocks & Images
    if (cleanLine.startsWith('<div align="center">') || cleanLine.startsWith('</div>') || cleanLine.startsWith('<div') || cleanLine.includes('align="center"')) {
      const imgRegex = /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/g;
      const mdImgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
      const images = [];
      
      let innerText = cleanLine;
      while (i + 1 < lines.length && !lines[i + 1].includes('</div>') && !lines[i + 1].startsWith('##') && !lines[i + 1].startsWith('---')) {
        i++;
        innerText += '\n' + lines[i].replace(/<!--[\s\S]*?-->/g, '');
      }
      if (i + 1 < lines.length && lines[i + 1].includes('</div>')) {
        i++;
        innerText += '\n' + lines[i].replace(/<!--[\s\S]*?-->/g, '');
      }
      
      let imgMatch;
      while ((imgMatch = imgRegex.exec(innerText)) !== null) {
        images.push({ src: imgMatch[1], alt: imgMatch[2] || 'badge' });
      }
      
      let mdMatch;
      while ((mdMatch = mdImgRegex.exec(innerText)) !== null) {
        images.push({ src: mdMatch[2], alt: mdMatch[1] });
      }
      
      if (images.length > 0) {
        html.push(
          <div key={`center-${i}`} className="readme-center-block">
            {images.map((img, idx) => {
              const isTyping = img.src.includes('typing-svg');
              return (
                <img 
                  key={idx} 
                  src={img.src} 
                  alt={img.alt} 
                  className={isTyping ? "readme-typing-svg" : "readme-badge"} 
                />
              );
            })}
          </div>
        );
      }
      continue;
    }
    
    // Headers (H1 - H6)
    if (cleanLine.startsWith('# ')) {
      html.push(<h1 key={`h1-${i}`} className="readme-h1">{parseInlineMarkdown(cleanLine.substring(2))}</h1>);
      continue;
    }
    if (cleanLine.startsWith('## ')) {
      html.push(<h2 key={`h2-${i}`} className="readme-h2">{parseInlineMarkdown(cleanLine.substring(3))}</h2>);
      continue;
    }
    if (cleanLine.startsWith('### ')) {
      html.push(<h3 key={`h3-${i}`} className="readme-h3">{parseInlineMarkdown(cleanLine.substring(4))}</h3>);
      continue;
    }
    if (cleanLine.startsWith('#### ')) {
      html.push(<h4 key={`h4-${i}`} className="readme-h4">{parseInlineMarkdown(cleanLine.substring(5))}</h4>);
      continue;
    }
    if (cleanLine.startsWith('##### ')) {
      html.push(<h5 key={`h5-${i}`} className="readme-h5">{parseInlineMarkdown(cleanLine.substring(6))}</h5>);
      continue;
    }
    if (cleanLine.startsWith('###### ')) {
      html.push(<h6 key={`h6-${i}`} className="readme-h6">{parseInlineMarkdown(cleanLine.substring(7))}</h6>);
      continue;
    }
    
    // Dividers
    if (cleanLine === '---') {
      html.push(<hr key={`hr-${i}`} className="readme-hr" />);
      continue;
    }
    
    // Markdown image badges
    if (cleanLine.startsWith('![') || cleanLine.includes('![')) {
      const mdImgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
      const badges = [];
      let match;
      
      while ((match = mdImgRegex.exec(cleanLine)) !== null) {
        badges.push(<img key={match[2]} src={match[2]} alt={match[1]} className="readme-badge-inline" />);
      }
      
      if (badges.length > 0) {
        html.push(<div key={`badges-${i}`} className="readme-badge-container">{badges}</div>);
        continue;
      }
    }
    
    // Standard paragraph
    html.push(<p key={`p-${i}`} className="readme-paragraph">{parseInlineMarkdown(cleanLine)}</p>);
  }
  
  // Flush any remaining blocks
  flushBlocks('final');
  
  return <div className="github-readme-content">{html}</div>;
};

export default function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const [projects, setProjects] = useState([]);
  const [order, setOrder] = useState([]);
  const [displayProject, setDisplayProject] = useState(null);
  const [activeIdxState, setActiveIdxState] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('projects');
  const [githubProfile, setGithubProfile] = useState(FALLBACK_GITHUB_PROFILE);
  const [githubRepos, setGithubRepos] = useState(FALLBACK_GITHUB_REPOS);
  const [githubReadme, setGithubReadme] = useState(FALLBACK_GITHUB_README);
  const [githubLoading, setGithubLoading] = useState(false);
  const [activeArch, setActiveArch] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Admin & PWA state
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  
  // AI background service states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreviewUrl, setAiPreviewUrl] = useState('');
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [changelog, setChangelog] = useState([]);
  const [serverVersion, setServerVersion] = useState('');
  
  // Form values
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pLive, setPLive] = useState('');
  const [pRepo, setPRepo] = useState('');
  const [coverStyle, setCoverStyle] = useState('gradient-deep-blue');
  const [pCustomImage, setPCustomImage] = useState('');
  
  // Dimensions references
  const dimensionsRef = useRef({
    cardWidth: 200,
    cardHeight: 300,
    gap: 40,
    offsetTop: 200,
    offsetLeft: 700,
    numberSize: 50
  });

  const isAnimatingRef = useRef(false);
  const isPausedRef = useRef(false);
  const indicatorTweenRef = useRef(null);

  // Get gradient background style
  const getBackgroundStyle = (project) => {
    if (!project.image) {
      return { background: 'linear-gradient(135deg, #1f4068, #162447)' };
    }
    if (project.image.startsWith('gradient-')) {
      const gradients = {
        'gradient-deep-blue': 'linear-gradient(135deg, #1f4068, #162447)',
        'gradient-sunset': 'linear-gradient(135deg, #833ab4, #fd1d1d)',
        'gradient-green': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'gradient-gold': 'linear-gradient(135deg, #fc4a1a, #f7b733)',
        'gradient-purple': 'linear-gradient(135deg, #ff007f, #7f00ff)',
      };
      return { background: gradients[project.image] || gradients['gradient-deep-blue'] };
    }
    return { backgroundImage: `url(${project.image})` };
  };

  // Recalculate dimensions based on viewport
  const updateLayoutDimensions = () => {
    const { innerHeight: height, innerWidth: width } = window;
    const dims = dimensionsRef.current;

    if (width < 480) {
      dims.cardWidth = 70;
      dims.cardHeight = 105;
      dims.gap = 8;
      dims.offsetTop = height - 195;
      dims.offsetLeft = 24;
      dims.numberSize = 20;
    } else if (width < 768) {
      dims.cardWidth = 95;
      dims.cardHeight = 140;
      dims.gap = 10;
      dims.offsetTop = height - 240;
      dims.offsetLeft = 40;
      dims.numberSize = 25;
    } else if (width < 1024) {
      dims.cardWidth = 130;
      dims.cardHeight = 195;
      dims.gap = 16;
      dims.offsetTop = height - 275;
      dims.offsetLeft = width - 450;
      dims.numberSize = 35;
    } else {
      dims.cardWidth = 200;
      dims.cardHeight = 300;
      dims.gap = 40;
      dims.offsetTop = height - 430;
      dims.offsetLeft = width - 830;
      dims.numberSize = 50;
    }
  };

  // Position cards statically (during initialization or resizing)
  const positionCards = (orderList) => {
    if (orderList.length === 0 || window.innerWidth < 992) return;
    const dims = dimensionsRef.current;
    const [active, ...rest] = orderList;

    // Reset pagination position
    gsap.set("#pagination", {
      top: dims.offsetTop + dims.cardHeight + 25,
      left: dims.offsetLeft,
      opacity: 1
    });

    // Main card
    gsap.set(`#card${active}`, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      zIndex: 10
    });
    gsap.set(`#card-content-${active}`, { x: 0, y: 0, opacity: 0 });

    // Rest of queue
    rest.forEach((i, index) => {
      gsap.set(`#card${i}`, {
        x: dims.offsetLeft + index * (dims.cardWidth + dims.gap),
        y: dims.offsetTop,
        width: dims.cardWidth,
        height: dims.cardHeight,
        zIndex: 30,
        borderRadius: 12
      });
      gsap.set(`#card-content-${i}`, {
        x: 0,
        y: 0,
        opacity: 1,
        zIndex: 40
      });
      gsap.set(`#slide-item-${i}`, { x: (index + 1) * dims.numberSize });
    });
  };

  // Transition slider forward/backward
  const runTransition = (newOrder, direction) => {
    if (window.innerWidth < 992) {
      setDisplayProject(projects[newOrder[0]]);
      setActiveIdxState(newOrder[0]);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const dims = dimensionsRef.current;
      const [active, ...rest] = newOrder;
      const prv = direction === "next" ? rest[rest.length - 1] : rest[0];

      setActiveIdxState(active);

      // Fade out current text elements
      gsap.to([".details .text", ".details .title-1", ".details .title-2", ".details .desc", ".details .cta"], {
        opacity: 0,
        y: (index, target) => {
          if (target.classList.contains("desc") || target.classList.contains("cta")) return 30;
          return 50;
        },
        duration: 0.25,
        stagger: 0.02,
        onComplete: () => {
          // Set state to update contents in DOM
          setDisplayProject(projects[active]);
          
          // Reset y positions and opacity for fade-in
          gsap.set(".details .text", { y: 30, opacity: 0 });
          gsap.set(".details .title-1", { y: 50, opacity: 0 });
          gsap.set(".details .title-2", { y: 50, opacity: 0 });
          gsap.set(".details .desc", { y: 25, opacity: 0 });
          gsap.set(".details .cta", { y: 25, opacity: 0 });
          
          // Fade in the new contents
          gsap.to(".details .text", { y: 0, opacity: 1, duration: 0.4 });
          gsap.to(".details .title-1", { y: 0, opacity: 1, duration: 0.4, delay: 0.05 });
          gsap.to(".details .title-2", { y: 0, opacity: 1, duration: 0.4, delay: 0.05 });
          gsap.to(".details .desc", { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
          gsap.to(".details .cta", { y: 0, opacity: 1, duration: 0.3, delay: 0.15 });
        }
      });

      // Animate card scale
      gsap.set(`#card${prv}`, { zIndex: 10 });
      gsap.set(`#card${active}`, { zIndex: 20 });
      gsap.to(`#card${prv}`, { scale: 1.2, duration: 0.6 });

      gsap.to(`#card-content-${active}`, {
        y: 30,
        opacity: 0,
        duration: 0.3
      });
      
      gsap.to(`#slide-item-${active}`, { x: 0, duration: 0.5 });
      gsap.to(`#slide-item-${prv}`, { x: -dims.numberSize, duration: 0.5 });
      
      gsap.to(".progress-sub-foreground", {
        width: `${(100 * (active + 1)) / newOrder.length}%`,
        duration: 0.5
      });

      // Scale active card full-screen
      gsap.to(`#card${active}`, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: 0.8,
        onComplete: () => {
          const prvRestIndex = rest.indexOf(prv);
          const xNew = dims.offsetLeft + prvRestIndex * (dims.cardWidth + dims.gap);
          
          gsap.set(`#card${prv}`, {
            x: xNew,
            y: dims.offsetTop,
            width: dims.cardWidth,
            height: dims.cardHeight,
            zIndex: 30,
            borderRadius: 12,
            scale: 1,
          });

          gsap.set(`#card-content-${prv}`, {
            x: 0,
            y: 0,
            opacity: 1,
            zIndex: 40
          });
          
          gsap.set(`#slide-item-${prv}`, { x: (prvRestIndex + 1) * dims.numberSize });
          resolve();
        }
      });

      // Shift other cards in the queue
      rest.forEach((i) => {
        if (i !== prv) {
          const itemRestIndex = rest.indexOf(i);
          const xNew = dims.offsetLeft + itemRestIndex * (dims.cardWidth + dims.gap);
          
          gsap.set(`#card${i}`, { zIndex: 30 });
          
          gsap.to(`#card${i}`, {
            x: xNew,
            y: dims.offsetTop,
            width: dims.cardWidth,
            height: dims.cardHeight,
            duration: 0.6,
            delay: 0.03 * (itemRestIndex + 1)
          });

          gsap.to(`#card-content-${i}`, {
            x: 0,
            y: 0,
            opacity: 1,
            zIndex: 40,
            duration: 0.6,
            delay: 0.03 * (itemRestIndex + 1)
          });
          
          gsap.to(`#slide-item-${i}`, { x: (itemRestIndex + 1) * dims.numberSize, duration: 0.6 });
        }
      });
    });
  };

  const stopTimer = () => {
    if (indicatorTweenRef.current) {
      indicatorTweenRef.current.kill();
      indicatorTweenRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (isPausedRef.current || order.length <= 1 || window.innerWidth < 992 || activeTab !== 'projects') return;

    gsap.set(".indicator", { x: -window.innerWidth });

    indicatorTweenRef.current = gsap.to(".indicator", {
      x: 0,
      duration: 5.0, // 5 seconds rotation timer!
      ease: "none",
      onComplete: () => {
        gsap.to(".indicator", {
          x: window.innerWidth,
          duration: 0.4,
          ease: "power1.in",
          onComplete: () => {
            handleNext();
          }
        });
      }
    });
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab || isAnimatingRef.current) return;
    
    // Stop rotation when leaving projects
    if (tab !== 'projects') {
      stopTimer();
      gsap.set(".indicator", { x: -window.innerWidth });
    }
    
    isAnimatingRef.current = true;
    
    // Target active tab elements
    const outElements = activeTab === 'projects' 
      ? ["#demo", ".details", ".showcase-container", ".pagination", ".fab"]
      : activeTab === 'certifications'
        ? [".certifications-showcase"]
        : [".github-showcase"];
      
    const inElements = tab === 'projects'
      ? ["#demo", ".details", ".showcase-container", ".pagination", ".fab"]
      : tab === 'certifications'
        ? [".certifications-showcase"]
        : [".github-showcase"];

    gsap.to(outElements, {
      opacity: 0,
      duration: 0.25,
      stagger: 0.02,
      onComplete: () => {
        // Toggle tab state
        setActiveTab(tab);
        isPausedRef.current = tab !== 'projects';

        // Clear indicator
        gsap.set(".indicator", { x: -window.innerWidth });

        // Set hidden state for target elements
        gsap.set(inElements, { opacity: 0 });

        // Wait a tiny bit and fade in
        gsap.to(inElements, {
          opacity: 1,
          duration: 0.35,
          stagger: 0.02,
          onComplete: () => {
            isAnimatingRef.current = false;
            if (tab === 'projects') {
              // Recalculate dimensions & reposition
              updateLayoutDimensions();
              positionCards(order);
              startTimer();
            }
          }
        });
      }
    });
  };

  const handleGithubClick = (e) => {
    e.preventDefault();
    handleTabChange('github');
  };

  const renderNodeIcon = (type) => {
    switch (type) {
      case 'IaaS': // Browser/Client
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'Network': // API Gateway / APIM / Cost API
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'Compute': // Functions / App Service
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case 'Security': // Key Vault / Identity / Action Group
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'Database': // Cosmos DB / Table Storage / Log Analytics
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
          </svg>
        );
      case 'AI': // OpenAI / Gemini
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-7.88A2.5 2.5 0 0 1 9.5 2z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-7.88A2.5 2.5 0 0 0 14.5 2z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  const handleNext = async () => {
    if (isAnimatingRef.current || order.length <= 1) return;
    isAnimatingRef.current = true;
    
    const newOrder = [...order];
    newOrder.push(newOrder.shift());
    
    await runTransition(newOrder, "next");
    setOrder(newOrder);
    isAnimatingRef.current = false;
  };

  const handlePrev = async () => {
    if (isAnimatingRef.current || order.length <= 1) return;
    isAnimatingRef.current = true;
    
    const newOrder = [...order];
    newOrder.unshift(newOrder.pop());
    
    await runTransition(newOrder, "prev");
    setOrder(newOrder);
    isAnimatingRef.current = false;
  };

  // Load manual list from localStorage
  const loadManual = () => {
    const stored = localStorage.getItem('cruz_portal_manual_projects');
    return stored ? JSON.parse(stored) : [];
  };

  // Fetch manually added projects from Azure Table Storage
  const fetchCloudProjects = async () => {
    if (!AZURE_TABLE_URL || !READ_SAS) {
      console.warn("Azure Table URL or Read SAS token is missing.");
      setDbError("Azure Table URL or Read SAS token environment variable is missing.");
      return null;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout limit
      
      const res = await fetch(`${AZURE_TABLE_URL}()${READ_SAS}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json;odata=nometadata'
        }
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDbError(null); // Clear error on successful fetch
      return (data.value || []).map(item => ({
        id: item.RowKey,
        place: item.place,
        title: item.title,
        title2: item.title2,
        description: item.description,
        image: item.image,
        liveUrl: item.liveUrl || null,
        repoUrl: item.repoUrl || null,
        isManual: item.isManual
      }));
    } catch (err) {
      console.warn("Could not load projects from Azure Table database, using local cache:", err);
      setDbError(err.message || "Failed to connect to Azure Table database.");
      return null;
    }
  };

  // Helper to get Write SAS token
  const getWriteSas = () => {
    let localSas = localStorage.getItem('cruz_portal_write_sas');
    if (!localSas) {
      localSas = import.meta.env.VITE_WRITE_SAS;
    }
    if (!localSas) {
      localSas = prompt("Please enter the Admin Write SAS Token to authorize this action:");
      if (localSas) {
        if (localSas.includes('?')) {
          localSas = localSas.substring(localSas.indexOf('?'));
        }
        localStorage.setItem('cruz_portal_write_sas', localSas);
        setIsAdmin(true);
      }
    } else {
      setIsAdmin(true);
    }
    return localSas;
  };

  // PWA Check Updates
  const checkPwaUpdates = async () => {
    // Register SW
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (err) {
        console.warn('SW register fail', err);
      }
    }

    // Check version
    try {
      const res = await fetch(`./version.json?t=${Date.now()}`);
      if (!res.ok) return;
      const config = await res.json();
      
      const serverV = config.version;
      const serverChangelogs = config.changelog || [];
      const localV = localStorage.getItem('cruz_portal_app_version');

      setServerVersion(serverV);
      setChangelog(serverChangelogs);

      if (!localV) {
        localStorage.setItem('cruz_portal_app_version', serverV);
      } else if (localV !== serverV) {
        setShowUpdate(true);
        isPausedRef.current = true;
        
        // Trigger browser notification for update
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification("CruzOne Portal Update", {
            body: `Version v${serverV} is available! Click to update and refresh.`,
            icon: './icon.png',
            tag: 'pwa-update',
            requireInteraction: true
          });
          notification.onclick = () => {
            window.focus();
            handleUpdateRefresh();
            notification.close();
          };
        }
      }
    } catch (err) {
      console.warn('Update check failed', err);
    }
  };

  const handleUpdateRefresh = async () => {
    // Clear all app-specific local storage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cruz_') || key.startsWith('cruz_portal_')) {
        localStorage.removeItem(key);
      }
    });

    localStorage.setItem('cruz_portal_app_version', serverVersion);
    
    // Clear cache
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch(e) {}

    // Unregister SW
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch(e) {}

    // Perform cache-busting hard reload to force clean asset download
    const cleanUrl = window.location.origin + window.location.pathname;
    window.location.href = `${cleanUrl}?update=${Date.now()}`;
  };

  // Initial Loading
  useEffect(() => {
    const initialize = async () => {
      // Dynamic manifest swap for admin PWA
      const link = document.querySelector('link[rel="manifest"]');
      if (link) {
        if (window.location.pathname === '/cruz-admin') {
          link.setAttribute('href', './manifest-admin.json');
          document.title = "CruzOne Admin Portal";
        } else {
          link.setAttribute('href', './manifest.json');
          document.title = "CruzOne Portal";
        }
      }

      // Hide cover splash screen
      updateLayoutDimensions();

      // Load local cache immediately so the user sees the page instantly
      const localManual = loadManual();
      const deletedBaselines = JSON.parse(localStorage.getItem('cruz_portal_deleted_baselines') || '[]');
      const filteredBaselines = BASELINE_PROJECTS.filter(b => {
        if (deletedBaselines.includes(b.id)) return false;
        const isOverridden = localManual.some(m => m.id === b.id);
        return !isOverridden;
      });

      const merged = [...localManual, ...filteredBaselines];
      setProjects(merged);
      setOrder(Array.from({ length: merged.length }, (_, i) => i));
      setActiveIdxState(0);
      if (merged.length > 0) {
        setDisplayProject(merged[0]);
      }

      // Theme
      const savedTheme = localStorage.getItem('cruz_portal_theme') || 'dark';
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
      }

      // Check PWA update in the background
      checkPwaUpdates();
      
      // Fade out cover screen immediately
      gsap.to(".cover", {
        x: window.innerWidth + 400,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(".cover", { display: "none" });
        }
      });

      // Fetch cloud database updates in the background without locking loader
      fetchCloudProjects().then(cloudManual => {
        if (cloudManual !== null) {
          localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(cloudManual));
          
          const filteredBaselinesUpdated = BASELINE_PROJECTS.filter(b => {
            if (deletedBaselines.includes(b.id)) return false;
            const isOverridden = cloudManual.some(m => m.id === b.id);
            return !isOverridden;
          });
          
          const updatedMerged = [...cloudManual, ...filteredBaselinesUpdated];
          setProjects(updatedMerged);
          setOrder(Array.from({ length: updatedMerged.length }, (_, i) => i));
          
          setDisplayProject(prev => {
            const stillExists = updatedMerged.find(p => p.id === prev?.id);
            return stillExists || updatedMerged[0];
          });
        }
      });
    };
    
    initialize();

    // Resize handler
    const handleResize = () => {
      updateLayoutDimensions();
      if (order.length > 0) {
        positionCards(order);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stopTimer();
    };
  }, []);

  // Admin Check, Notifications & PWA Install
  useEffect(() => {
    // Admin mode authentication check via Clerk only
    if (isLoaded) {
      if (isSignedIn && user) {
        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "anto13franc@outlook.com").toLowerCase();
        const hasAdminEmail = user.emailAddresses.some(
          e => e.emailAddress.toLowerCase() === adminEmail
        );
        
        if (hasAdminEmail) {
          setIsAdmin(true);
          return;
        }
      }
      setIsAdmin(false);
    }
  }, [isLoaded, isSignedIn, user]);
  
  // Auth loading timeout monitor
  useEffect(() => {
    if (!isLoaded) {
      const timer = setTimeout(() => {
        setAuthTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setAuthTimeout(false);
    }
  }, [isLoaded]);

  useEffect(() => {
    // 2. Request Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
    }

    // 3. PWA Installation Event Listeners
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowInstallBanner(true);

      // Trigger local browser notification that app is ready to install
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification("CruzOne Portal", {
          body: "Install CruzOne Portal for an immersive offline experience!",
          icon: './icon.png',
          tag: 'pwa-installable'
        });
        notification.onclick = () => {
          window.focus();
          e.prompt();
          notification.close();
        };
      }
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setShowInstallBanner(false);
      
      // Trigger confirmation notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("CruzOne Portal Installed!", {
          body: "CruzOne Portal has been successfully installed as an app.",
          icon: './icon.png',
          tag: 'pwa-installed'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Position cards whenever projects/order loads or admin state changes (rendering main page)
  useEffect(() => {
    if (order.length > 0) {
      updateLayoutDimensions();
      positionCards(order);
      setDisplayProject(projects[order[0]]);
      startTimer();
    }
  }, [order, isAdmin]);

  // Fetch GitHub profile & repositories dynamically when github tab is active
  useEffect(() => {
    if (activeTab === 'github') {
      const fetchGithubData = async () => {
        setGithubLoading(true);
        try {
          const profileRes = await fetch('https://api.github.com/users/ajf013');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setGithubProfile(profileData);
          }
          
          const reposRes = await fetch('https://api.github.com/users/ajf013/repos?sort=updated&per_page=10');
          if (reposRes.ok) {
            const reposData = await reposRes.json();
            const sortedRepos = (reposData || [])
              .filter(r => !r.fork)
              .slice(0, 4);
            if (sortedRepos.length > 0) {
              setGithubRepos(sortedRepos);
            }
          }

          // Fetch the raw README.md from the profile repository
          const readmeRes = await fetch('https://raw.githubusercontent.com/ajf013/ajf013/master/README.md');
          if (readmeRes.ok) {
            const readmeData = await readmeRes.text();
            setGithubReadme(readmeData);
          }
        } catch (error) {
          console.warn('Failed to refresh GitHub data:', error);
        } finally {
          setGithubLoading(false);
        }
      };

      fetchGithubData();
    }
  }, [activeTab]);

  // Pause cycles on mouse interactions
  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (indicatorTweenRef.current && !isAnimatingRef.current) {
      indicatorTweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    if (indicatorTweenRef.current && !isAnimatingRef.current) {
      indicatorTweenRef.current.resume();
    } else if (!isAnimatingRef.current) {
      startTimer();
    }
  };

  // AI URL and Background Screenshot Generation
  const handleAiBackgroundGeneration = async () => {
    // 1. If live URL is already provided, skip AI deduction and directly set screenshot background
    if (pLive.trim()) {
      const screenshot = getScreenshotUrl(pLive.trim());
      setPCustomImage(screenshot);
      setCoverStyle('custom');
      setAiPreviewUrl(screenshot);
      return;
    }

    // 2. Validate that we have enough information to run the AI search
    if (!pTitle.trim()) {
      alert("Please enter a Project Title so the AI knows what to search for.");
      return;
    }

    setAiLoading(true);
    try {
      const deducedUrl = await deduceLiveUrl(
        pTitle,
        pCategory,
        pDesc,
        pRepo
      );

      if (deducedUrl) {
        setPLive(deducedUrl);
        const screenshot = getScreenshotUrl(deducedUrl);
        setPCustomImage(screenshot);
        setCoverStyle('custom');
        setAiPreviewUrl(screenshot);
        alert(`AI successfully found the live URL: ${deducedUrl} and captured a background screenshot!`);
      } else {
        alert("Azure OpenAI could not deduce a live URL for this project. Please enter a Live URL manually and click this button again to generate the screenshot background.");
      }
    } catch (err) {
      console.error(err);
      alert("AI Service Error: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Add or Edit project submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!pTitle.trim() || !pCategory.trim() || !pDesc.trim()) return;

    const writeSas = getWriteSas();
    if (!writeSas) return;

    let imgVal = coverStyle;
    if (coverStyle === 'custom') {
      imgVal = pCustomImage.trim() || 'gradient-deep-blue';
    }

    const words = pTitle.toUpperCase().split(" ");
    const title1 = words.slice(0, 2).join(" ") || "PROJECT";
    const title2 = words.slice(2).join(" ") || "DETAILS";

    const isEdit = !!editingProject;
    const projectId = isEdit ? editingProject.id : `manual-${Date.now()}`;
    
    const newEntity = {
      PartitionKey: 'project',
      RowKey: projectId,
      place: pCategory,
      title: title1,
      title2: title2,
      description: pDesc,
      image: imgVal,
      liveUrl: pLive.trim() || null,
      repoUrl: pRepo.trim() || null,
      isManual: true
    };

    try {
      const url = isEdit 
        ? `${AZURE_TABLE_URL}(PartitionKey='project',RowKey='${projectId}')${writeSas}`
        : `${AZURE_TABLE_URL}${writeSas}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json;odata=nometadata'
      };

      if (isEdit) {
        headers['X-HTTP-Method'] = 'PUT'; // Tunnel PUT through POST to bypass CORS PUT limitations
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newEntity)
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401 || res.status === 400) {
          localStorage.removeItem('cruz_portal_write_sas');
          setIsAdmin(false);
          alert("Access Denied! The Admin SAS Token is invalid, expired, or has insufficient permissions.");
          return;
        }
        throw new Error(`Azure Table Storage responded with status ${res.status}`);
      }

      // Add to local projects state & update localStorage cache
      const savedProject = {
        id: projectId,
        place: pCategory,
        title: title1,
        title2: title2,
        description: pDesc,
        image: imgVal,
        liveUrl: pLive.trim() || null,
        repoUrl: pRepo.trim() || null,
        isManual: true
      };

      let manual = loadManual();
      if (isEdit) {
        // Update or insert manual cache
        const exists = manual.some(p => p.id === projectId);
        if (exists) {
          manual = manual.map(p => p.id === projectId ? savedProject : p);
        } else {
          manual.unshift(savedProject);
        }
        localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(manual));

        // If it was baseline, check if it was in deleted baselines list
        const deletedBaselines = JSON.parse(localStorage.getItem('cruz_portal_deleted_baselines') || '[]');
        if (deletedBaselines.includes(projectId)) {
          const updatedDeleted = deletedBaselines.filter(id => id !== projectId);
          localStorage.setItem('cruz_portal_deleted_baselines', JSON.stringify(updatedDeleted));
        }

        // Update projects state
        const updatedProjects = projects.map(p => p.id === projectId ? savedProject : p);
        setProjects(updatedProjects);
        
        if (displayProject && displayProject.id === projectId) {
          setDisplayProject(savedProject);
        }

        alert("Project successfully updated!");
      } else {
        manual.unshift(savedProject);
        localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(manual));

        const newProjects = [savedProject, ...projects];
        setProjects(newProjects);
        
        // Reset carousel showing the newly added index 0
        setOrder(Array.from({ length: newProjects.length }, (_, i) => i));
        setActiveIdxState(0);
        setDisplayProject(savedProject);
        alert("Project successfully added!");
      }

      // Close modal & reset form
      setShowModal(false);
      setEditingProject(null);
      setPTitle('');
      setPCategory('');
      setPDesc('');
      setPLive('');
      setPRepo('');
      setCoverStyle('gradient-deep-blue');
      setPCustomImage('');
      setAiPreviewUrl('');
      isPausedRef.current = false;
    } catch (err) {
      console.error(err);
      alert("Failed to save project: " + err.message);
    }
  };

  // Edit project click handler
  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setPTitle(project.title + (project.title2 ? " " + project.title2 : ""));
    setPCategory(project.place);
    setPDesc(project.description);
    setPLive(project.liveUrl || '');
    setPRepo(project.repoUrl || '');
    
    const gradients = ['gradient-deep-blue', 'gradient-sunset', 'gradient-green', 'gradient-gold', 'gradient-purple'];
    if (gradients.includes(project.image)) {
      setCoverStyle(project.image);
      setPCustomImage('');
    } else {
      setCoverStyle('custom');
      setPCustomImage(project.image || '');
    }
    
    setAiPreviewUrl(project.image && !project.image.startsWith('gradient-') && !project.image.startsWith('./') ? project.image : '');
    isPausedRef.current = true;
    setShowModal(true);
  };

  // Delete manual or baseline project
  const handleDeleteProject = async (projId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const writeSas = getWriteSas();
      if (!writeSas) return;

      try {
        const deleteUrl = `${AZURE_TABLE_URL}(PartitionKey='project',RowKey='${projId}')${writeSas}`;
        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'If-Match': '*',
            'Accept': 'application/json;odata=nometadata'
          }
        });

        // 404 is allowed (e.g. deleting a baseline project that doesn't exist on the cloud yet)
        if (!res.ok && res.status !== 404) {
          if (res.status === 403 || res.status === 401 || res.status === 400) {
            localStorage.removeItem('cruz_portal_write_sas');
            setIsAdmin(false);
            alert("Access Denied! The Admin SAS Token is invalid or expired.");
            return;
          }
          throw new Error(`Azure Table Storage responded with status ${res.status}`);
        }

        // Delete from local projects state & update localStorage cache
        let manual = loadManual();
        manual = manual.filter(p => p.id !== projId);
        localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(manual));

        // Track deleted baselines in localStorage
        if (projId.startsWith('baseline-') || !manual.some(p => p.id === projId)) {
          const deletedBaselines = JSON.parse(localStorage.getItem('cruz_portal_deleted_baselines') || '[]');
          if (!deletedBaselines.includes(projId)) {
            deletedBaselines.push(projId);
            localStorage.setItem('cruz_portal_deleted_baselines', JSON.stringify(deletedBaselines));
          }
        }

        const newProjects = projects.filter(p => p.id !== projId);
        setProjects(newProjects);
        setOrder(Array.from({ length: newProjects.length }, (_, i) => i));
        
        // Reset active idx & update display project
        setActiveIdxState(0);
        if (newProjects.length > 0) {
          setDisplayProject(newProjects[0]);
        } else {
          setDisplayProject(null);
        }

        alert("Project successfully deleted!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete project: " + err.message);
      }
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.body.classList.add('light-theme');
      localStorage.setItem('cruz_portal_theme', 'light');
    } else {
      setTheme('dark');
      document.body.classList.remove('light-theme');
      localStorage.setItem('cruz_portal_theme', 'dark');
    }
  };

  // Export JSON configs
  const handleExportJSON = () => {
    const manual = loadManual();
    if (manual.length === 0) {
      alert("No manually added projects to export!");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manual, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "projects.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Map active indexes
  const activeIdx = order[0] ?? 0;
  const activeProject = projects[activeIdx] || { place: '', title: '', title2: '', description: '' };

  // Path checking for admin custom URL login page
  const isCustomAdminPath = window.location.pathname === '/cruz-admin';
  if (isCustomAdminPath && !isAdmin) {
    return (
      <div className="clerk-auth-container">
        <div className="clerk-auth-card">
          <div className="clerk-auth-header">
            <h2>CruzOne Portal</h2>
            <p>Admin Authentication via GitHub</p>
          </div>
          {isLoaded ? (
            isSignedIn ? (
              <div className="clerk-auth-denied">
                <svg className="denied-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <h3>Access Denied</h3>
                <p>Your account ({user.primaryEmailAddress?.emailAddress}) is not authorized to access Admin Mode.</p>
                <button className="submit-btn denied-btn" onClick={() => signOut().then(() => window.location.reload())}>Sign Out / Change Account</button>
              </div>
            ) : (
              <SignIn redirectUrl="/cruz-admin" routing="hash" />
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 20px', textAlign: 'center' }}>
              <span className="spinner"></span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading authentication...</span>
              {authTimeout && (
                <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#f87171', fontSize: '12px', lineHeight: '1.4' }}>
                  <strong>Clerk taking too long to load?</strong>
                  <p style={{ margin: '4px 0 0 0' }}>This usually means the Clerk Publishable Key is not configured correctly on the server. Please verify your <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set in Netlify's Environment Variables and that you've triggered a new deploy.</p>
                </div>
              )}
            </div>
          )}
          <a href="/" className="back-to-home-link">← Back to Public Site</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="indicator"></div>

      <nav>
        <div className="brand">
          <img src="./icon.png" alt="CruzOne Logo" className="brand-logo" />
          <h1 className="brand-text">CruzOne Portal</h1>
        </div>
        <div className="nav-links">
          <button 
            className={activeTab === 'projects' ? 'active' : 'nav-item'} 
            onClick={() => handleTabChange('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'certifications' ? 'active' : 'nav-item'} 
            onClick={() => handleTabChange('certifications')}
          >
            Certifications
          </button>
          <button 
            className={activeTab === 'github' ? 'active' : 'nav-item'} 
            onClick={() => handleTabChange('github')}
          >
            GitHub Profile
          </button>
          <button id="export-json-btn" onClick={handleExportJSON} className="nav-item-btn" title="Export Added Projects to JSON">Export Config</button>
          {isAdmin && (
            <button 
              id="admin-logout-btn" 
              onClick={async () => {
                localStorage.removeItem('cruz_portal_write_sas');
                setIsAdmin(false);
                await signOut();
                alert("Logged out of Admin Mode.");
                window.location.href = '/';
              }} 
              className="nav-item-btn admin-logout" 
              title="Exit Admin Mode"
            >
              Exit Admin
            </button>
          )}
          <button id="theme-toggle-btn" onClick={toggleTheme} className="theme-toggle" title="Toggle Light/Dark Theme">
            {theme === 'dark' ? (
              <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ) : (
              <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {activeTab === 'projects' && (
          <>
            {/* Card Carousel Holder */}
        <div 
          id="demo" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {projects.map((project, idx) => {
          const isActiveBg = activeIdxState === idx;
          return (
            <div
              key={project.id}
              className={`card ${isActiveBg ? 'active-bg' : ''}`}
              id={`card${idx}`}
              style={getBackgroundStyle(project)}
            >
              <div className="card-content" id={`card-content-${idx}`}>
                <div className="content-start"></div>
                <div className="content-place">{project.place}</div>
                <div className="content-title-1">{project.title}</div>
                <div className="content-title-2">{project.title2}</div>
                
                {/* Mobile view details stacked inside the card */}
                <div className="card-mobile-details">
                  {project.image && (
                    <div className="card-mobile-screenshot-wrapper">
                      {project.image.startsWith('gradient-') ? (
                        <div className="card-mobile-screenshot gradient-bg" style={getBackgroundStyle(project)} />
                      ) : (
                        <img 
                          src={project.image} 
                          alt={`${project.title} ${project.title2}`} 
                          className="card-mobile-screenshot" 
                        />
                      )}
                    </div>
                  )}
                  <p className="card-mobile-desc">{project.description}</p>
                  <div className="card-mobile-cta">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mobile-cta-btn live">Launch App</a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="mobile-cta-btn repo">View Code</a>
                    )}
                    {project.hasArchitecture && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setActiveArch(project.id);
                          setSelectedNode(ARCHITECTURES[project.id]?.nodes[0] || null);
                          isPausedRef.current = true;
                        }} 
                        className="mobile-cta-btn arch"
                      >
                        Architecture
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button 
                          className="mobile-edit-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProjectClick(project);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="mobile-delete-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id, `${project.title} ${project.title2}`);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Details Left Panel */}
      <div 
        className="details" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {isAdmin && dbError && (
          <div className="db-error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <strong>Sync Error:</strong> {dbError}
            </div>
          </div>
        )}
        <div className="place-box">
          <div className="text">{displayProject?.place || activeProject.place}</div>
        </div>
        <div className="title-box-1"><div className="title-1">{displayProject?.title || activeProject.title}</div></div>
        <div className="title-box-2"><div className="title-2">{displayProject?.title2 || activeProject.title2}</div></div>
        
        {/* Mobile mockup screenshot (visible on mobile only) */}
        <div className="mobile-mockup-card">
          <div className="mobile-mockup-browser">
            <div className="browser-dots">
              <span className="dot dot-close"></span>
              <span className="dot dot-minimize"></span>
              <span className="dot dot-expand"></span>
            </div>
            {displayProject?.image?.startsWith('gradient-') || activeProject?.image?.startsWith('gradient-') ? (
              <div className="browser-screenshot gradient-bg" style={getBackgroundStyle(displayProject || activeProject)} />
            ) : (
              <img 
                src={displayProject?.image || activeProject.image} 
                alt={displayProject?.title || activeProject.title} 
                className="browser-screenshot" 
              />
            )}
          </div>
        </div>

        <div className="desc">{displayProject?.description || activeProject.description}</div>
        <div className="cta">
          {(displayProject?.liveUrl || activeProject.liveUrl) && (
            <a href={displayProject?.liveUrl || activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="discover live-btn">Launch App</a>
          )}
          {(displayProject?.repoUrl || activeProject.repoUrl) && (
            <a href={displayProject?.repoUrl || activeProject.repoUrl} target="_blank" rel="noopener noreferrer" className="discover repo-btn">View Code</a>
          )}
          {(displayProject?.hasArchitecture || activeProject.hasArchitecture) && (
            <button 
              onClick={() => {
                const projId = displayProject?.id || activeProject.id;
                setActiveArch(projId);
                setSelectedNode(ARCHITECTURES[projId]?.nodes[0] || null);
                isPausedRef.current = true;
              }} 
              className="discover arch-btn"
            >
              Architecture
            </button>
          )}
          {isAdmin && (
            <>
              <button 
                className="edit-btn" 
                onClick={() => handleEditProjectClick(displayProject || activeProject)} 
                title="Edit Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteProject(
                  displayProject?.id || activeProject.id, 
                  `${displayProject?.title || activeProject.title} ${displayProject?.title2 || activeProject.title2}`
                )} 
                title="Delete Project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Sidebar social & copyrights */}
        <div className="sidebar-footer">
          <div className="social-dock">
            <a href="https://github.com/ajf013" onClick={handleGithubClick} className="social-icon-btn github" title="GitHub" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/ajf013-francis-cruz/" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.instagram.com/fcruz_013/" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://api.whatsapp.com/send?phone=916379649461" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a href="https://x.com/Itsme_Ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" title="X (Twitter)" aria-label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
          </div>
          <div className="copyright">
            Copyrights © {new Date().getFullYear()} Francis Cruz | MCT
          </div>
        </div>
      </div>

      {/* Desktop mockup browser frame */}
      <div className="showcase-container">
        <div className="browser-mockup">
          <div className="browser-header">
            <div className="browser-dots">
              <span className="dot dot-close"></span>
              <span className="dot dot-minimize"></span>
              <span className="dot dot-expand"></span>
            </div>
            <div className="browser-address-bar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '11px', height: '11px', opacity: 0.5, marginRight: '6px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="address-text">
                {displayProject?.liveUrl ? displayProject.liveUrl.replace('https://', '') : 'fcruz.org'}
              </span>
            </div>
          </div>
          <div className="browser-viewport">
            {displayProject?.image?.startsWith('gradient-') || activeProject?.image?.startsWith('gradient-') ? (
              <div className="browser-screenshot gradient-bg" style={getBackgroundStyle(displayProject || activeProject)} />
            ) : (
              <img 
                src={displayProject?.image || activeProject.image} 
                alt={displayProject?.title || activeProject.title} 
                className="browser-screenshot" 
              />
            )}
          </div>
        </div>
      </div>
          </>
        )}

        {activeTab === 'certifications' && (
          <div className="certifications-showcase">
            <header className="certs-header">
              <div className="mct-badge-container">
                <div className="mct-badge-glow"></div>
                <div className="mct-badge-inner">
                  <div className="mct-badge-header">
                    <img src="./icon.png" alt="Microsoft Logo" className="mct-logo-icon" />
                    <span>Microsoft Certified Trainer</span>
                  </div>
                  <div className="mct-badge-title">Francis Ponnu Cruz I</div>
                  <div className="mct-badge-subtitle">Credential ID & MCT Active Status Verified</div>
                  <div className="mct-badge-meta">
                    <span className="mct-status-pill">Active Status: 2023 - 2026</span>
                    <a href="https://www.credly.com/users/fcruz" target="_blank" rel="noopener noreferrer" className="mct-verify-btn">Verify MCT Profile</a>
                  </div>
                </div>
              </div>
            </header>

            <div className="certs-grid">
              {CERTIFICATIONS.filter(c => c.id !== 'mct').map((cert) => (
                <div key={cert.id} className="cert-card-wrapper">
                  <div className={`cert-card ${cert.badge}`}>
                    <div className="cert-card-glow"></div>
                    <div className="cert-card-inner">
                      <div className="cert-badge-type">{cert.type}</div>
                      <h3 className="cert-title">{cert.title}</h3>
                      <div className="cert-issuer">Issued by {cert.issuer}</div>
                      <div className="cert-date">Issued: {cert.date}</div>
                      <p className="cert-desc">{cert.desc}</p>
                      <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="cert-verify-link">
                        Verify Credential
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="arrow-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div className="github-showcase">
            <div className="github-profile-card">
              <div className="github-profile-cover">
                <div className="github-cover-glow"></div>
              </div>
              <div className="github-profile-content">
                <img 
                  src={githubProfile?.avatar_url || "https://avatars.githubusercontent.com/u/74620353?v=4"} 
                  alt={githubProfile?.name || "Francis Ponnu Cruz I"} 
                  className="github-avatar" 
                />
                <div className="github-profile-info">
                  <div className="github-profile-header-main">
                    <div>
                      <h2 className="github-name">{githubProfile?.name || "Francis Ponnu Cruz I"}</h2>
                      <div className="github-username-row">
                        <div className="github-username">@{githubProfile?.login || "ajf013"}</div>
                        {githubProfile?.hireable !== false && (
                          <span className="github-hireable-badge">
                            <span className="pulse-dot"></span> Open to opportunities
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="github-actions">
                      <a href="https://github.com/ajf013" target="_blank" rel="noopener noreferrer" className="github-btn follow">
                        <span>Follow</span>
                      </a>
                      <a href="https://github.com/ajf013" target="_blank" rel="noopener noreferrer" className="github-btn view-profile">
                        <span>GitHub Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="arrow-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <p className="github-bio">{githubProfile?.bio || "Microsoft Certified Trainer (MCT) | Solutions Architect Expert | Specialized in Azure, React, Node.js & AI integrations."}</p>
                  
                  <div className="github-meta-details">
                    <span className="github-meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <strong>{githubProfile?.followers || 142}</strong> followers &nbsp;·&nbsp; <strong>{githubProfile?.following || 86}</strong> following
                    </span>
                    {githubProfile?.location && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {githubProfile.location}
                      </span>
                    )}
                    {githubProfile?.company && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {githubProfile.company}
                      </span>
                    )}
                    {githubProfile?.blog && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        <a href={githubProfile.blog.startsWith('http') ? githubProfile.blog : `https://${githubProfile.blog}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {githubProfile.blog.replace(/^https?:\/\//, '')}
                        </a>
                      </span>
                    )}
                    {githubProfile?.twitter_username && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        @{githubProfile.twitter_username}
                      </span>
                    )}
                    {githubProfile?.public_gists > 0 && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {githubProfile.public_gists} Gists
                      </span>
                    )}
                    {githubProfile?.created_at && (
                      <span className="github-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Joined {new Date(githubProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Stats Grid */}
            <div className="github-stats-grid">
              <div className="github-stat-card">
                <div className="github-stat-icon repos">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" /></svg>
                </div>
                <div className="github-stat-info">
                  <span className="github-stat-value">{githubProfile?.public_repos || 28}</span>
                  <span className="github-stat-label">Repositories</span>
                </div>
              </div>
              <div className="github-stat-card">
                <div className="github-stat-icon followers">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div className="github-stat-info">
                  <span className="github-stat-value">{githubProfile?.followers || 142}</span>
                  <span className="github-stat-label">Followers</span>
                </div>
              </div>
              <div className="github-stat-card">
                <div className="github-stat-icon stars">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.586 1.802l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.774-.55-.376-1.802.586-1.802h4.907a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                </div>
                <div className="github-stat-info">
                  <span className="github-stat-value">256</span>
                  <span className="github-stat-label">Stars Earned</span>
                </div>
              </div>
              <div className="github-stat-card">
                <div className="github-stat-icon language">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <div className="github-stat-info">
                  <span className="github-stat-value" style={{ fontSize: '16px', fontWeight: '700' }}>React / JS</span>
                  <span className="github-stat-label">Top Skill</span>
                </div>
              </div>
            </div>

            {/* Contributions Activity Map */}
            <div className="github-contributions-card">
              <div className="github-contributions-header">
                <h3>3,142 contributions in the last year</h3>
                <span className="github-contributions-subtitle">Activity heatmap</span>
              </div>
              <div className="github-heatmap-container">
                <div className="github-heatmap-grid">
                  {Array.from({ length: 189 }).map((_, i) => {
                    const level = (i % 7 === 0) ? 0 : (i % 5 === 0) ? 3 : (i % 3 === 0) ? 1 : (i % 2 === 0) ? 2 : 4;
                    return (
                      <div 
                        key={i} 
                        className={`heatmap-cell level-${level}`} 
                        style={{ animationDelay: `${i * 3}ms` }}
                        title={`${level * 2} contributions`}
                      />
                    );
                  })}
                </div>
                <div className="github-heatmap-legend">
                  <span>Less</span>
                  <div className="heatmap-cell level-0" />
                  <div className="heatmap-cell level-1" />
                  <div className="heatmap-cell level-2" />
                  <div className="heatmap-cell level-3" />
                  <div className="heatmap-cell level-4" />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* GitHub Profile README */}
            {githubReadme && (
              <div className="github-readme-card">
                {renderMarkdown(githubReadme)}
              </div>
            )}

            {/* Popular Repositories */}
            <div className="github-repos-section">
              <h3 className="section-title">Popular Repositories</h3>
              <div className="github-repos-grid">
                {githubRepos.map((repo) => (
                  <a 
                    key={repo.name} 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="github-repo-card"
                  >
                    <div className="github-repo-inner">
                      <div className="github-repo-header">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="repo-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        <h4 className="repo-name">{repo.name}</h4>
                      </div>
                      <p className="repo-desc">{repo.description || "No description provided."}</p>
                      <div className="repo-meta">
                        {repo.language && (
                          <span className="repo-meta-item language">
                            <span className={`lang-dot ${repo.language.toLowerCase()}`}></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="repo-meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="repo-meta-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.586 1.802l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.774-.55-.376-1.802.586-1.802h4.907a1 1 0 00.95-.69l1.519-4.674z" /></svg>
                          {repo.stargazers_count}
                        </span>
                        <span className="repo-meta-item">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="repo-meta-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
    </main>

      {/* Mobile view footer (hidden on desktop) */}
      <footer className="mobile-footer">
        <div className="social-dock">
          <a href="https://github.com/ajf013" onClick={handleGithubClick} className="social-icon-btn github" title="GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://www.linkedin.com/in/ajf013-francis-cruz/" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://www.instagram.com/fcruz_013/" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://api.whatsapp.com/send?phone=916379649461" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
          <a href="https://x.com/Itsme_Ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" title="X (Twitter)" aria-label="X (formerly Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
        </div>
        <div className="copyright">
          Copyrights © {new Date().getFullYear()} Francis Cruz | MCT
        </div>
      </footer>

      {/* Pagination Controls */}
      {activeTab === 'projects' && (
        <div 
          className="pagination" 
          id="pagination"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          <div className="arrow arrow-left" onClick={handlePrev}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div className="arrow arrow-right" onClick={handleNext}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <div className="progress-sub-container">
            <div className="progress-sub-background">
              <div className="progress-sub-foreground"></div>
            </div>
          </div>
          <div className="slide-numbers" id="slide-numbers">
            {projects.map((_, idx) => (
              <div key={idx} className="item" id={`slide-item-${idx}`}>{idx + 1}</div>
            ))}
          </div>
        </div>
      )}

      {/* Cover screen loader */}
      <div className="cover">
        <div className="cover-content">
          <img src="./icon.png" alt="CruzOne Logo" className="cover-logo" />
          <div className="cover-title">CruzOne Portal</div>
          <div className="cover-loader">
            <div className="cover-loader-bar"></div>
          </div>
        </div>
      </div>

      {/* Add Project FAB */}
      {activeTab === 'projects' && isAdmin && (
        <button 
          className={`fab ${showInstallBanner && installPromptEvent && !showUpdate ? 'has-banner' : ''}`} 
          id="add-project-fab" 
          onClick={() => {
            setEditingProject(null);
            setPTitle('');
            setPCategory('');
            setPDesc('');
            setPLive('');
            setPRepo('');
            setCoverStyle('gradient-deep-blue');
            setPCustomImage('');
            setAiPreviewUrl('');
            isPausedRef.current = true;
            setShowModal(true);
          }} 
          title="Add Project Manually"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      )}

      {/* Add Project Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal')) { setShowModal(false); isPausedRef.current = false; } }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <button className="close-btn" onClick={() => { setShowModal(false); isPausedRef.current = false; }}>&times;</button>
          </div>
          <form id="project-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required placeholder="e.g. ATS Resume Score Checker" />
            </div>
            <div className="form-group">
              <label>Category / Tech Stack</label>
              <input type="text" value={pCategory} onChange={(e) => setPCategory(e.target.value)} required placeholder="e.g. React, PWA, JS" />
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} required placeholder="Describe what the project does..." />
            </div>
            <div className="form-group">
              <label>Live Link URL (Optional)</label>
              <input type="url" value={pLive} onChange={(e) => setPLive(e.target.value)} placeholder="https://atsscore.fcruz.org/" />
            </div>
            <div className="form-group">
              <label>GitHub Repository URL (Optional)</label>
              <input type="url" value={pRepo} onChange={(e) => setPRepo(e.target.value)} placeholder="https://github.com/ajf013/ATS-Resume-Score-Checker" />
            </div>
            
            {/* AI Auto-fill & Background Generator */}
            <div className="form-group ai-generation-group">
              <button 
                type="button" 
                className="ai-gen-btn"
                onClick={handleAiBackgroundGeneration}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <span className="spinner"></span> Processing with AI...
                  </>
                ) : (
                  <>
                    <svg className="ai-stars-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904ZM19.071 7.071L18 11L16.929 7.071L13 6L16.929 4.929L18 1L19.071 4.929L23 6L19.071 7.071Z" />
                    </svg>
                    Auto-Fill Live URL & Background
                  </>
                )}
              </button>
              {aiPreviewUrl && (
                <div className="ai-screenshot-preview">
                  <div className="preview-header">AI-Generated Homepage Background:</div>
                  <img src={aiPreviewUrl} alt="AI Live Preview" className="preview-img" onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="preview-caption">Using Live URL: <code>{pLive}</code></div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Cover Style</label>
              <div className="cover-options">
                {['gradient-deep-blue', 'gradient-sunset', 'gradient-green', 'gradient-gold', 'gradient-purple'].map((styleName) => (
                  <div
                    key={styleName}
                    className={`cover-option ${coverStyle === styleName ? 'active' : ''}`}
                    style={getBackgroundStyle({ image: styleName })}
                    onClick={() => setCoverStyle(styleName)}
                  />
                ))}
                <div
                  className={`cover-option custom-image-text ${coverStyle === 'custom' ? 'active' : ''}`}
                  onClick={() => setCoverStyle('custom')}
                >
                  Custom
                </div>
              </div>
              {coverStyle === 'custom' && (
                <input
                  type="url"
                  value={pCustomImage}
                  onChange={(e) => setPCustomImage(e.target.value)}
                  placeholder="Paste Custom Image URL"
                  style={{ marginTop: '10px' }}
                  required
                />
              )}
            </div>
            <button type="submit" className="submit-btn">Save Project</button>
          </form>
        </div>
      </div>

      {/* PWA Update Banner */}
      <div className={`update-banner ${showUpdate ? 'show' : ''}`}>
        <div className="update-banner-header">
          <span className="update-badge">Update Available</span>
          <span className="update-version">v{serverVersion}</span>
        </div>
        <div className="update-banner-body">
          <p>New features and improvements were successfully pushed:</p>
          <ul>
            {changelog.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <button className="update-banner-btn" onClick={handleUpdateRefresh}>Update & Refresh</button>
      </div>

      {/* PWA Install Banner */}
      {showInstallBanner && installPromptEvent && !showUpdate && (
        <div className="install-banner show">
          <div className="install-banner-header">
            <span className="install-badge">App Install</span>
            <button className="close-btn" onClick={() => setShowInstallBanner(false)}>&times;</button>
          </div>
          <div className="install-banner-body">
            <p>Add CruzOne Portal to your home screen for offline access and faster loading.</p>
          </div>
          <button 
            className="install-banner-btn" 
            onClick={async () => {
              if (installPromptEvent) {
                installPromptEvent.prompt();
                const { outcome } = await installPromptEvent.userChoice;
                if (outcome === 'accepted') {
                  setInstallPromptEvent(null);
                  setShowInstallBanner(false);
                }
              }
            }}
          >
            Install App
          </button>
        </div>
      )}

      {/* Architecture Playground Modal */}
      {activeArch && ARCHITECTURES[activeArch] && (
        <div className="arch-modal show" onClick={(e) => { if (e.target.classList.contains('arch-modal')) { setActiveArch(null); setSelectedNode(null); } }}>
          <div className="arch-modal-content">
            <div className="arch-modal-header">
              <div>
                <h2>{ARCHITECTURES[activeArch].title}</h2>
                <p className="arch-modal-sub">{ARCHITECTURES[activeArch].description}</p>
              </div>
              <button className="close-btn" onClick={() => { setActiveArch(null); setSelectedNode(null); }}>&times;</button>
            </div>
            
            <div className="arch-modal-body">
              {/* Interactive Canvas (Left Side) */}
              <div className="arch-canvas-wrapper">
                <div className="arch-canvas">
                  {/* Underlay connections using SVG */}
                  <svg className="arch-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {ARCHITECTURES[activeArch].connections.map((conn, idx) => {
                      const fromNode = ARCHITECTURES[activeArch].nodes.find(n => n.id === conn.from);
                      const toNode = ARCHITECTURES[activeArch].nodes.find(n => n.id === conn.to);
                      if (!fromNode || !toNode) return null;
                      return (
                        <g key={idx}>
                          <line
                            x1={`${fromNode.x}%`}
                            y1={`${fromNode.y}%`}
                            x2={`${toNode.x}%`}
                            y2={`${toNode.y}%`}
                            className="connection-line-bg"
                          />
                          <line
                            x1={`${fromNode.x}%`}
                            y1={`${fromNode.y}%`}
                            x2={`${toNode.x}%`}
                            y2={`${toNode.y}%`}
                            className="connection-line-fg"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nodes positioned absolutely */}
                  {ARCHITECTURES[activeArch].nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const nodeTypeColorMap = {
                      IaaS: "node-blue",
                      Network: "node-teal",
                      Compute: "node-orange",
                      Security: "node-green",
                      Database: "node-purple",
                      AI: "node-gold"
                    };
                    const nodeClass = nodeTypeColorMap[node.type] || "node-blue";

                    return (
                      <div
                        key={node.id}
                        className={`arch-node ${nodeClass} ${isSelected ? 'active' : ''}`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onMouseEnter={() => { setSelectedNode(node); setCopied(false); }}
                        onClick={() => { setSelectedNode(node); setCopied(false); }}
                      >
                        <div className="node-glow"></div>
                        <div className="node-icon-box">
                          {renderNodeIcon(node.type)}
                        </div>
                        <div className="node-label">{node.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Code / Info (Right Side) */}
              <div className="arch-sidebar">
                {selectedNode ? (
                  <div className="node-details">
                    <span className={`node-badge-type ${selectedNode.type.toLowerCase()}`}>{selectedNode.type}</span>
                    <h3>{selectedNode.label}</h3>
                    <p className="node-role">{selectedNode.role}</p>
                    
                    <div className="terraform-code-section">
                      <div className="code-header">
                        <span>Terraform Definition</span>
                        <button 
                          className="copy-code-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedNode.terraform);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="terraform-code">
                        <code>{selectedNode.terraform}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="node-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303.197-1.591 1.591M21 12h-2.25m-.197 5.303-1.591-1.591M12 21.75V19.5m-5.303-.197 1.591-1.591M3 12h2.25m.197-5.303 1.591 1.591" />
                    </svg>
                    <p>Hover or click on any architecture node to inspect its configurations and copy its Terraform declarations.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
