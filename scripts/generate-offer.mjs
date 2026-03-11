import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  UnderlineType,
  ShadingType,
  VerticalAlign,
  convertInchesToTwip,
  Header,
  Footer,
  TabStopPosition,
  TabStopType,
  ImageRun,
} from "docx";
import fs from "fs";
import path from "path";

// ─── Colour / font constants ────────────────────────────────────────────────
const PURPLE = "7C3AED";
const PURPLE_LIGHT = "EDE9FE";
const PURPLE_MID = "A78BFA";
const DARK = "1E1B4B";
const GRAY = "6B7280";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F3F4F6";
const FONT = "Calibri";
const FONT_SERIF = "Times New Roman";

// ─── Helper: section heading ─────────────────────────────────────────────────
function sectionHeading(number, title) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text: `${number}.  ${title}`,
        bold: true,
        size: 32,
        color: PURPLE,
        font: FONT,
      }),
    ],
    border: {
      bottom: { color: PURPLE_MID, size: 6, space: 4, style: BorderStyle.SINGLE },
    },
  });
}

// ─── Helper: sub-heading ──────────────────────────────────────────────────────
function subHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: DARK,
        font: FONT,
      }),
    ],
  });
}

// ─── Helper: body paragraph ──────────────────────────────────────────────────
function body(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    alignment: options.justify ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        size: 22,
        color: options.color || "111827",
        font: FONT,
        bold: options.bold || false,
        italics: options.italic || false,
      }),
    ],
  });
}

// ─── Helper: bullet point ────────────────────────────────────────────────────
function bullet(text, level = 0) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: convertInchesToTwip(0.25 + level * 0.25) },
    children: [
      new TextRun({ text: "▪  ", size: 22, color: PURPLE, font: FONT }),
      new TextRun({ text, size: 22, color: "111827", font: FONT }),
    ],
  });
}

// ─── Helper: labelled bullet (bold label + normal text) ─────────────────────
function labeledBullet(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: convertInchesToTwip(0.25) },
    children: [
      new TextRun({ text: "▪  ", size: 22, color: PURPLE, font: FONT }),
      new TextRun({ text: `${label}: `, size: 22, bold: true, color: DARK, font: FONT }),
      new TextRun({ text, size: 22, color: "111827", font: FONT }),
    ],
  });
}

// ─── Helper: page break ──────────────────────────────────────────────────────
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ─── Helper: spacer ──────────────────────────────────────────────────────────
function spacer(lines = 1) {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: "  ".repeat(lines) })],
  });
}

// ─── Helper: horizontal rule ─────────────────────────────────────────────────
function rule() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: {
      bottom: { color: PURPLE_LIGHT, size: 4, space: 1, style: BorderStyle.SINGLE },
    },
    children: [],
  });
}

// ─── Helper: shaded label (like a callout box title) ─────────────────────────
function callout(text) {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    shading: { type: ShadingType.SOLID, color: PURPLE_LIGHT, fill: PURPLE_LIGHT },
    indent: { left: convertInchesToTwip(0.15), right: convertInchesToTwip(0.15) },
    children: [
      new TextRun({ text, size: 22, bold: true, color: PURPLE, font: FONT }),
    ],
  });
}

// ─── Helper: standard table cell ─────────────────────────────────────────────
function tc(text, options = {}) {
  return new TableCell({
    width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
    shading: options.shading
      ? { type: ShadingType.SOLID, color: options.shading, fill: options.shading }
      : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: convertInchesToTwip(0.05),
      bottom: convertInchesToTwip(0.05),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1),
    },
    children: [
      new Paragraph({
        alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            size: options.size || 20,
            bold: options.bold || false,
            color: options.color || "111827",
            font: FONT,
          }),
        ],
      }),
    ],
  });
}

// ─── Table border helper ──────────────────────────────────────────────────────
function tableBorders() {
  const b = { color: "D1D5DB", size: 4, style: BorderStyle.SINGLE };
  return { top: b, bottom: b, left: b, right: b, insideH: b, insideV: b };
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 1 — COVER
// ════════════════════════════════════════════════════════════════════════════
function coverPage() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return [
    spacer(6),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: "[ COMPANY LOGO PLACEHOLDER ]",
          size: 22,
          color: PURPLE_MID,
          font: FONT,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
      shading: { type: ShadingType.SOLID, color: PURPLE, fill: PURPLE },
      children: [new TextRun({ text: " ", size: 4 })],
    }),
    spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: "FaceBlend AI",
          bold: true,
          size: 72,
          color: PURPLE,
          font: FONT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: "Commercial Offer",
          size: 48,
          color: DARK,
          font: FONT,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: "for Entertainment & Media Companies",
          size: 30,
          color: GRAY,
          font: FONT,
          italics: true,
        }),
      ],
    }),
    spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      border: {
        top: { color: PURPLE_MID, size: 6, style: BorderStyle.SINGLE },
        bottom: { color: PURPLE_MID, size: 6, style: BorderStyle.SINGLE },
      },
      children: [
        new TextRun({
          text: "AI-Powered Face Swap Platform  |  Real-Time Processing  |  Enterprise-Grade API",
          size: 22,
          color: PURPLE,
          font: FONT,
        }),
      ],
    }),
    spacer(4),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: `Prepared: ${dateStr}`, size: 20, color: GRAY, font: FONT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: "Prepared by: FaceBlend AI Technologies Ltd.", size: 20, color: GRAY, font: FONT }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({ text: "Confidential — For Addressee Only", size: 18, color: GRAY, font: FONT, italics: true }),
      ],
    }),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 2 — EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════════════════
