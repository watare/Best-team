import pptxgen from 'pptxgenjs'

const prs = new pptxgen()

prs.layout = 'LAYOUT_WIDE'

// ─── Design tokens ───────────────────────────────────────────────────────────
const BG_DARK       = '0f0f1a'
const BG_CARD       = '1a1a2e'
const BG_CARD2      = '16213e'
const ACCENT        = '7c3aed'
const ACCENT_LIGHT  = '9d5ffa'
const WHITE         = 'FFFFFF'
const GRAY_LIGHT    = 'c4c4d4'
const GRAY_MID      = '8888aa'
const SUCCESS       = '22c55e'

const FONT_MAIN = 'Calibri'

function darkSlide(prs) {
  const slide = prs.addSlide()
  slide.background = { color: BG_DARK }
  return slide
}

function addAccentBar(slide, y = 0.18) {
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y, w: '100%', h: 0.06,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  })
}

function addFooter(slide, text = 'FaceBlend AI  |  contact@faceblend.ai') {
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 6.9, w: '100%', h: 0.1,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  })
  slide.addText(text, {
    x: 0, y: 6.88, w: '100%', h: 0.22,
    align: 'center', fontSize: 9,
    color: 'ddccff', fontFace: FONT_MAIN,
  })
}

function sectionHeading(slide, text, y = 0.55) {
  slide.addText(text, {
    x: 0.5, y, w: 12.33, h: 0.65,
    fontSize: 30, bold: true, color: WHITE,
    fontFace: FONT_MAIN,
  })
  // underline accent line
  slide.addShape(prs.ShapeType.rect, {
    x: 0.5, y: y + 0.65, w: 1.2, h: 0.055,
    fill: { color: ACCENT_LIGHT },
    line: { color: ACCENT_LIGHT },
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 – Title
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide1() {
  const slide = darkSlide(prs)

  // Purple gradient rectangle (top-half backdrop)
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 4.1,
    fill: { type: 'solid', color: '160d2b' },
    line: { color: '160d2b' },
  })

  // Decorative circle – top-right glow
  slide.addShape(prs.ShapeType.ellipse, {
    x: 9.8, y: -0.9, w: 3.5, h: 3.5,
    fill: { color: ACCENT, transparency: 72 },
    line: { color: ACCENT, transparency: 72 },
  })
  // Decorative circle – bottom-left glow
  slide.addShape(prs.ShapeType.ellipse, {
    x: -0.8, y: 4.2, w: 2.8, h: 2.8,
    fill: { color: ACCENT, transparency: 80 },
    line: { color: ACCENT, transparency: 80 },
  })

  addAccentBar(slide, 0)

  // Logo-style text
  slide.addText('FB', {
    x: 5.7, y: 0.52, w: 1.93, h: 0.7,
    align: 'center', fontSize: 28, bold: true,
    color: WHITE, fontFace: FONT_MAIN,
    fill: { color: ACCENT },
    line: { color: ACCENT_LIGHT },
    margin: [4, 8, 4, 8],
  })

  // Main title
  slide.addText('FaceBlend AI', {
    x: 0.6, y: 1.38, w: 12.1, h: 1.2,
    align: 'center', fontSize: 64, bold: true,
    color: WHITE, fontFace: FONT_MAIN,
    charSpacing: 2,
  })

  // Subtitle
  slide.addText('The Future of Visual Content Creation', {
    x: 0.6, y: 2.62, w: 12.1, h: 0.68,
    align: 'center', fontSize: 26,
    color: ACCENT_LIGHT, fontFace: FONT_MAIN,
  })

  // Divider
  slide.addShape(prs.ShapeType.rect, {
    x: 4.5, y: 3.44, w: 4.33, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT },
  })

  // Tagline
  slide.addText('Powered by Advanced AI  |  Built for Entertainment & Media', {
    x: 0.6, y: 3.62, w: 12.1, h: 0.5,
    align: 'center', fontSize: 14,
    color: GRAY_LIGHT, fontFace: FONT_MAIN, italic: true,
  })

  // Bottom band
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 4.28, w: '100%', h: 2.72,
    fill: { color: BG_DARK }, line: { color: BG_DARK },
  })

  // Stat pills at the bottom
  const stats = [
    { label: '500+', sub: 'Productions' },
    { label: '80%',  sub: 'Cost Reduction' },
    { label: '95%',  sub: 'Faster Output' },
    { label: '10x',  sub: 'More Iterations' },
  ]
  stats.forEach((s, i) => {
    const x = 0.9 + i * 3.2
    slide.addShape(prs.ShapeType.rect, {
      x, y: 4.62, w: 2.6, h: 1.6,
      fill: { color: BG_CARD2 },
      line: { color: ACCENT, pt: 1.5 },
    })
    slide.addText(s.label, {
      x, y: 4.72, w: 2.6, h: 0.82,
      align: 'center', fontSize: 36, bold: true,
      color: ACCENT_LIGHT, fontFace: FONT_MAIN,
    })
    slide.addText(s.sub, {
      x, y: 5.5, w: 2.6, h: 0.4,
      align: 'center', fontSize: 12,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 – The Challenge
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide2() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Traditional VFX Is Broken')

  slide.addText(
    'The entertainment industry spends billions on visual effects — yet teams still struggle\nwith skyrocketing costs, impossible timelines, and zero creative agility.',
    {
      x: 0.5, y: 1.5, w: 12.33, h: 0.9,
      fontSize: 14, color: GRAY_LIGHT, fontFace: FONT_MAIN,
      align: 'left',
    }
  )

  const pains = [
    {
      icon: '💸',
      title: '$50,000+ per minute',
      desc: 'Average cost of high-end VFX footage. A single scene can drain an entire indie budget overnight.',
    },
    {
      icon: '⏰',
      title: 'Weeks of post-production',
      desc: 'Even a simple face replacement requires rigging, rotoscoping, and endless render farm time.',
    },
    {
      icon: '🎭',
      title: 'Limited creative flexibility',
      desc: "Once principal photography wraps, re-shoots are prohibitively expensive. There's no room to experiment.",
    },
  ]

  pains.forEach((p, i) => {
    const x = 0.4 + i * 4.3
    // Card bg
    slide.addShape(prs.ShapeType.rect, {
      x, y: 2.6, w: 3.95, h: 3.45,
      fill: { color: BG_CARD2 },
      line: { color: ACCENT, pt: 1.5 },
    })
    // Icon
    slide.addText(p.icon, {
      x, y: 2.72, w: 3.95, h: 0.75,
      align: 'center', fontSize: 34, fontFace: FONT_MAIN,
    })
    // Title
    slide.addText(p.title, {
      x: x + 0.12, y: 3.5, w: 3.72, h: 0.6,
      align: 'center', fontSize: 17, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    // Desc
    slide.addText(p.desc, {
      x: x + 0.18, y: 4.18, w: 3.6, h: 1.6,
      align: 'center', fontSize: 12,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 – Our Solution
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide3() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Introducing FaceBlend AI')

  // Quote box
  slide.addShape(prs.ShapeType.rect, {
    x: 1.1, y: 1.55, w: 11.13, h: 1.25,
    fill: { color: '1e0d3b' },
    line: { color: ACCENT, pt: 2 },
  })
  slide.addShape(prs.ShapeType.rect, {
    x: 1.1, y: 1.55, w: 0.22, h: 1.25,
    fill: { color: ACCENT }, line: { color: ACCENT },
  })
  slide.addText('"AI-powered face synthesis in seconds, not weeks"', {
    x: 1.5, y: 1.68, w: 10.5, h: 0.95,
    align: 'center', fontSize: 22, bold: true, italic: true,
    color: ACCENT_LIGHT, fontFace: FONT_MAIN,
  })

  const diffs = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      desc: 'Process a full face-swap in under 10 seconds using our proprietary GPU pipeline — no waiting, no rendering queues.',
    },
    {
      icon: '🎯',
      title: 'Studio-Grade Quality',
      desc: 'Our AI preserves skin texture, lighting, and micro-expressions to deliver results indistinguishable from on-set work.',
    },
    {
      icon: '🔗',
      title: 'Seamless Integration',
      desc: 'Plug directly into your existing Adobe Premiere, DaVinci Resolve, or custom pipeline via our REST API.',
    },
  ]

  diffs.forEach((d, i) => {
    const x = 0.4 + i * 4.3
    slide.addShape(prs.ShapeType.rect, {
      x, y: 3.02, w: 3.95, h: 3.05,
      fill: { color: BG_CARD },
      line: { color: ACCENT_LIGHT, pt: 1 },
    })
    slide.addText(d.icon, {
      x, y: 3.12, w: 3.95, h: 0.65,
      align: 'center', fontSize: 30, fontFace: FONT_MAIN,
    })
    slide.addText(d.title, {
      x: x + 0.1, y: 3.82, w: 3.75, h: 0.5,
      align: 'center', fontSize: 16, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    slide.addText(d.desc, {
      x: x + 0.15, y: 4.38, w: 3.65, h: 1.5,
      align: 'center', fontSize: 11.5,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 – How It Works
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide4() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'How It Works')

  slide.addText('Three simple steps from idea to polished output', {
    x: 0.5, y: 1.38, w: 12.33, h: 0.42,
    fontSize: 14, color: GRAY_MID, fontFace: FONT_MAIN,
  })

  const steps = [
    {
      num: '01',
      title: 'Upload Source & Target',
      desc: 'Drag & drop your source face photo and target image — or point to cloud storage. We accept JPEG, PNG, TIFF, and RAW formats up to 48 MP.',
      icon: '📤',
    },
    {
      num: '02',
      title: 'AI Analyzes & Blends',
      desc: "Our neural engine maps 468 facial landmarks, adjusts lighting vectors, and seamlessly composites the face — all in a single forward pass.",
      icon: '🤖',
    },
    {
      num: '03',
      title: 'Download HD Result',
      desc: 'Receive a lossless 4K output in seconds. Export to any format, or push directly to your delivery pipeline via webhook.',
      icon: '⬇️',
    },
  ]

  steps.forEach((s, i) => {
    const x = 0.4 + i * 4.3

    // Step card
    slide.addShape(prs.ShapeType.rect, {
      x, y: 2.0, w: 3.95, h: 4.1,
      fill: { color: BG_CARD2 },
      line: { color: i === 1 ? ACCENT : '2e2e4e', pt: i === 1 ? 2 : 1 },
    })

    // Number badge
    slide.addShape(prs.ShapeType.ellipse, {
      x: x + 1.47, y: 2.1, w: 1.0, h: 1.0,
      fill: { color: ACCENT }, line: { color: ACCENT },
    })
    slide.addText(s.num, {
      x: x + 1.47, y: 2.12, w: 1.0, h: 1.0,
      align: 'center', fontSize: 22, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    // Icon
    slide.addText(s.icon, {
      x, y: 3.25, w: 3.95, h: 0.65,
      align: 'center', fontSize: 30, fontFace: FONT_MAIN,
    })

    // Title
    slide.addText(s.title, {
      x: x + 0.1, y: 3.98, w: 3.75, h: 0.55,
      align: 'center', fontSize: 16, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    // Desc
    slide.addText(s.desc, {
      x: x + 0.15, y: 4.6, w: 3.65, h: 1.38,
      align: 'center', fontSize: 11.5,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })

    // Arrow between cards
    if (i < 2) {
      slide.addText('→', {
        x: x + 4.0, y: 3.65, w: 0.28, h: 0.6,
        align: 'center', fontSize: 26, bold: true,
        color: ACCENT, fontFace: FONT_MAIN,
      })
    }
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 – Key Features
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide5() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Key Features')

  const features = [
    { icon: '⚡', title: 'Real-time Processing',     desc: 'Sub-10s inference on standard GPU hardware' },
    { icon: '🖼️', title: 'HD Output Quality',         desc: 'Up to 4K lossless export in all major formats' },
    { icon: '📦', title: 'Batch Processing',           desc: 'Queue hundreds of jobs via dashboard or API' },
    { icon: '🔌', title: 'REST API Access',            desc: 'Full-featured API with SDKs for JS, Python & Go' },
    { icon: '🔒', title: 'Privacy-First',              desc: 'On-premise deployment option — your data stays yours' },
    { icon: '👥', title: 'Multi-face Support',         desc: 'Swap multiple faces in a single image simultaneously' },
  ]

  // 3 × 2 grid
  const cols = 3
  const cardW = 3.95
  const cardH = 1.98
  const startX = 0.42
  const startY = 1.88

  features.forEach((f, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * (cardW + 0.22)
    const y = startY + row * (cardH + 0.22)

    slide.addShape(prs.ShapeType.rect, {
      x, y, w: cardW, h: cardH,
      fill: { color: BG_CARD },
      line: { color: '2a2a4a', pt: 1 },
    })

    // Left accent stripe
    slide.addShape(prs.ShapeType.rect, {
      x, y, w: 0.16, h: cardH,
      fill: { color: ACCENT }, line: { color: ACCENT },
    })

    slide.addText(f.icon, {
      x: x + 0.26, y: y + 0.28, w: 0.72, h: 0.72,
      fontSize: 26, fontFace: FONT_MAIN,
    })

    slide.addText(f.title, {
      x: x + 1.08, y: y + 0.22, w: 2.72, h: 0.55,
      fontSize: 14, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    slide.addText(f.desc, {
      x: x + 1.08, y: y + 0.82, w: 2.72, h: 0.88,
      fontSize: 11.5, color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 – Use Cases
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide6() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Use Cases')

  slide.addText('FaceBlend AI powers creative workflows across the entire entertainment spectrum', {
    x: 0.5, y: 1.38, w: 12.33, h: 0.42,
    fontSize: 13, color: GRAY_MID, fontFace: FONT_MAIN,
  })

  const cases = [
    {
      icon: '🎬',
      title: 'Film & TV Production',
      desc: 'Replace stunt doubles, de-age actors, or create digital doubles without costly re-shoots or lengthy VFX contracts.',
    },
    {
      icon: '🎮',
      title: 'Gaming & Esports',
      desc: 'Generate personalised player avatars at scale and embed real faces into cutscenes for immersive storytelling.',
    },
    {
      icon: '📱',
      title: 'Social Media & Influencers',
      desc: 'Create viral face-swap content, branded filters, and interactive AR effects in a fraction of the usual time.',
    },
    {
      icon: '📢',
      title: 'Advertising Campaigns',
      desc: 'Localise talent across global markets — swap faces to match regional demographics without reshooting.',
    },
    {
      icon: '👗',
      title: 'Virtual Try-On',
      desc: 'Let shoppers preview how they look in outfits, make-up, or hairstyles using a single selfie.',
    },
  ]

  cases.forEach((c, i) => {
    const y = 2.0 + i * 0.98
    slide.addShape(prs.ShapeType.rect, {
      x: 0.4, y, w: 12.53, h: 0.88,
      fill: { color: i % 2 === 0 ? BG_CARD : BG_CARD2 },
      line: { color: '2a2a4a', pt: 1 },
    })
    // Accent dot
    slide.addShape(prs.ShapeType.ellipse, {
      x: 0.62, y: y + 0.26, w: 0.36, h: 0.36,
      fill: { color: ACCENT }, line: { color: ACCENT },
    })
    // Icon
    slide.addText(c.icon, {
      x: 1.1, y: y + 0.12, w: 0.62, h: 0.62,
      fontSize: 22, fontFace: FONT_MAIN,
    })
    // Title
    slide.addText(c.title, {
      x: 1.82, y: y + 0.1, w: 2.6, h: 0.68,
      fontSize: 14, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
      valign: 'middle',
    })
    // Desc
    slide.addText(c.desc, {
      x: 4.62, y: y + 0.1, w: 8.15, h: 0.68,
      fontSize: 12, color: GRAY_LIGHT, fontFace: FONT_MAIN,
      valign: 'middle',
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 – Results & ROI
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide7() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Results & ROI')

  slide.addText('Real outcomes from productions that switched to FaceBlend AI', {
    x: 0.5, y: 1.38, w: 12.33, h: 0.42,
    fontSize: 13, color: GRAY_MID, fontFace: FONT_MAIN,
  })

  const metrics = [
    { value: '80%',  label: 'Cost Reduction',          sub: 'vs. traditional VFX workflows',        color: ACCENT_LIGHT },
    { value: '95%',  label: 'Faster Turnaround',        sub: 'from brief to final delivery',          color: '22c55e'     },
    { value: '10x',  label: 'More Creative Iterations', sub: 'per production timeline',               color: 'f59e0b'     },
    { value: '500+', label: 'Productions Served',       sub: 'across film, TV, gaming & advertising', color: '38bdf8'     },
  ]

  metrics.forEach((m, i) => {
    const x = 0.4 + i * 3.22

    slide.addShape(prs.ShapeType.rect, {
      x, y: 1.98, w: 2.98, h: 4.08,
      fill: { color: BG_CARD },
      line: { color: m.color, pt: 2 },
    })

    // Top color band
    slide.addShape(prs.ShapeType.rect, {
      x, y: 1.98, w: 2.98, h: 0.22,
      fill: { color: m.color }, line: { color: m.color },
    })

    // Big value
    slide.addText(m.value, {
      x: x + 0.08, y: 2.42, w: 2.82, h: 1.48,
      align: 'center', fontSize: 58, bold: true,
      color: m.color, fontFace: FONT_MAIN,
    })

    slide.addShape(prs.ShapeType.rect, {
      x: x + 0.5, y: 3.98, w: 1.98, h: 0.04,
      fill: { color: m.color }, line: { color: m.color },
    })

    slide.addText(m.label, {
      x: x + 0.08, y: 4.12, w: 2.82, h: 0.58,
      align: 'center', fontSize: 14, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    slide.addText(m.sub, {
      x: x + 0.08, y: 4.72, w: 2.82, h: 0.88,
      align: 'center', fontSize: 11,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 – Technical Architecture
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide8() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Technical Architecture')

  // Architecture flow
  const nodes = [
    { label: 'React\nFrontend',  x: 0.5,  color: '0ea5e9' },
    { label: 'Node.js\nAPI',     x: 3.38, color: '22c55e' },
    { label: 'AI Engine\n(PyTorch)', x: 6.26, color: ACCENT_LIGHT },
    { label: 'Result\nStorage',  x: 9.14, color: 'f59e0b' },
  ]

  nodes.forEach((n, i) => {
    slide.addShape(prs.ShapeType.rect, {
      x: n.x, y: 1.72, w: 2.62, h: 1.48,
      fill: { color: BG_CARD },
      line: { color: n.color, pt: 2 },
    })
    slide.addShape(prs.ShapeType.rect, {
      x: n.x, y: 1.72, w: 2.62, h: 0.18,
      fill: { color: n.color }, line: { color: n.color },
    })
    slide.addText(n.label, {
      x: n.x, y: 1.96, w: 2.62, h: 1.0,
      align: 'center', fontSize: 15, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    if (i < 3) {
      slide.addText('→', {
        x: n.x + 2.66, y: 2.2, w: 0.68, h: 0.65,
        align: 'center', fontSize: 28, bold: true,
        color: ACCENT, fontFace: FONT_MAIN,
      })
    }
  })

  // Tech stack section
  slide.addText('Technology Stack', {
    x: 0.5, y: 3.52, w: 12.33, h: 0.5,
    fontSize: 18, bold: true, color: WHITE, fontFace: FONT_MAIN,
  })

  const techCols = [
    {
      heading: 'Frontend',
      items: ['React 18 + TypeScript', 'TailwindCSS', 'WebSockets (live preview)', 'Vite build toolchain'],
    },
    {
      heading: 'Backend',
      items: ['Node.js 20 + Express', 'Bull queue (Redis)', 'JWT authentication', 'S3-compatible storage'],
    },
    {
      heading: 'AI / ML',
      items: ['PyTorch 2.x', 'ONNX Runtime', 'Custom GAN architecture', 'CUDA 12 acceleration'],
    },
    {
      heading: 'Infrastructure',
      items: ['Docker + Kubernetes', 'AWS / on-premise', 'Prometheus + Grafana', 'SOC-2 Type II compliant'],
    },
  ]

  techCols.forEach((col, i) => {
    const x = 0.4 + i * 3.22
    slide.addShape(prs.ShapeType.rect, {
      x, y: 4.12, w: 2.98, h: 2.5,
      fill: { color: BG_CARD2 },
      line: { color: '2a2a4a', pt: 1 },
    })
    slide.addText(col.heading, {
      x: x + 0.12, y: 4.18, w: 2.75, h: 0.44,
      fontSize: 13, bold: true, color: ACCENT_LIGHT, fontFace: FONT_MAIN,
    })
    col.items.forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: x + 0.18, y: 4.66 + j * 0.44, w: 2.65, h: 0.4,
        fontSize: 11, color: GRAY_LIGHT, fontFace: FONT_MAIN,
      })
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 – Pricing
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide9() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Pricing')

  slide.addText('Transparent, scalable plans for every stage of your production', {
    x: 0.5, y: 1.38, w: 12.33, h: 0.42,
    fontSize: 13, color: GRAY_MID, fontFace: FONT_MAIN,
  })

  const plans = [
    {
      name: 'Starter',
      price: '€499',
      period: '/month',
      color: '0ea5e9',
      badge: '',
      features: [
        '200 face-swaps / mo',
        'HD output (up to 2K)',
        'REST API (100 req/day)',
        'Email support',
        'Cloud storage only',
        '—',
      ],
    },
    {
      name: 'Professional',
      price: '€1,999',
      period: '/month',
      color: ACCENT_LIGHT,
      badge: 'MOST POPULAR',
      features: [
        '2,000 face-swaps / mo',
        '4K lossless output',
        'REST API (unlimited)',
        'Priority support (4h SLA)',
        'Batch processing',
        'Webhook delivery',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      color: 'f59e0b',
      badge: '',
      features: [
        'Unlimited face-swaps',
        '8K + RAW output',
        'Dedicated infrastructure',
        '24/7 dedicated support',
        'On-premise deployment',
        'Custom AI fine-tuning',
      ],
    },
  ]

  plans.forEach((p, i) => {
    const x = 0.42 + i * 4.28
    const isMiddle = i === 1

    // Card
    slide.addShape(prs.ShapeType.rect, {
      x, y: 1.82, w: 3.98, h: 5.05,
      fill: { color: isMiddle ? '1a0a2e' : BG_CARD },
      line: { color: p.color, pt: isMiddle ? 2.5 : 1.5 },
    })

    // Top accent
    slide.addShape(prs.ShapeType.rect, {
      x, y: 1.82, w: 3.98, h: 0.28,
      fill: { color: p.color }, line: { color: p.color },
    })

    // Badge
    if (p.badge) {
      slide.addShape(prs.ShapeType.rect, {
        x: x + 0.88, y: 1.55, w: 2.22, h: 0.34,
        fill: { color: p.color }, line: { color: p.color },
      })
      slide.addText(p.badge, {
        x: x + 0.88, y: 1.55, w: 2.22, h: 0.34,
        align: 'center', fontSize: 9, bold: true,
        color: BG_DARK, fontFace: FONT_MAIN,
      })
    }

    // Plan name
    slide.addText(p.name, {
      x: x + 0.1, y: 2.22, w: 3.78, h: 0.5,
      align: 'center', fontSize: 18, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    // Price
    slide.addText(p.price, {
      x: x + 0.1, y: 2.72, w: 3.78, h: 0.88,
      align: 'center', fontSize: 38, bold: true,
      color: p.color, fontFace: FONT_MAIN,
    })
    slide.addText(p.period, {
      x: x + 0.1, y: 3.52, w: 3.78, h: 0.35,
      align: 'center', fontSize: 12,
      color: GRAY_MID, fontFace: FONT_MAIN,
    })

    slide.addShape(prs.ShapeType.rect, {
      x: x + 0.5, y: 3.92, w: 2.98, h: 0.04,
      fill: { color: p.color }, line: { color: p.color },
    })

    // Features
    p.features.forEach((f, j) => {
      const isDisabled = f === '—'
      slide.addText(isDisabled ? '—' : `✓  ${f}`, {
        x: x + 0.22, y: 4.08 + j * 0.38, w: 3.55, h: 0.36,
        fontSize: 11,
        color: isDisabled ? '444466' : (isMiddle ? GRAY_LIGHT : GRAY_LIGHT),
        fontFace: FONT_MAIN,
      })
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 – Client Testimonials
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide10() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Client Testimonials')

  const quotes = [
    {
      text: '"FaceBlend AI fundamentally changed how we approach post-production. What used to take our VFX team three weeks now takes an afternoon. We cut our post-production budget by 70% on our last feature film — and the quality is indistinguishable from anything we produced the traditional way."',
      name: 'Sophie Marchand',
      title: 'Head of Post-Production, Lumière Studios (Paris)',
      initials: 'SM',
      color: ACCENT_LIGHT,
    },
    {
      text: '"We integrated FaceBlend into our game cinematic pipeline six months ago and haven\'t looked back. The REST API is rock-solid, batch processing handles our scale effortlessly, and the on-premise option meant our legal team had zero concerns about IP security. It\'s become mission-critical infrastructure for us."',
      name: 'Marcus Heller',
      title: 'VP of Content Technology, Nexon Interactive (Berlin)',
      initials: 'MH',
      color: '22c55e',
    },
  ]

  quotes.forEach((q, i) => {
    const y = 1.88 + i * 2.52
    slide.addShape(prs.ShapeType.rect, {
      x: 0.4, y, w: 12.53, h: 2.28,
      fill: { color: BG_CARD2 },
      line: { color: q.color, pt: 1.5 },
    })

    // Quote mark
    slide.addText('\u201C', {
      x: 0.52, y: y + 0.06, w: 0.82, h: 0.88,
      fontSize: 52, bold: true,
      color: q.color, fontFace: FONT_MAIN,
    })

    // Quote text
    slide.addText(q.text, {
      x: 1.42, y: y + 0.18, w: 10.88, h: 1.18,
      fontSize: 12.5, italic: true,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })

    // Avatar circle
    slide.addShape(prs.ShapeType.ellipse, {
      x: 0.62, y: y + 1.52, w: 0.62, h: 0.62,
      fill: { color: q.color }, line: { color: q.color },
    })
    slide.addText(q.initials, {
      x: 0.62, y: y + 1.52, w: 0.62, h: 0.62,
      align: 'center', fontSize: 13, bold: true,
      color: BG_DARK, fontFace: FONT_MAIN,
    })

    // Name + title
    slide.addText(q.name, {
      x: 1.42, y: y + 1.5, w: 6, h: 0.35,
      fontSize: 13, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    slide.addText(q.title, {
      x: 1.42, y: y + 1.85, w: 10, h: 0.32,
      fontSize: 11, color: q.color, fontFace: FONT_MAIN,
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 – Roadmap
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide11() {
  const slide = darkSlide(prs)
  addAccentBar(slide)

  sectionHeading(slide, 'Product Roadmap  —  2026')

  // Timeline line
  slide.addShape(prs.ShapeType.rect, {
    x: 0.78, y: 3.72, w: 11.77, h: 0.08,
    fill: { color: ACCENT }, line: { color: ACCENT },
  })

  const milestones = [
    {
      quarter: 'Q1 2026',
      title: 'Launch v1.0',
      items: ['Public API release', 'Dashboard v1', 'Starter & Pro plans live', 'Adobe Premiere plug-in'],
      color: ACCENT_LIGHT,
      x: 0.42,
      status: 'CURRENT',
    },
    {
      quarter: 'Q2 2026',
      title: 'Mobile App',
      items: ['iOS & Android apps', 'On-device inference', 'AR camera filters', 'Social sharing'],
      color: '22c55e',
      x: 3.3,
      status: '',
    },
    {
      quarter: 'Q3 2026',
      title: 'Real-time Video',
      items: ['Live stream face-swap', '<50ms latency target', 'OBS & vMix integration', 'Broadcast SDK'],
      color: 'f59e0b',
      x: 6.18,
      status: '',
    },
    {
      quarter: 'Q4 2026',
      title: 'Multi-language AI',
      items: ['Lip-sync dubbing', '40 language support', 'Voice cloning option', 'Automated localisation'],
      color: '38bdf8',
      x: 9.06,
      status: '',
    },
  ]

  milestones.forEach((m, i) => {
    // Dot on timeline
    slide.addShape(prs.ShapeType.ellipse, {
      x: m.x + 1.18, y: 3.56, w: 0.38, h: 0.38,
      fill: { color: m.color }, line: { color: m.color },
    })

    // Card below the timeline
    slide.addShape(prs.ShapeType.rect, {
      x: m.x, y: 4.08, w: 2.72, h: 2.7,
      fill: { color: BG_CARD2 },
      line: { color: m.color, pt: 1.5 },
    })

    slide.addShape(prs.ShapeType.rect, {
      x: m.x, y: 4.08, w: 2.72, h: 0.2,
      fill: { color: m.color }, line: { color: m.color },
    })

    // Quarter label above timeline
    slide.addText(m.quarter, {
      x: m.x, y: 3.12, w: 2.72, h: 0.38,
      align: 'center', fontSize: 13, bold: true,
      color: m.color, fontFace: FONT_MAIN,
    })

    // Status badge
    if (m.status) {
      slide.addShape(prs.ShapeType.rect, {
        x: m.x + 0.32, y: 3.12, w: 1.5, h: 0.3,
        fill: { color: m.color }, line: { color: m.color },
      })
      slide.addText(m.status, {
        x: m.x + 0.32, y: 3.12, w: 1.5, h: 0.3,
        align: 'center', fontSize: 8, bold: true,
        color: BG_DARK, fontFace: FONT_MAIN,
      })
    }

    // Title
    slide.addText(m.title, {
      x: m.x + 0.1, y: 4.32, w: 2.52, h: 0.48,
      align: 'center', fontSize: 14, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })

    // Items
    m.items.forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: m.x + 0.14, y: 4.86 + j * 0.44, w: 2.45, h: 0.4,
        fontSize: 10.5, color: GRAY_LIGHT, fontFace: FONT_MAIN,
      })
    })
  })

  addFooter(slide)
})()

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 – Next Steps / CTA
// ═══════════════════════════════════════════════════════════════════════════════
;(function slide12() {
  const slide = darkSlide(prs)

  // Full purple gradient backdrop
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: '0d0520' }, line: { color: '0d0520' },
  })

  // Decorative circles
  slide.addShape(prs.ShapeType.ellipse, {
    x: -1.2, y: -1.2, w: 5, h: 5,
    fill: { color: ACCENT, transparency: 78 }, line: { color: ACCENT, transparency: 78 },
  })
  slide.addShape(prs.ShapeType.ellipse, {
    x: 9.5, y: 4.2, w: 4.5, h: 4.5,
    fill: { color: ACCENT, transparency: 82 }, line: { color: ACCENT, transparency: 82 },
  })

  addAccentBar(slide, 0)

  // Main heading
  slide.addText("Let's Build Together", {
    x: 0.5, y: 0.55, w: 12.33, h: 1.12,
    align: 'center', fontSize: 52, bold: true,
    color: WHITE, fontFace: FONT_MAIN,
  })
  slide.addText('Your next production deserves the speed and quality of AI.', {
    x: 0.5, y: 1.65, w: 12.33, h: 0.5,
    align: 'center', fontSize: 16, italic: true,
    color: ACCENT_LIGHT, fontFace: FONT_MAIN,
  })

  // 3 Action cards
  const actions = [
    {
      num: '01',
      title: 'Book a Live Demo',
      desc: "See FaceBlend AI in action on your own footage. We'll walk you through the full workflow in 30 minutes.",
      cta: 'Schedule at calendly.com/faceblend',
    },
    {
      num: '02',
      title: 'Start a Free Trial',
      desc: '50 free face-swaps, no credit card required. Experience the quality before committing to a plan.',
      cta: 'Sign up at app.faceblend.ai',
    },
    {
      num: '03',
      title: 'Talk to Sales',
      desc: 'Need a custom contract, on-premise deployment, or volume pricing? Our team is ready to help.',
      cta: 'Email contact@faceblend.ai',
    },
  ]

  actions.forEach((a, i) => {
    const x = 0.42 + i * 4.28
    slide.addShape(prs.ShapeType.rect, {
      x, y: 2.35, w: 3.98, h: 3.35,
      fill: { color: BG_CARD },
      line: { color: ACCENT, pt: 1.5 },
    })
    // Number badge
    slide.addShape(prs.ShapeType.ellipse, {
      x: x + 1.49, y: 2.42, w: 0.98, h: 0.98,
      fill: { color: ACCENT }, line: { color: ACCENT },
    })
    slide.addText(a.num, {
      x: x + 1.49, y: 2.44, w: 0.98, h: 0.98,
      align: 'center', fontSize: 20, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    slide.addText(a.title, {
      x: x + 0.12, y: 3.52, w: 3.74, h: 0.52,
      align: 'center', fontSize: 15, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    })
    slide.addText(a.desc, {
      x: x + 0.18, y: 4.1, w: 3.62, h: 1.0,
      align: 'center', fontSize: 11,
      color: GRAY_LIGHT, fontFace: FONT_MAIN,
    })
    slide.addText(a.cta, {
      x: x + 0.12, y: 5.16, w: 3.74, h: 0.38,
      align: 'center', fontSize: 10.5, italic: true,
      color: ACCENT_LIGHT, fontFace: FONT_MAIN,
    })
  })

  // Contact bar
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 5.88, w: '100%', h: 1.12,
    fill: { color: ACCENT }, line: { color: ACCENT },
  })
  slide.addText(
    '📧  contact@faceblend.ai     |     📞  +33 1 23 45 67 89     |     🌐  www.faceblend.ai',
    {
      x: 0, y: 5.92, w: '100%', h: 1.0,
      align: 'center', fontSize: 15, bold: true,
      color: WHITE, fontFace: FONT_MAIN,
    }
  )
})()

// ─── Write file ───────────────────────────────────────────────────────────────
prs.writeFile({ fileName: '/home/user/faceblend/docs/FaceBlend_Presentation.pptx' })
  .then(() => console.log('✅  Presentation saved to /home/user/faceblend/docs/FaceBlend_Presentation.pptx'))
  .catch(err => { console.error('❌  Failed to write presentation:', err); process.exit(1) })
