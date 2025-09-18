import { motion, useMotionValue, useTransform } from "framer-motion";
import { HashRouter as Router, Routes, Route, NavLink, useParams, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// --- Palette ---
const PALETTE = {
  night: "#0A192F", // Bleu Nuit
  cyan: "#00B4D8",  // Bleu Cyan
  light: "#E5E5E5", // Gris clair
  white: "#FFFFFF", // Blanc
  violet: "#7B2CBF", // Accent Violet
};

// --- Icônes SVG ---
const IconMoon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const IconSun = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
);
const IconBolt = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
);

// --- Données projets (exemples) ---
const projects = [
  {
    id: "irf-hpe-5140",
    title: "Stack IRF HPE 5140 + Intégration HP IMC",
    subtitle: "Réseaux — VLAN, Routage inter-VLAN, SNMP, Syslog, NTP",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518773731057-2ecb0c79a0d8?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580906855286-1e6f9240aeea?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["HPE 5140", "IRF", "SNMP", "Syslog", "NTP", "VLAN"],
    body: `Mise en place d'une stack IRF sur deux commutateurs HPE 5140 (agrégations 10G X240), configuration des VLANs (prod/admin/voix), routage inter-VLAN, supervision via HP IMC (SNMPv2c), journaux centralisés (Syslog), synchronisation NTP, sécurisation SSH et durcissement de la console.`,
    results: [
      "Résilience accrue (bascule < 1s)",
      "Supervision centralisée via HP IMC",
      "Plan d'adressage standardisé",
    ],
    doc: "/docs/irf-hpe-5140.pdf",
  },
  {
    id: "brockerinfo-infra",
    title: "BROCKER'INFO — Mise en place d'une infrastructure réseau",
    subtitle: "VLAN, VTP, Trunks, Router-on-a-Stick, TFTP, NAT",
    cover: "https://images.unsplash.com/photo-1587202372775-98927b445aae?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Cisco", "VLAN", "VTP", "Trunk", "Router-on-a-Stick", "TFTP", "NAT"],
    body: `Conception et configuration d'une infra pour BROCKER'INFO : segmentation par VLANs (ACHAT, INFORMATIQUE, COMPTA, RÉPARATION, HOTLINE), VTP, trunks, router-on-a-stick, adressage 192.168.5.0/24, serveur TFTP et sauvegardes; bonus NAT pour l'accès Internet.`,
    results: [
      "Flux segmentés par service",
      "Routage inter-VLAN opérationnel",
      "Sauvegardes TFTP et maquette Packet Tracer",
    ],
    doc: "/docs/brockerinfo-infra.pdf",
  },
  {
    id: "poste-a-poste-win10",
    title: "Réseau poste à poste — Windows 10 (TP1 Support)",
    subtitle: "Comptes, Groupes, NTFS, Partages, Schéma réseau",
    cover: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518085250887-2f903c200fee?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Windows 10", "NTFS", "Groupes", "Partages", "Sécurité"],
    body: `Infrastructure poste à poste sur 2 VM Windows 10 sans serveur : création d'utilisateurs & groupes locaux, durcissement de l'écran de connexion, permissions NTFS, partages réseau, tests multi-postes.`,
    results: [
      "Contrôle d'accès fin via NTFS",
      "Partages fonctionnels",
      "Schéma réseau validé",
    ],
    doc: "/docs/poste-a-poste.pdf",
  },
  {
    id: "ap-maintenance-base",
    title: "AP — Maintenance de base (IT Partner)",
    subtitle: "Gestionnaires de MDP + Clé multi-boot YUMI",
    cover: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1580906855286-1e6f9240aeea?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["MFA", "Password Manager", "YUMI", "Antivirus Live", "Clonage"],
    body: `Comparatif de 3 gestionnaires de mots de passe (critères/notation), tutoriels d'installation/utilisation pour le logiciel retenu + préparation d'une clé USB YUMI avec outils (memtest, Debian live, antivirus boot, Win11, partitionnement, clonage) et procédures d'usage.`,
    results: [
      "Livrables : comparatif + diaporama",
      "Clé multi-boot opérationnelle",
      "Tutoriels détaillés (YUMI & outils)",
    ],
    doc: "/docs/ap-maintenance.pdf",
  },
  {
    id: "ap-appel-offres-lal",
    title: "AP — Appel d'offres (Lycée Albert Londres)",
    subtitle: "Devis matériel, conformité, virtualisation, budget",
    cover: "https://images.unsplash.com/photo-1518773731057-2ecb0c79a0d8?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Appel d'offres", "Devis", "Virtualisation", "Budget"],
    body: `Réponse à un appel d'offres pour équiper les salles BTS SIO : conformité au cahier des charges, configuration orientée virtualisation, devis détaillé avec références/URLs, planification et critères prix/qualité.`,
    results: [
      "Proposition technique & financière",
      "Sélection de matériel pertinent",
      "Dossier de réponse structuré",
    ],
    doc: "/docs/appel-offres.pdf",
  },
  {
    id: "ap-cablage-salle-a211",
    title: "AP — Câblage salle A-211 (ITPartner)",
    subtitle: "Plan d'aménagement, devis Abix, schéma Visio",
    cover: "https://images.unsplash.com/photo-1563201189-3c6e9a6d7a07?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587202372775-98927b445aae?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Câblage", "RJ45", "Goulottes", "Abix", "Visio"],
    body: `Étude de l'existant et plan d'aménagement pour 15 postes + imprimante : câblage 1 Gb/s, pas de Wi-Fi, pas de multiprises; devis Abix chiffré, justifications techniques, calculs de longueurs, plans et schémas Visio.`,
    results: [
      "Plan & schémas validés",
      "Budget détaillé",
      "Salle opérationnelle S1 2025",
    ],
    doc: "/docs/cablage-a211.pdf",
  },
  {
    id: "windows-server-ad",
    title: "Lab Windows Server – AD DS / DHCP / GPO",
    subtitle: "Systèmes — Domaine, OU, stratégies, services",
    cover: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["Windows Server", "AD DS", "DHCP", "DNS", "GPO"],
    body: `Déploiement d'un domaine Active Directory, configuration de DHCP/DNS, création d'OU et GPO (hardening, déploiement d'imprimantes), gestion des rôles et sauvegardes.`,
    results: [
      "Annuaire fonctionnel et sécurisé",
      "Automatisation via GPO",
      "Base solide pour TP SISR",
    ],
    doc: "/docs/windows-server-ad.pdf",
  },
];