function executiveSummary() {
  return [
    sectionHeading("1", "Executive Summary"),
    spacer(),
    body(
      "FaceBlend AI is an enterprise-grade artificial intelligence platform purpose-built for the Entertainment & Media industry. It delivers photorealistic, real-time face-swap capabilities through a cloud-native API and an intuitive web studio interface — enabling studios, broadcasters, gaming companies and digital agencies to create compelling visual content at a fraction of traditional production cost and turnaround time.",
      { justify: true }
    ),
    spacer(),
    callout("The Opportunity"),
    body(
      "The global visual effects (VFX) market was valued at USD 9.7 billion in 2024 and is projected to reach USD 19.4 billion by 2030, growing at a CAGR of 12.3%. Simultaneously, generative AI in media production is forecast to eliminate up to 40% of traditional post-production workflows, creating a decisive first-mover advantage for companies that adopt AI tooling today.",
      { justify: true }
    ),
    spacer(),
    callout("What We Deliver"),
    bullet("Sub-100 ms face-swap inference on standard cloud GPU infrastructure"),
    bullet("99.6% face-detection accuracy across diverse ethnicities, lighting conditions and occlusions"),
    bullet("Seamless REST API integration with existing production pipelines (Adobe Premiere, DaVinci Resolve, Unreal Engine)"),
    bullet("SOC 2 Type II compliant data handling with on-premise deployment option"),
    bullet("Dedicated CSM, SLA-backed uptime (99.95%) and 24 / 7 incident response"),
    spacer(),
    callout("ROI at a Glance"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          children: [
            tc("Metric", { bold: true, shading: PURPLE, color: WHITE, width: 50 }),
            tc("Industry Benchmark", { bold: true, shading: PURPLE, color: WHITE, width: 25, center: true }),
            tc("With FaceBlend AI", { bold: true, shading: PURPLE, color: WHITE, width: 25, center: true }),
          ],
          tableHeader: true,
        }),
        new TableRow({ children: [tc("Face-swap shot cost"), tc("€ 8,000 – 25,000", { center: true }), tc("€ 120 – 400", { center: true })] }),
        new TableRow({ children: [tc("Turnaround per shot"), tc("3 – 10 days", { center: true }), tc("< 5 minutes", { center: true })] }),
        new TableRow({ children: [tc("Artists required"), tc("3 – 6 senior VFX artists", { center: true }), tc("1 operator", { center: true })] }),
        new TableRow({ children: [tc("Revision cycles"), tc("Avg. 4.2 rounds", { center: true }), tc("Real-time preview", { center: true })] }),
        new TableRow({ children: [tc("Average cost reduction"), tc("—", { center: true }), tc("Up to 94%", { bold: true, center: true, color: PURPLE })] }),
      ],
    }),
    spacer(),
    body(
      "Clients in early access reported average production cost savings of 87% on face-replacement sequences and a 12× increase in content output volume within the first 90 days of deployment.",
      { italic: true, color: GRAY }
    ),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 3 — PROBLEM STATEMENT
// ════════════════════════════════════════════════════════════════════════════
function problemStatement() {
  return [
    sectionHeading("2", "Problem Statement"),
    spacer(),
    body(
      "Entertainment and media companies face mounting pressure to produce higher volumes of premium-quality visual content while simultaneously reducing budgets and accelerating release schedules. The convergence of streaming platform proliferation, social-media content velocity and audience expectations for cinematic quality has created a structural production gap that legacy VFX pipelines are no longer equipped to bridge.",
      { justify: true }
    ),
    spacer(),
    subHeading("2.1  The Cost Crisis in Visual Effects"),
    body(
      "Traditional face replacement, de-aging and character re-casting workflows rely on a labour-intensive combination of rotoscoping, 3-D matchmove, digital makeup and compositing — each executed by specialised artists using proprietary software suites. The median cost of a single approved face-swap shot in a major studio production exceeds €14,000, with revision cycles averaging 4.2 rounds per shot and turnaround times of 5 – 10 business days.",
      { justify: true }
    ),
    spacer(),
    callout("Key Pain Points"),
    labeledBullet("Unsustainable unit economics", "A 90-minute feature film requiring 150 digital face shots can incur VFX line items exceeding €2.1 million — 18% of a typical mid-budget production."),
    labeledBullet("Talent scarcity", "Experienced compositing artists command €70,000 – €130,000 annually; demand outstrips supply by an estimated 34% in the EU market."),
    labeledBullet("Revision bottleneck", "Director and client feedback loops are serialised; each round of revisions adds an average of 3.5 days to delivery schedules."),
    labeledBullet("Inconsistency at scale", "Manual workflows produce shot-to-shot variation that requires expensive quality-control passes, particularly in high-volume episodic TV."),
    labeledBullet("Rights & clearance complexity", "Engaging celebrity likeness for marketing assets requires complex contractual arrangements; digital doubles are prohibitively expensive for SME studios."),
    spacer(),
    subHeading("2.2  The Content Velocity Gap"),
    body(
      "Social media platforms now demand daily branded content; advertisers require rapid creative iteration across dozens of regional variants; broadcasters launch multiple simultaneous streaming titles. Yet the average post-production pipeline for a 30-second branded spot still takes 6 – 12 weeks from brief to delivery.",
      { justify: true }
    ),
    spacer(),
    bullet("72% of media executives cite 'inability to produce content fast enough' as their top operational risk (PwC Media Outlook 2024)."),
    bullet("Streaming platforms release 40% more original content year-over-year while per-title budgets remain flat."),
    bullet("Advertisers requiring personalised video-ad variants at scale report that traditional production is 8× too slow to meet campaign windows."),
    bullet("Gaming studios lose an average of €340,000 per week of delayed release due to unresolved character-skin and face-asset pipelines."),
    spacer(),
    subHeading("2.3  Legacy Technology Limitations"),
    body(
      "Existing face-swap tools available to media professionals fall into two inadequate categories: consumer-grade mobile applications that produce artifacts unacceptable for professional use, and bespoke machine-learning research pipelines that require data-science teams, weeks of training time per subject, and infrastructure investment exceeding €200,000. There is a critical market gap for a production-ready, API-first solution that meets broadcast quality standards without requiring in-house AI expertise.",
      { justify: true }
    ),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 4 — OUR SOLUTION
// ════════════════════════════════════════════════════════════════════════════
function ourSolution() {
  return [
    sectionHeading("3", "Our Solution — FaceBlend AI Platform"),
    spacer(),
    body(
      "FaceBlend AI is a full-stack, cloud-native platform that makes photorealistic face replacement accessible to any media production team — regardless of in-house AI expertise. Combining a proprietary multi-stage neural network pipeline with a professional web studio interface and a developer-friendly REST API, FaceBlend AI collapses the face-replacement workflow from weeks to minutes.",
      { justify: true }
    ),
    spacer(),
    subHeading("3.1  Core Technology"),
    body(
      "Our inference engine is built on a novel Hierarchical Identity Preservation Network (HIPNet) — a transformer-based architecture trained on 14 million licensed facial images spanning 180+ ethnicities, 6 lighting categories and 12 production contexts. HIPNet achieves state-of-the-art scores on the FaceForensics++ benchmark (AUC 0.997) while maintaining real-time throughput of 60 fps at 4K resolution on a single NVIDIA A10G GPU instance.",
      { justify: true }
    ),
    spacer(),
    callout("Technology Stack at a Glance"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          children: [
            tc("Layer", { bold: true, shading: PURPLE, color: WHITE, width: 30 }),
            tc("Technology", { bold: true, shading: PURPLE, color: WHITE, width: 70 }),
          ],
          tableHeader: true,
        }),
        new TableRow({ children: [tc("Face Detection"), tc("RetinaFace + custom landmark predictor (68 pts, sub-2 ms)")] }),
        new TableRow({ children: [tc("Identity Encoding"), tc("ArcFace v3 fine-tuned on licensed production dataset")] }),
        new TableRow({ children: [tc("Swap Synthesis"), tc("HIPNet (proprietary) — 512-dim latent space, 24-layer transformer")] }),
        new TableRow({ children: [tc("Colour Grading"), tc("Adaptive histogram matching + neural colour transfer")] }),
        new TableRow({ children: [tc("Anti-Artifact"), tc("GFPGAN v2 face restoration post-processor")] }),
        new TableRow({ children: [tc("Infrastructure"), tc("Kubernetes on AWS (eu-west-1 & us-east-1), auto-scaling GPU node pools")] }),
      ],
    }),
    spacer(),
    subHeading("3.2  How It Works — Three-Step Workflow"),
    body("Step 1 — Enrol: Upload a reference identity (minimum 5 photos or 10 seconds of video). FaceBlend AI builds an encrypted identity capsule in under 90 seconds."),
    body("Step 2 — Process: Submit source footage via web studio drag-and-drop or REST API. Select target identity capsule. The engine performs detection, alignment, synthesis and colour matching automatically."),
    body("Step 3 — Deliver: Download broadcast-quality output (ProRes 4444, H.265, or WebM) or stream results directly to downstream pipeline tools via webhook."),
    spacer(),
    subHeading("3.3  Platform Components"),
    labeledBullet("FaceBlend Studio", "Browser-based professional editing interface with real-time preview, frame-level QC overlay, and collaborative review workflow."),
    labeledBullet("FaceBlend API", "RESTful API (OpenAPI 3.1 spec) with SDKs for Python, Node.js, and C#. Supports synchronous and asynchronous job submission."),
    labeledBullet("FaceBlend Batch Engine", "Automated processing pipeline for high-volume workloads — up to 10,000 images or 40 hours of video per day per Enterprise tenant."),
    labeledBullet("FaceBlend Plugin Suite", "Native plugins for Adobe Premiere Pro, After Effects, DaVinci Resolve, and Unreal Engine 5."),
    labeledBullet("Identity Vault", "Encrypted, consent-managed repository for licensed digital identities with granular access controls and full audit trail."),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 5 — KEY FEATURES & CAPABILITIES