// --- Hook scroll top ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  return null;
}

// --- Composants décoratifs & micro-interactions ---
function MagneticButton({ children, className, style, ...props }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useTransform(y, [-20, 20], [8, -8]);
  const rotateY = useTransform(x, [-20, 20], [-8, 8]);
  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width/2) / 6);
        y.set((e.clientY - rect.top  - rect.height/2) / 6);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, ...style }}
      className={`px-6 py-3 rounded-full font-semibold transition ${className || ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function GlassCard({ children, className, style }) {
  return (
    <div
      className={`rounded-2xl ${className || ""}`}
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Timeline({ items }) {
  return (
    <ol className="relative border-s border-white/15 ms-4">
      {items.map((it,i)=> (
        <li key={i} className="mb-8 ms-6">
          <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full"
                style={{background: PALETTE.night, border:`1px solid ${PALETTE.cyan}`}}>
            <span className="h-2.5 w-2.5 rounded-full" style={{background: PALETTE.cyan}}/>
          </span>
          <h4 className="font-semibold" style={{color: PALETTE.cyan}}>{it.title}</h4>
          <p className="text-sm opacity-75">{it.date}</p>
          <p className="mt-1 opacity-90">{it.desc}</p>
        </li>
      ))}
    </ol>
  );
}

function SkillBar({ label, lvl }) { // lvl 0..100
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm opacity-80"><span>{label}</span><span>{lvl}%</span></div>
      <div className="h-2 rounded-full" style={{background:"rgba(255,255,255,.12)"}}>
        <div className="h-2 rounded-full" style={{width:`${lvl}%`, background: PALETTE.cyan}} />
      </div>
    </div>
  );
}

// --- Layout global ---
function Layout({ children, theme, setTheme }) {
  const isDark = theme === "dark";
  const colors = useMemo(() => ({
    bg: isDark ? PALETTE.night : "#F7FAFC",
    text: isDark ? PALETTE.white : "#0A0A0A",
    card: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
    border: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb",
  }), [isDark]);

  return (
    <div className="min-h-screen" style={{ background: colors.bg, color: colors.text }}>
      <header className="fixed top-0 w-full z-50" style={{ background: isDark ? "#0A192Feb" : "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${colors.border}` }}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-xl font-extrabold" style={{ color: PALETTE.cyan }}>
            Yanis Bonnet Gomez
          </NavLink>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {[
              ["/about", "À propos"],
              ["/skills", "Compétences"],
              ["/projects", "Projets"],
              ["/gallery", "Galerie"],
              ["/blog", "Blog"],
              ["/assets", "Docs"],
              ["/resume", "CV"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} className={({isActive}) => `${isActive ? "underline" : ""} hover:opacity-100 opacity-90`} style={{ color: PALETTE.white }}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button aria-label="Basculer le thème" onClick={() => setTheme(isDark ? "light" : "dark")} className="rounded-full p-2" style={{ border: `1px solid ${colors.border}` }}>
            {isDark ? <IconSun/> : <IconMoon/>}
          </button>
        </nav>
      </header>
      <main className="pt-20">{children}</main>
      <footer className="mt-20" style={{ borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <p className="opacity-80">© 2025 Yanis Bonnet Gomez — Portfolio BTS SIO SISR</p>
          <div className="flex gap-6 opacity-90">
            <NavLink to="/legal" className="hover:opacity-100">Mentions légales</NavLink>
            <NavLink to="/privacy" className="hover:opacity-100">Confidentialité</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Pages ---
function Home({ theme }) {
  return (
    <section className="relative overflow-hidden">
      {/* Halo dynamique */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 inset-0"
        initial={{ opacity:.35 }}
        animate={{ opacity:[.35,.55,.35], scale:[1,1.06,1] }}
        transition={{ duration:10, repeat:Infinity }}
        style={{ 
          background: `
            radial-gradient(650px 350px at 20% 30%, ${PALETTE.cyan}55, transparent),
            radial-gradient(500px 250px at 80% 50%, ${PALETTE.violet}44, transparent)
          `
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-24 grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="text-4xl md:text-6xl font-extrabold leading-tight" style={{textShadow:"0 0 22px rgba(0,180,216,.35)"}}>
            Étudiant <span style={{color: PALETTE.cyan}}>BTS SIO SISR</span><br/>
            poète des <span style={{color: PALETTE.night, background: PALETTE.white, padding: "0 .3rem", borderRadius: ".4rem"}}>réseaux</span> & des <span style={{color: PALETTE.violet}}>systèmes</span>
          </motion.h1>
          <p className="mt-6 text-lg opacity-90 max-w-xl">
            Passionné par les réseaux et la cybersécurité, je conçois des infrastructures qui allient performance et élégance : VLANs bien structurés, GPO sécurisantes, topologies optimisées. J’aime bâtir des environnements où la technique inspire confiance et où chaque service tourne avec fluidité et solidité.
          </p>
          <div className="mt-8 flex gap-4">
            <MagneticButton style={{background:PALETTE.cyan, color:PALETTE.night}}>Voir mes projets</MagneticButton>
            <MagneticButton style={{border:`1px solid ${PALETTE.cyan}`}}>Télécharger mon CV</MagneticButton>
          </div>
        </div>
        {/* Mosaïque d’images */}
        <div className="grid grid-cols-3 gap-4">
          <img alt="rack" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop"/>
          <img alt="cli" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"/>
          <img alt="server" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1200&auto=format&fit=crop"/>
          <img alt="diagram" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"/>
          <img alt="fiber" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?q=80&w=1200&auto=format&fit=crop"/>
          <img alt="switch" className="rounded-2xl object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1587202372775-98927b445aae?q=80&w=1200&auto=format&fit=crop"/>
        </div>
      </div>

      {/* bandeau stats/skills rapides */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Cisco", "HPE IRF", "Windows Server", "Linux"].map((k, i) => (
          <GlassCard key={i} className="p-4 text-center">
            <p className="text-sm opacity-70">Compétence</p>
            <p className="text-lg font-semibold" style={{color: PALETTE.cyan}}>{k}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function About() {
  const items = [
    { title:"BTS SIO SISR — 2ᵉ année", date:"2025", desc:"Projets réseaux/systèmes, livrables pro, veille techno." },
    { title:"Stage — Vichy Communauté (DMSI)", date:"2025", desc:"Stacks IRF HPE 5130/5140, HP IMC, supervision, durcissement." },
    { title:"Bac STI2D", date:"2023", desc:"Base solide en techno et logique d’ingénierie." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color: PALETTE.cyan}}>À propos</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <p className="leading-relaxed opacity-90">
            Je suis Yanis, en 2ᵉ année de BTS SIO option SISR. Né le 14 juillet 2006 à Cusset (03), j’ai fait toute ma scolarité au Lycée Albert Londres. Après un bac STI2D, je me spécialise en infrastructures réseaux & systèmes, avec une approche orientée documentation claire, topologies lisibles et configurations robustes.

Documentation claire, topologies lisibles et configs robustes : mon trio gagnant.
          </p>
          <div className="mt-8">
            <Timeline items={items}/>
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold" style={{color: PALETTE.cyan}}>Ma formation BTS SIO</h3>
            <p className="mt-2 opacity-90">Au Lycée Albert Londres (Cusset), le BTS SIO propose deux parcours :</p>
            <ul className="mt-2 opacity-90 list-disc ms-6">
              <li><strong>SLAM</strong> — développement d’applications, bases de données, gestion de projets.</li>
              <li><strong>SISR</strong> — administration des systèmes, gestion des réseaux, maintenance des infrastructures (mon option).</li>
            </ul>
          </div>
        </div>
        <div>
          <img className="rounded-2xl object-cover w-full aspect-[4/5]" src="/cv.avif" alt="portrait"/>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-10" style={{color: PALETTE.cyan}}>Compétences</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4" style={{color: PALETTE.cyan}}>Réseaux</h3>
          <div className="space-y-4">
            <SkillBar label="Cisco (VLAN, OSPF, ACL)" lvl={85} />
            <SkillBar label="HPE IRF / Comware" lvl={80} />
            <SkillBar label="NAT / DHCP / DNS" lvl={75} />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4" style={{color: PALETTE.cyan}}>Systèmes</h3>
          <div className="space-y-4">
            <SkillBar label="Windows Server (AD DS, GPO)" lvl={82} />
            <SkillBar label="Linux (Ubuntu/Debian)" lvl={70} />
            <SkillBar label="Powershell / Bash" lvl={68} />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4" style={{color: PALETTE.cyan}}>Dév & Outils</h3>
          <div className="space-y-4">
            <SkillBar label="HTML / CSS / JS" lvl={78} />
            <SkillBar label="Python / SQL" lvl={65} />
            <SkillBar label="Git / Markdown / ITIL" lvl={72} />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function Projects() {
  const [q, setQ] = useState("");
  const shown = projects.filter(p => p.tags.join(" ").toLowerCase().includes(q.toLowerCase()) || p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color: PALETTE.cyan}}>Projets & Missions</h2>
      <div className="mb-6 flex items-center gap-3">
        <input className="px-3 py-2 rounded-lg bg-transparent" style={{border:`1px solid rgba(255,255,255,.15)`}} placeholder="Filtrer (ex: VLAN, HPE, GPO…)" value={q} onChange={e=>setQ(e.target.value)} />
        <span className="text-sm opacity-70">{shown.length} projet(s)</span>
      </div>
      {/* Masonry */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {shown.map((p) => (
          <NavLink key={p.id} to={`/projects/${p.id}`} className="group mb-4 block rounded-2xl overflow-hidden" style={{border: `1px solid rgba(255,255,255,.12)`, background: "rgba(255,255,255,.03)"}}>
            <div className="overflow-hidden">
              <img src={p.cover} alt={p.title} className="w-full object-cover group-hover:scale-105 transition" style={{aspectRatio:"16/10"}}/>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold" style={{color: PALETTE.cyan}}>{p.title}</h3>
              <p className="text-sm opacity-80 mt-1">{p.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.slice(0,4).map((t,i)=> (
                  <span key={i} className="text-xs px-2 py-1 rounded-full" style={{border: `1px solid rgba(255,255,255,.12)`, color: PALETTE.violet}}>{t}</span>
                ))}
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  if (!project) return (
    <section className="max-w-5xl mx-auto px-6 py-16"><p>Projet introuvable.</p></section>
  );
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <img src={project.cover} alt={project.title} className="rounded-2xl w-full object-cover"/>
          <div className="grid sm:grid-cols-4 gap-4 mt-4">
            {project.gallery.map((g, i) => (
              <img key={i} src={g} alt={`${project.title} ${i}`} className="rounded-xl object-cover aspect-[4/3] w-full"/>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold" style={{color: PALETTE.cyan}}>{project.title}</h1>
          <p className="opacity-80 mt-2">{project.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t,i)=> <span key={i} className="text-xs px-2 py-1 rounded-full" style={{border: `1px solid rgba(255,255,255,0.12)`, color: PALETTE.violet}}>{t}</span>)}
          </div>
          <p className="mt-6 leading-relaxed opacity-90">{project.body}</p>
          <ul className="mt-6 space-y-2">
            {project.results.map((r,i)=> <li key={i}>✅ {r}</li>)}
          </ul>
          <div className="mt-8 flex gap-3">
            <a href={project.doc} className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold" style={{border: `1px solid ${PALETTE.cyan}`}}>
              <IconBolt/> Télécharger le livrable
            </a>
            <a href="/cv.pdf" className="px-5 py-3 rounded-full font-semibold" style={{border: `1px solid ${PALETTE.violet}`}}>Voir mon rôle</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    { slug:"veille-cloud", title:"Veille — Cloud & Sécurité des données", cover:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop", date:"2025-09-12" },
    { slug:"dhcp-vlan", title:"TP — DHCP sur réseaux multi-VLAN", cover:"https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1400&auto=format&fit=crop", date:"2025-09-11" },
    { slug:"windows-gpo", title:"Mémo — GPO indispensables pour un domaine AD", cover:"https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1400&auto=format&fit=crop", date:"2025-09-10" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8" style={{color: PALETTE.violet}}>Blog / Veille</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map(p => (
          <article key={p.slug} className="rounded-2xl overflow-hidden" style={{border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)"}}>
            <img src={p.cover} alt={p.title} className="aspect-[16/9] w-full object-cover"/>
            <div className="p-5">
              <p className="text-xs opacity-70">{p.date}</p>
              <h3 className="text-lg font-semibold mt-1" style={{color: PALETTE.cyan}}>{p.title}</h3>
              <p className="opacity-80 text-sm mt-2">Lecture courte — notes et sources à venir.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const imgs = [
    "https://images.unsplash.com/photo-1563201189-3c6e9a6d7a07?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587202372775-98927b445aae?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1400&auto=format&fit=crop",
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8" style={{color: PALETTE.cyan}}>Galerie</h2>
      <p className="opacity-85 mb-6">Un aperçu visuel de mes projets, racks, topologies et labos.</p>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {imgs.map((src, i) => (
          <img key={i} src={src} alt={`g-${i}`} className="rounded-xl aspect-[4/3] object-cover"/>
        ))}
      </div>
    </section>
  );
}

function Assets() {
  const files = [
    { name:"IRF HPE 5140 — Procédure.pdf", path:"/docs/irf-hpe-5140.pdf" },
    { name:"Brocker'Info — Packet Tracer.pkt", path:"/docs/brockerinfo.pkt" },
    { name:"Lab AD DS — Mémo GPO.pdf", path:"/docs/windows-server-ad.pdf" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color: PALETTE.cyan}}>Documents & Livrables</h2>
      <p className="opacity-85 mb-6">Tous mes PDF, schémas, maquettes Packet Tracer et scripts, triés aux petits oignons.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {files.map((f,i)=> (
          <a key={i} href={f.path} className="rounded-xl p-5 flex items-center justify-between" style={{border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)"}}>
            <span>{f.name}</span>
            <span style={{color: PALETTE.cyan}}>Télécharger</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color: PALETTE.cyan}}>Curriculum Vitæ</h2>
      <p className="opacity-90">Télécharge mon CV ou consulte les points clés ci-dessous.</p>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-semibold" style={{color: PALETTE.violet}}>Formation</h3>
          <ul className="mt-2 space-y-2 opacity-90 text-sm">
            <li>BTS SIO SISR (2ᵉ année)</li>
            <li>Bac STI2D</li>
          </ul>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-semibold" style={{color: PALETTE.violet}}>Compétences clés</h3>
          <ul className="mt-2 space-y-2 opacity-90 text-sm">
            <li>HPE IRF, Cisco, VLAN</li>
            <li>Windows Server, Linux</li>
            <li>Docs & schémas clairs</li>
          </ul>
        </GlassCard>
      </div>
      <a href="/cv.pdf" className="inline-block mt-8 px-6 py-3 rounded-full font-semibold" style={{border: `1px solid ${PALETTE.cyan}`}}>Télécharger le CV (PDF)</a>
    </section>
  );
}

function Contact({ theme }) {
  const isDark = theme === "dark";
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{color: PALETTE.cyan}}>Contact</h2>
      <p className="opacity-90">Écris-moi : je réponds plus vite qu’un spanning-tree bien réglé.</p>
      <form className="mt-8 grid gap-4" method="POST" action="https://formspree.io/f/your-id">
        <input required name="name" className="px-4 py-3 rounded-lg bg-transparent" style={{border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`}} placeholder="Nom"/>
        <input required type="email" name="email" className="px-4 py-3 rounded-lg bg-transparent" style={{border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`}} placeholder="Email"/>
        <textarea required name="message" className="px-4 py-3 rounded-lg bg-transparent h-32" style={{border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`}} placeholder="Message"/>
        <MagneticButton className="w-max" style={{ background: PALETTE.violet }}>Envoyer</MagneticButton>
      </form>
    </section>
  );
}

function Legal() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold mb-4" style={{color: PALETTE.cyan}}>Mentions légales</h2>
      <p className="opacity-90 text-sm">Indique l'éditeur du site, l'hébergeur, le responsable de publication, et un contact.</p>
    </section>
  );
}

function Privacy() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold mb-4" style={{color: PALETTE.cyan}}>Politique de confidentialité</h2>
      <p className="opacity-90 text-sm">Explique comment tu traites les données du formulaire (durée de conservation, droits RGPD, etc.).</p>
    </section>
  );
}

function NotFound() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold" style={{color: PALETTE.violet}}>404</h2>
      <p className="opacity-80">Cette page s'est perdue dans un VLAN isolé…</p>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  useEffect(()=>{ document.title = "Yanis Bonnet Gomez — Portfolio BTS SIO"; },[]);
  return (
    <Router>
      <ScrollToTop/>
      <Layout theme={theme} setTheme={setTheme}>
        <Routes>
          <Route path="/" element={<Home theme={theme}/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/skills" element={<Skills/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/projects/:id" element={<ProjectDetail/>} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/assets" element={<Assets/>} />
          <Route path="/resume" element={<Resume/>} />
          <Route path="/contact" element={<Contact theme={theme}/>} />
          <Route path="/legal" element={<Legal/>} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Layout>
    </Router>
  );
}