// ════════════════════════════════════════════════════════════════════════════
function keyFeatures() {
  return [
    sectionHeading("4", "Key Features & Capabilities"),
    spacer(),
    body(
      "FaceBlend AI is engineered to the exacting standards of professional media production. Every feature has been co-developed with studio partners and validated against broadcast-quality benchmarks.",
      { justify: true }
    ),
    spacer(),

    subHeading("4.1  Real-Time Face Swap"),
    bullet("60 fps real-time processing at up to 4K (3840 × 2160) resolution"),
    bullet("< 100 ms end-to-end latency on live video streams (RTMP / WebRTC input supported)"),
    bullet("Automatic occlusion handling: glasses, hats, scarves, partial shadows"),
    bullet("Multi-face simultaneous processing: up to 8 distinct identities per frame"),
    bullet("Temporal coherence algorithm eliminates flicker across consecutive frames"),
    spacer(),

    subHeading("4.2  Batch Processing"),
    bullet("Automated queue management for large-scale image and video workloads"),
    bullet("Priority job scheduling with configurable SLA tiers"),
    bullet("Progress tracking dashboard with per-shot quality scores and exception flagging"),
    bullet("Parallel processing across distributed GPU clusters — linear throughput scaling"),
    bullet("Output packaging: ZIP delivery, S3 / Azure Blob / GCS direct egress, or FTP push"),
    spacer(),

    subHeading("4.3  Developer API"),
    bullet("RESTful API with OpenAPI 3.1 specification and interactive Swagger documentation"),
    bullet("Idempotent job submission with webhook callbacks (Retry-After compliant)"),
    bullet("OAuth 2.0 / API-key authentication; per-key rate limiting and quota management"),
    bullet("SDKs: Python 3.10+, Node.js 18+, C# .NET 7, Go 1.21"),
    bullet("Sandbox environment with sample media library for integration testing"),
    spacer(),

    subHeading("4.4  Quality & Colour Science"),
    bullet("Neural colour transfer preserves source footage LUT and colour space (Rec.709, Rec.2020, DCI-P3)"),
    bullet("Adaptive lighting match — analyses and replicates ambient light direction and temperature"),
    bullet("Skin-texture fidelity engine preserves pores, wrinkles and micro-detail at pixel level"),
    bullet("Automatic grain / noise matching to prevent swap-region from appearing 'clean'"),
    spacer(),

    subHeading("4.5  Compliance & Ethics"),
    bullet("Consent management module: cryptographic attestation of identity holder approval"),
    bullet("Deepfake watermarking: C2PA-compliant provenance embedding in all output files"),
    bullet("Built-in content policy engine: configurable blocklist for protected identities"),
    bullet("GDPR Article 9 compliant — biometric data stored in EU data centres, zero data retention option"),
    bullet("SOC 2 Type II, ISO 27001 certified infrastructure"),
    spacer(),

    subHeading("4.6  Collaboration & Workflow"),
    bullet("Multi-user project workspaces with role-based access control (Admin / Editor / Reviewer)"),
    bullet("Frame-accurate comment and annotation tool for director review"),
    bullet("Version history with one-click rollback to any prior render state"),
    bullet("Slack, Microsoft Teams and email notification integrations"),
    bullet("SSO via SAML 2.0 / OIDC compatible with Okta, Azure AD, Google Workspace"),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 6 — USE CASES
// ════════════════════════════════════════════════════════════════════════════
function useCases() {
  return [
    sectionHeading("5", "Use Cases"),
    spacer(),
    body(
      "FaceBlend AI's versatility spans the full spectrum of Entertainment & Media production contexts. Below are the primary deployment patterns adopted by our current customer base.",
      { justify: true }
    ),
    spacer(),

    subHeading("5.1  Film & Television Production"),
    body("De-aging and re-casting without reshoots — a task that previously required months of VFX work — is reduced to hours. Applications include:"),
    bullet("Digital double creation for stunt sequences and hazardous scene coverage"),
    bullet("Actor de-aging for flashback sequences (eliminate the need for prosthetics or multi-month VFX passes)"),
    bullet("Post-production recast when casting changes occur during editing"),
    bullet("Localisation: lip-sync-ready face replacement for dubbed international versions"),
    body("Case study: A leading UK broadcaster used FaceBlend AI to produce 240 de-aged face shots across a 6-part drama series — 14 weeks ahead of schedule and 91% under the original VFX budget.", { italic: true, color: GRAY }),
    spacer(),

    subHeading("5.2  Gaming & Interactive Media"),
    bullet("Player-face import: seamlessly insert player's own face onto game character models"),
    bullet("NPC skin customisation at runtime — no pre-baked texture atlas required"),
    bullet("Cutscene personalisation for narrative-driven titles"),
    bullet("Streaming and esports overlays with real-time identity swap for content-creator branding"),
    spacer(),

    subHeading("5.3  Social Media & Creator Economy"),
    bullet("White-label filter SDK for platforms: integrate face-swap into native camera UX"),
    bullet("Creator avatar generation — persistent branded digital identity across content"),
    bullet("AR try-on for cosmetics, eyewear and accessories brands (B2B2C model)"),
    bullet("Short-form video templates with pre-cleared celebrity face licenses"),
    spacer(),

    subHeading("5.4  Advertising & Brand Marketing"),
    bullet("Hyper-personalised video ads: algorithmically insert regional talent faces into hero spots"),
    bullet("Rapid creative testing — produce 50+ ad variants with different talent faces in one afternoon"),
    bullet("Spokesperson continuity: update existing ad library to feature current brand ambassadors"),
    bullet("Interactive product demos with personalised 'try the look' face overlays"),
    body("Reported outcome: A global FMCG brand generated 147 regional ad variants across 23 markets in 4 hours, achieving a 34% uplift in click-through rate versus static creative.", { italic: true, color: GRAY }),
    spacer(),

    subHeading("5.5  Virtual Production & Live Events"),
    bullet("Real-time face replacement on LED-volume sets for live broadcast"),
    bullet("Concert and theatre production: digital performer presence without physical travel"),
    bullet("Esports and sports broadcast: athlete face overlays on real-time motion capture"),
    bullet("Corporate communications: executive avatar for multi-language internal video broadcasts"),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 7 — TECHNICAL ARCHITECTURE
// ════════════════════════════════════════════════════════════════════════════
function technicalArchitecture() {
  return [
    sectionHeading("6", "Technical Architecture"),
    spacer(),
    body(
      "FaceBlend AI is designed as a cloud-native, microservices-based platform with a clear separation of concerns between the presentation layer, the orchestration layer, and the AI inference layer. The architecture is built for horizontal scalability, multi-tenancy, and zero-downtime deployments.",
      { justify: true }
    ),
    spacer(),

    subHeading("6.1  Frontend — React Web Studio"),
    bullet("Framework: React 18 with TypeScript; state management via Zustand + React Query"),
    bullet("Real-time preview using WebRTC MediaStream API and WASM-accelerated decode"),
    bullet("Drag-and-drop media ingestion with client-side format validation and progress tracking"),
    bullet("Frame-accurate scrubbing with GPU-accelerated canvas rendering (WebGL 2.0)"),
    bullet("Responsive layout supporting 1080p – 4K workstation monitors; keyboard-shortcut driven"),
    bullet("Internationalisation: 14 languages supported (i18n via react-intl)"),
    spacer(),

    subHeading("6.2  Backend — Node.js Orchestration Layer"),
    bullet("Runtime: Node.js 20 LTS; framework: Fastify 4 with full TypeScript coverage"),
    bullet("API gateway: Kong with rate limiting, JWT validation and request tracing"),
    bullet("Job queue: BullMQ backed by Redis Cluster — supports 50,000 concurrent jobs"),
    bullet("Media ingestion: chunked multipart upload to S3-compatible object storage with server-side AES-256 encryption"),
    bullet("Webhook delivery engine: guaranteed-at-least-once delivery with exponential backoff"),
    bullet("Observability: OpenTelemetry traces, Prometheus metrics, structured JSON logs → Grafana Cloud"),
    spacer(),

    subHeading("6.3  AI Inference Pipeline"),
    bullet("Inference runtime: NVIDIA Triton Inference Server 2.42 with TensorRT 9 optimisation"),
    bullet("Model serving: dynamic batching with configurable max-batch-size (default 8 frames)"),
    bullet("GPU fleet: NVIDIA A10G (real-time) and A100 80 GB (batch ultra-quality) on AWS EC2"),
    bullet("Auto-scaling: KEDA-driven Kubernetes HPA — scales 0 → 200 GPU pods in < 90 seconds"),
    bullet("Model versioning: MLflow Model Registry with A/B shadow-deployment capability"),
    bullet("Edge deployment option: ONNX export for on-premise NVIDIA RTX Workstation"),
    spacer(),

    subHeading("6.4  Data & Security Architecture"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          children: [
            tc("Domain", { bold: true, shading: PURPLE, color: WHITE, width: 30 }),
            tc("Implementation", { bold: true, shading: PURPLE, color: WHITE, width: 70 }),
          ],
          tableHeader: true,
        }),
        new TableRow({ children: [tc("Encryption in transit"), tc("TLS 1.3; HSTS enforced; certificate pinning in mobile SDK")] }),
        new TableRow({ children: [tc("Encryption at rest"), tc("AES-256-GCM for object storage; column-level encryption for PII in PostgreSQL")] }),
        new TableRow({ children: [tc("Identity & Access"), tc("RBAC with attribute-based policies; MFA enforced for all admin roles")] }),
        new TableRow({ children: [tc("Network isolation"), tc("VPC per tenant (Enterprise); PrivateLink endpoints; WAF + DDoS protection")] }),
        new TableRow({ children: [tc("Audit logging"), tc("Immutable CloudTrail + application audit log; 2-year retention")] }),
        new TableRow({ children: [tc("Pen testing"), tc("Annual third-party penetration test (CREST certified); continuous DAST scanning")] }),
      ],
    }),
    spacer(),

    subHeading("6.5  Uptime & Reliability"),
    bullet("Multi-region active-active deployment: AWS eu-west-1 (Dublin) + us-east-1 (Virginia)"),
    bullet("99.95% monthly uptime SLA (Enterprise tier); compensatory credits for breach"),
    bullet("RTO < 4 hours; RPO < 15 minutes for Tier-1 failure scenarios"),
    bullet("Chaos engineering programme: monthly fault-injection tests using AWS Fault Injection Service"),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 8 — PRICING & PLANS
// ════════════════════════════════════════════════════════════════════════════
function pricingPlans() {
  return [
    sectionHeading("7", "Pricing & Plans"),
    spacer(),
    body(
      "FaceBlend AI is offered on a monthly subscription basis with no long-term commitment required for Starter and Professional tiers. Enterprise contracts are structured annually with custom volume pricing, dedicated infrastructure and expanded SLAs.",
      { justify: true }
    ),
    spacer(),

    // Pricing comparison table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        // Header row
        new TableRow({
          children: [
            tc("", { width: 28 }),
            tc("Starter", { bold: true, shading: PURPLE_LIGHT, color: PURPLE, width: 24, center: true, size: 24 }),
            tc("Professional", { bold: true, shading: PURPLE, color: WHITE, width: 24, center: true, size: 24 }),
            tc("Enterprise", { bold: true, shading: DARK, color: WHITE, width: 24, center: true, size: 24 }),
          ],
          tableHeader: true,
        }),
        // Price row
        new TableRow({
          children: [
            tc("Monthly Price", { bold: true }),
            tc("€ 499 / month", { center: true, bold: true, color: PURPLE }),
            tc("€ 1,999 / month", { center: true, bold: true, color: WHITE, shading: PURPLE }),
            tc("Custom Quote", { center: true, bold: true, color: WHITE, shading: DARK }),
          ],
        }),
        // Features
        new TableRow({ children: [tc("Annual Commitment Discount", { bold: true }), tc("10% (€ 449/mo)", { center: true }), tc("15% (€ 1,699/mo)", { center: true, color: WHITE, shading: PURPLE }), tc("Negotiable", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Processed Minutes / Month", { bold: true }), tc("500 min", { center: true }), tc("5,000 min", { center: true, color: WHITE, shading: PURPLE }), tc("Unlimited", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Max Output Resolution", { bold: true }), tc("Full HD (1080p)", { center: true }), tc("4K UHD", { center: true, color: WHITE, shading: PURPLE }), tc("8K / Custom", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Concurrent API Jobs", { bold: true }), tc("5", { center: true }), tc("50", { center: true, color: WHITE, shading: PURPLE }), tc("500+", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Identity Capsules (Faces)", { bold: true }), tc("10", { center: true }), tc("100", { center: true, color: WHITE, shading: PURPLE }), tc("Unlimited", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Real-Time Streaming", { bold: true }), tc("—", { center: true }), tc("✓", { center: true, bold: true, color: WHITE, shading: PURPLE }), tc("✓", { center: true, bold: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Batch Processing Engine", { bold: true }), tc("—", { center: true }), tc("✓", { center: true, bold: true, color: WHITE, shading: PURPLE }), tc("✓", { center: true, bold: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Plugin Suite", { bold: true }), tc("—", { center: true }), tc("✓", { center: true, bold: true, color: WHITE, shading: PURPLE }), tc("✓", { center: true, bold: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Dedicated CSM", { bold: true }), tc("—", { center: true }), tc("—", { center: true, color: WHITE, shading: PURPLE }), tc("✓", { center: true, bold: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("On-Premise / Private Cloud", { bold: true }), tc("—", { center: true }), tc("—", { center: true, color: WHITE, shading: PURPLE }), tc("✓", { center: true, bold: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("SLA Uptime", { bold: true }), tc("99.5%", { center: true }), tc("99.9%", { center: true, color: WHITE, shading: PURPLE }), tc("99.95%", { center: true, color: WHITE, shading: DARK })] }),
        new TableRow({ children: [tc("Support", { bold: true }), tc("Email (48 h SLA)", { center: true }), tc("Priority email + chat", { center: true, color: WHITE, shading: PURPLE }), tc("24/7 phone + Slack", { center: true, color: WHITE, shading: DARK })] }),
      ],
    }),
    spacer(),

    subHeading("7.1  Add-On Services"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          children: [
            tc("Add-On", { bold: true, shading: PURPLE, color: WHITE, width: 40 }),
            tc("Price", { bold: true, shading: PURPLE, color: WHITE, width: 30, center: true }),
            tc("Notes", { bold: true, shading: PURPLE, color: WHITE, width: 30 }),
          ],
          tableHeader: true,
        }),
        new TableRow({ children: [tc("Additional Processing Minutes"), tc("€ 0.65 / min", { center: true }), tc("Beyond plan allowance")] }),
        new TableRow({ children: [tc("Additional Identity Capsules"), tc("€ 49 / capsule / mo", { center: true }), tc("Permanent once enrolled")] }),
        new TableRow({ children: [tc("Priority Rendering (< 30 s turnaround)"), tc("€ 1.20 / min", { center: true }), tc("Flash queue access")] }),
        new TableRow({ children: [tc("Custom Model Fine-Tuning"), tc("€ 4,500 one-time", { center: true }), tc("Domain-specific accuracy boost")] }),
        new TableRow({ children: [tc("Managed On-Premise Deployment"), tc("€ 12,000 setup + maintenance", { center: true }), tc("Enterprise only")] }),
        new TableRow({ children: [tc("Professional Services / Integration"), tc("€ 195 / hour", { center: true }), tc("Min. 10-hour engagement")] }),
      ],
    }),
    spacer(),
    body("All prices are exclusive of VAT. Invoicing is monthly in arrears for subscription tiers. Enterprise contracts are invoiced annually in advance with quarterly true-up provisions. Pricing is fixed for 24 months from contract signature.", { italic: true, color: GRAY }),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 9 — IMPLEMENTATION TIMELINE
// ════════════════════════════════════════════════════════════════════════════
function implementationTimeline() {
  return [
    sectionHeading("8", "Implementation Timeline"),
    spacer(),
    body(
      "FaceBlend AI follows a structured 12-week onboarding programme designed to ensure successful adoption with minimal disruption to active production pipelines. The programme is executed by a dedicated Implementation Engineer and Customer Success Manager, supported by our Solutions Architecture team.",
      { justify: true }
    ),
    spacer(),

    // Gantt-style table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        // Header
        new TableRow({
          tableHeader: true,
          children: [
            tc("Phase / Milestone", { bold: true, shading: PURPLE, color: WHITE, width: 36 }),
            tc("Wk 1–2", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Wk 3–4", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Wk 5–6", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Wk 7–8", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Wk 9–10", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Wk 11–12", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Owner", { bold: true, shading: PURPLE, color: WHITE, width: 16 }),
          ],
        }),

        // Phase 1
        new TableRow({
          children: [
            tc("PHASE 1 — Discovery & Setup", { bold: true, shading: PURPLE_LIGHT, color: PURPLE }),
            tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }),
            tc("", {}), tc("", {}), tc("", {}),
            tc("", { shading: PURPLE_LIGHT }),
          ],
        }),
        new TableRow({ children: [tc("Kickoff & stakeholder alignment"), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc(""), tc(""), tc(""), tc("FaceBlend CSM")] }),
        new TableRow({ children: [tc("Technical environment audit"), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc(""), tc(""), tc(""), tc("Solutions Architect")] }),
        new TableRow({ children: [tc("SSO / IAM integration"), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc(""), tc(""), tc("Client IT + FaceBlend")] }),
        new TableRow({ children: [tc("API credentials & sandbox access provisioned"), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc(""), tc(""), tc("FaceBlend Eng.")] }),

        // Phase 2
        new TableRow({
          children: [
            tc("PHASE 2 — Integration & Training", { bold: true, shading: PURPLE_LIGHT, color: PURPLE }),
            tc("", {}), tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }), tc("", {}),
            tc("", { shading: PURPLE_LIGHT }),
          ],
        }),
        new TableRow({ children: [tc("Plugin installation & pipeline testing"), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc(""), tc("Client VFX + FaceBlend")] }),
        new TableRow({ children: [tc("Identity capsule enrolment (talent assets)"), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc("Client & FaceBlend")] }),
        new TableRow({ children: [tc("API integration development & QA"), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc("Client Dev Team")] }),
        new TableRow({ children: [tc("Operator & artist training workshop"), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc(""), tc("FaceBlend CSM")] }),
        new TableRow({ children: [tc("Pilot production run (real project)"), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc("Client Production")] }),

        // Phase 3
        new TableRow({
          children: [
            tc("PHASE 3 — Go-Live & Optimisation", { bold: true, shading: PURPLE_LIGHT, color: PURPLE }),
            tc("", {}), tc("", {}), tc("", {}), tc("", {}), tc("", { shading: PURPLE_LIGHT }), tc("", { shading: PURPLE_LIGHT }),
            tc("", { shading: PURPLE_LIGHT }),
          ],
        }),
        new TableRow({ children: [tc("Production go-live"), tc(""), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc(""), tc("Client")] }),
        new TableRow({ children: [tc("Performance review & optimisation"), tc(""), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("●", { center: true, color: PURPLE, bold: true }), tc("FaceBlend CSM")] }),
        new TableRow({ children: [tc("30-day post-launch health check"), tc(""), tc(""), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("FaceBlend CSM")] }),
        new TableRow({ children: [tc("Roadmap & expansion planning session"), tc(""), tc(""), tc(""), tc(""), tc(""), tc("●", { center: true, color: PURPLE, bold: true }), tc("FaceBlend CSM")] }),
      ],
    }),
    spacer(),

    subHeading("8.1  Phase Summaries"),
    labeledBullet("Phase 1 (Weeks 1–4) — Discovery & Setup", "Establish secure connectivity, complete environment audit, provision accounts and integrate SSO. Deliverable: signed-off technical readiness report."),
    labeledBullet("Phase 2 (Weeks 3–10) — Integration & Training", "Install plugins, enrol identity assets, build and QA API integration, train all operators, and validate output quality on a live pilot project. Deliverable: pilot production sign-off."),
    labeledBullet("Phase 3 (Weeks 9–12) — Go-Live & Optimisation", "Full production deployment, performance baseline measurement, initial optimisation pass and forward roadmap planning. Deliverable: 30-day post-launch health report."),
    spacer(),
    body("Timeline assumes client environment readiness by contract signature + 5 business days. Delays in client-side SSO configuration or asset delivery may extend phases proportionately. A dedicated project tracker (Notion workspace) is shared with all client stakeholders from Day 1.", { italic: true, color: GRAY }),
    pageBreak(),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  PAGE 10 — NEXT STEPS & CONTACT
// ════════════════════════════════════════════════════════════════════════════
function nextSteps() {
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(today.getDate() + 30);
  const expiryStr = expiryDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return [
    sectionHeading("9", "Next Steps & Contact"),
    spacer(),
    body(
      "We are excited about the opportunity to bring FaceBlend AI into your production workflow and are confident it will deliver transformative results from Day 1. The following steps are recommended to move the engagement forward efficiently.",
      { justify: true }
    ),
    spacer(),

    subHeading("9.1  Recommended Next Steps"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            tc("#", { bold: true, shading: PURPLE, color: WHITE, width: 8, center: true }),
            tc("Action", { bold: true, shading: PURPLE, color: WHITE, width: 46 }),
            tc("Responsible", { bold: true, shading: PURPLE, color: WHITE, width: 26 }),
            tc("Target Date", { bold: true, shading: PURPLE, color: WHITE, width: 20 }),
          ],
        }),
        new TableRow({ children: [tc("1", { center: true, bold: true, color: PURPLE }), tc("Schedule a 30-minute technical demo (live platform walkthrough)"), tc("Client + FaceBlend Sales"), tc("Within 5 days")] }),
        new TableRow({ children: [tc("2", { center: true, bold: true, color: PURPLE }), tc("Provide sample footage for a free proof-of-concept render (up to 3 min)"), tc("Client Production"), tc("Within 10 days")] }),
        new TableRow({ children: [tc("3", { center: true, bold: true, color: PURPLE }), tc("Legal review of MSA, DPA and consent framework"), tc("Client Legal"), tc("Within 14 days")] }),
        new TableRow({ children: [tc("4", { center: true, bold: true, color: PURPLE }), tc("Agree on subscription tier and contract terms"), tc("Client + FaceBlend"), tc("Within 21 days")] }),
        new TableRow({ children: [tc("5", { center: true, bold: true, color: PURPLE }), tc("Contract signature and onboarding programme kickoff"), tc("Both parties"), tc("Within 30 days")] }),
      ],
    }),
    spacer(),

    callout(`This offer is valid until ${expiryStr}`),
    body("Pricing and tier availability are subject to change after this date. Contracts signed within the validity period lock in the quoted rates for 24 months.", { italic: true, color: GRAY }),
    spacer(),

    subHeading("9.2  Free Proof-of-Concept"),
    body(
      "We invite you to experience the quality of FaceBlend AI first-hand at no cost and with no obligation. Simply send us up to 3 minutes of source footage and a reference identity, and our team will return broadcast-quality results within 24 hours. This proof-of-concept service is available to all prospective Enterprise and Professional customers.",
      { justify: true }
    ),
    spacer(),

    subHeading("9.3  Contact Information"),
    new Table({
      width: { size: 80, type: WidthType.PERCENTAGE },
      borders: tableBorders(),
      rows: [
        new TableRow({
          children: [
            tc("FaceBlend AI Technologies Ltd.", { bold: true, shading: PURPLE, color: WHITE, width: 100 }),
          ],
          tableHeader: true,
        }),
        new TableRow({ children: [tc("Registered Address: 12 Shoreditch High Street, London EC1A 2AA, United Kingdom")] }),
        new TableRow({ children: [tc("Sales & Partnerships: sales@faceblend.ai")] }),
        new TableRow({ children: [tc("Technical Enquiries: solutions@faceblend.ai")] }),
        new TableRow({ children: [tc("Phone: +44 (0)20 7946 0823")] }),
        new TableRow({ children: [tc("Web: https://www.faceblend.ai")] }),
        new TableRow({ children: [tc("LinkedIn: linkedin.com/company/faceblend-ai")] }),
      ],
    }),
    spacer(2),

    subHeading("9.4  Signature Block"),
    body("By signing below, both parties confirm acceptance of this Commercial Offer and authorise FaceBlend AI Technologies Ltd. to commence the onboarding process as outlined in Section 8."),
    spacer(),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: "For and on behalf of FaceBlend AI Technologies Ltd.", size: 18, font: FONT, bold: true })] }),
                spacer(),
                new Paragraph({ border: { bottom: { color: GRAY, size: 4, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: " ", size: 36 })] }),
                new Paragraph({ children: [new TextRun({ text: "Authorised Signatory", size: 16, font: FONT, color: GRAY })] }),
                spacer(),
                new Paragraph({ border: { bottom: { color: GRAY, size: 4, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: " ", size: 36 })] }),
                new Paragraph({ children: [new TextRun({ text: "Date", size: 16, font: FONT, color: GRAY })] }),
              ],
            }),
            new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [spacer()] }),
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: "For and on behalf of [Client Organisation]", size: 18, font: FONT, bold: true })] }),
                spacer(),
                new Paragraph({ border: { bottom: { color: GRAY, size: 4, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: " ", size: 36 })] }),
                new Paragraph({ children: [new TextRun({ text: "Authorised Signatory", size: 16, font: FONT, color: GRAY })] }),
                spacer(),
                new Paragraph({ border: { bottom: { color: GRAY, size: 4, style: BorderStyle.SINGLE } }, children: [new TextRun({ text: " ", size: 36 })] }),
                new Paragraph({ children: [new TextRun({ text: "Date", size: 16, font: FONT, color: GRAY })] }),
              ],
            }),
          ],
        }),
      ],
    }),
    spacer(),
    rule(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 0 },
      children: [
        new TextRun({
          text: "© 2025 FaceBlend AI Technologies Ltd.  All rights reserved.  Confidential & Proprietary.",
          size: 16,
          color: GRAY,
          font: FONT,
          italics: true,
        }),
      ],
    }),
  ];
}

// ════════════════════════════════════════════════════════════════════════════
//  DOCUMENT ASSEMBLY
// ════════════════════════════════════════════════════════════════════════════
async function generateDocument() {
  const children = [
    ...coverPage(),
    ...executiveSummary(),
    ...problemStatement(),
    ...ourSolution(),
    ...keyFeatures(),
    ...useCases(),
    ...technicalArchitecture(),
    ...pricingPlans(),
    ...implementationTimeline(),
    ...nextSteps(),
  ];

  const doc = new Document({
    creator: "FaceBlend AI Technologies Ltd.",
    title: "FaceBlend AI — Commercial Offer for Entertainment & Media",
    description: "Professional commercial offer document for the FaceBlend AI face-swap platform",
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22, color: "111827" },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.15),
              right: convertInchesToTwip(1.15),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: {
                  bottom: { color: PURPLE_LIGHT, size: 4, style: BorderStyle.SINGLE },
                },
                children: [
                  new TextRun({ text: "FaceBlend AI  |  Commercial Offer  |  CONFIDENTIAL", size: 16, color: GRAY, font: FONT, italics: true }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  top: { color: PURPLE_LIGHT, size: 4, style: BorderStyle.SINGLE },
                },
                children: [
                  new TextRun({ text: "© 2025 FaceBlend AI Technologies Ltd.  |  sales@faceblend.ai  |  www.faceblend.ai", size: 16, color: GRAY, font: FONT }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const outputPath = path.resolve("/home/user/faceblend/docs/FaceBlend_Commercial_Offer.docx");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);

  console.log(`✓  Document generated successfully.`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size:   ${(buffer.length / 1024).toFixed(1)} KB`);
}

generateDocument().catch((err) => {
  console.error("Failed to generate document:", err);
  process.exit(1);
});
