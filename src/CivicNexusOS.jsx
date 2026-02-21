import { useState, useMemo } from "react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INITIAL_DONORS = [
  { id: 1, name: "George S. Eccles Foundation", org: "Eccles Foundation", amount: 0, stage: "Prospect", tier: 1, namedSpace: "Full Facility Name", daysInStage: 3 },
  { id: 2, name: "Utah Mammoth / Mammoth Foundation", org: "Utah Mammoth", amount: 500000, stage: "Committed", tier: 2, namedSpace: "Main Ice Sheet", daysInStage: 1 },
  { id: 3, name: "NHL Foundation", org: "NHL", amount: 0, stage: "Contacted", tier: 2, namedSpace: "Multi-Purpose Sheet", daysInStage: 7 },
  { id: 4, name: "Utah County TRT Tax", org: "Utah County", amount: 0, stage: "Prospect", tier: 2, namedSpace: "Disability Park", daysInStage: 2 },
  { id: 5, name: "McKell RFA – State Budget", org: "State of Utah", amount: 0, stage: "Prospect", tier: 2, namedSpace: "Main Lobby", daysInStage: 0 },
  { id: 6, name: "Anonymous Charitable Foundation", org: "Reno Model", amount: 0, stage: "Meeting", tier: 1, namedSpace: "Full Facility Name", daysInStage: 16 },
  { id: 7, name: "Mariner S. Eccles Foundation", org: "Eccles", amount: 0, stage: "Prospect", tier: 3, namedSpace: "Locker Room Complex", daysInStage: 0 },
  { id: 8, name: "Federal Grants (sam.gov)", org: "Federal", amount: 0, stage: "Prospect", tier: 2, namedSpace: null, daysInStage: 0 },
];

const INITIAL_ROCKS = [
  { id: "ROCK-01", name: "Complete 501(c)(3) Filing", owner: "Buck", due: "2026-02-28", status: "On Track", metric: "IRS filing submitted" },
  { id: "ROCK-02", name: "Secure Mapleton Land Commitment Letter", owner: "Logan + City Mgr", due: "2026-03-07", status: "On Track", metric: "Signed letter on file" },
  { id: "ROCK-03", name: "Conceptual Grant Design Package", owner: "Adam (Epic Eng.)", due: "2026-03-15", status: "On Track", metric: "Drawings for grant apps" },
  { id: "ROCK-04", name: "County Commissioner Meeting", owner: "Buck + Skyler", due: "2026-02-28", status: "At Risk", metric: "Presentation scheduled w/ Brandon + Skyler" },
  { id: "ROCK-05", name: "Eccles Foundation Outreach", owner: "Edward or Buck", due: "2026-03-15", status: "On Track", metric: "Meeting confirmed" },
  { id: "ROCK-06", name: "NHL Outreach via Utah Mammoth", owner: "Buck", due: "2026-03-10", status: "Blocked", metric: "Formal NHL application submitted" },
  { id: "ROCK-07", name: "Sponsorship Package Design", owner: "Buck + Reno Contact", due: "2026-03-07", status: "On Track", metric: "Pricing tiers finalized" },
  { id: "ROCK-08", name: "Collaboration Website Live", owner: "Skyler", due: "2026-03-07", status: "On Track", metric: "Donor pipeline public-facing" },
  { id: "ROCK-09", name: "$4M Committed Capital (Rock #1)", owner: "Full Team", due: "2026-06-01", status: "On Track", metric: "$4M in signed pledges" },
  { id: "ROCK-10", name: "UVU / Nebo School District Outreach", owner: "TBD", due: "2026-03-20", status: "On Track", metric: "Exploratory meeting held" },
];

const MILESTONES = [
  { id: "M1", label: "501(c)(3) Formation", threshold: 0, special: "entity", status: "unlocked", action: "Open private donation channels", icon: "🏛️" },
  { id: "M2", label: "Mapleton Land Letter", threshold: 0, special: "land", status: "locked", action: "NHL outreach authorized", icon: "📋" },
  { id: "M3", label: "$500K Committed", threshold: 500000, status: "unlocked", action: "Phase 0 kick-off + county commissioner meeting", icon: "🏗️" },
  { id: "M4", label: "$1M–$2M NHL Commitment", threshold: 1500000, status: "locked", action: "Federal grant applications submitted", icon: "🏒" },
  { id: "M5", label: "$4M Committed (Rock #1)", threshold: 4000000, status: "locked", action: "Chiller/ice plant deposit placed — long-lead clock starts", icon: "❄️" },
  { id: "M6", label: "$8M Committed (Rock #2)", threshold: 8000000, status: "locked", action: "Steel building contract executed; site work bid awarded", icon: "🔩" },
  { id: "M7", label: "$12M Floor", threshold: 12000000, status: "locked", action: "Phase 1 GC contract; Jan 1 construction start viable", icon: "📐" },
  { id: "M8", label: "$20M Ceiling", threshold: 20000000, status: "locked", action: "Full dual-sheet + disability park contracted concurrently", icon: "🏆" },
];

const VTP_CHECKPOINTS = [
  { id: "VTP-01", name: "Sub-slab insulation installed", spec: "Photo + thermal spec before concrete pour", status: "pending" },
  { id: "VTP-02", name: "Rink slab level tolerance", spec: "Survey instrument check; flatness spec", status: "pending" },
  { id: "VTP-03", name: "Disability park slope grades", spec: "ADA max 2% cross-slope / 5% running slope", status: "pending" },
  { id: "VTP-04", name: "Accessible pathway surface", spec: "Firm, stable, slip-resistant surface verified", status: "pending" },
  { id: "VTP-05", name: "Accessible restroom rough-in", spec: "Grab bar blocking, turning radius clearance", status: "pending" },
  { id: "VTP-06", name: "Dasher board glass height", spec: "Universal Design sightline standard (seated viewer)", status: "pending" },
  { id: "VTP-07", name: "Ice plant room ventilation", spec: "CO₂/ammonia safety ventilation spec verified", status: "pending" },
  { id: "VTP-08", name: "Sled hockey surface spec", spec: "Surface hardness and dimensional tolerances", status: "pending" },
];

const STAGES = ["Prospect", "Contacted", "Meeting", "Committed", "Received"];
const STAGE_COLORS = {
  Prospect: { bg: "bg-slate-800", border: "border-slate-600", badge: "bg-slate-700 text-slate-300" },
  Contacted: { bg: "bg-blue-950", border: "border-blue-700", badge: "bg-blue-800 text-blue-200" },
  Meeting: { bg: "bg-violet-950", border: "border-violet-700", badge: "bg-violet-800 text-violet-200" },
  Committed: { bg: "bg-amber-950", border: "border-amber-700", badge: "bg-amber-800 text-amber-200" },
  Received: { bg: "bg-emerald-950", border: "border-emerald-700", badge: "bg-emerald-800 text-emerald-200" },
};
const ROCK_STATUS_COLORS = {
  "On Track": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  "At Risk": "bg-amber-500/20 text-amber-300 border-amber-500/40",
  "Blocked": "bg-red-500/20 text-red-300 border-red-500/40",
  "Complete": "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
};

const fmt = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function CapitalGauge({ committed, goal = 20000000, floor = 12000000 }) {
  const pct = Math.min((committed / goal) * 100, 100);
  const floorPct = (floor / goal) * 100;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-slate-400 text-sm font-medium tracking-widest uppercase">Capital Engine</span>
        <span className="text-2xl font-bold text-white">{fmt(committed)}</span>
      </div>
      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: pct >= floorPct ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#f59e0b,#fbbf24)" }}
        />
        {/* Floor marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/40" style={{ left: `${floorPct}%` }} />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>$0</span>
        <span className="text-slate-400">$12M floor</span>
        <span>$20M goal</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-lg font-bold text-white">{fmt(committed)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Committed</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-lg font-bold text-amber-400">{fmt(goal - committed)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Gap to Goal</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-lg font-bold text-cyan-400">{(pct).toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-0.5">Progress</div>
        </div>
      </div>
    </div>
  );
}

function DonorCard({ donor, onMove, onEdit }) {
  const colors = STAGE_COLORS[donor.stage];
  const needsAction = donor.stage === "Meeting" && donor.daysInStage > 14;
  const stageIdx = STAGES.indexOf(donor.stage);
  return (
    <div className={`rounded-xl border ${colors.border} bg-slate-900 p-3 mb-2 relative`}>
      {needsAction && (
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
      )}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <div className="text-white text-sm font-semibold truncate">{donor.name}</div>
          <div className="text-slate-500 text-xs truncate">{donor.org}</div>
        </div>
        {donor.amount > 0 && (
          <div className="text-emerald-400 font-bold text-sm whitespace-nowrap">{fmt(donor.amount)}</div>
        )}
      </div>
      {donor.namedSpace && (
        <div className="mt-2 text-xs text-violet-400 bg-violet-950 rounded-lg px-2 py-1 inline-block">🏷 {donor.namedSpace}</div>
      )}
      <div className="flex gap-1 mt-3">
        <button
          disabled={stageIdx === 0}
          onClick={() => onMove(donor.id, -1)}
          className="flex-1 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-30 transition-colors"
        >← Back</button>
        <button
          onClick={() => onEdit(donor)}
          className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
        >✏️</button>
        <button
          disabled={stageIdx === STAGES.length - 1}
          onClick={() => onMove(donor.id, 1)}
          className="flex-1 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-30 transition-colors"
        >Advance →</button>
      </div>
    </div>
  );
}

function PledgeModal({ donor, onSave, onClose }) {
  const [amount, setAmount] = useState(donor?.amount || "");
  const [name, setName] = useState(donor?.name || "");
  const [org, setOrg] = useState(donor?.org || "");
  const [stage, setStage] = useState(donor?.stage || "Prospect");
  const [namedSpace, setNamedSpace] = useState(donor?.namedSpace || "");

  const handleSave = () => {
    onSave({ ...donor, name, org, amount: parseFloat(amount) || 0, stage, namedSpace, daysInStage: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg">{donor?.id ? "Edit Donor" : "Log New Pledge"}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Donor / Foundation Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
          <input value={org} onChange={e => setOrg(e.target.value)} placeholder="Organization" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
          <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Pledge Amount ($)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
          <select value={stage} onChange={e => setStage(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500">
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
          <input value={namedSpace} onChange={e => setNamedSpace(e.target.value)} placeholder="Named Space (optional)" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500" />
        </div>
        <button onClick={handleSave} className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-colors">
          Save Pledge
        </button>
      </div>
    </div>
  );
}

function CapitalView({ donors, onMove, onEdit, onAdd }) {
  const committed = useMemo(() => donors.filter(d => d.stage === "Committed" || d.stage === "Received").reduce((s, d) => s + d.amount, 0), [donors]);
  const nudgeCount = donors.filter(d => d.stage === "Meeting" && d.daysInStage > 14).length;

  return (
    <div className="space-y-4">
      <CapitalGauge committed={committed} />
      {nudgeCount > 0 && (
        <div className="bg-red-950 border border-red-700 rounded-xl p-3 flex items-center gap-3">
          <span className="text-red-400 text-xl">⚠️</span>
          <span className="text-red-300 text-sm font-medium">{nudgeCount} donor{nudgeCount > 1 ? "s" : ""} stuck in Meeting stage 14+ days — follow up now</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-white font-bold text-base">Donor Pipeline</h2>
        <button onClick={onAdd} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded-xl transition-colors">+ Log Pledge</button>
      </div>
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-2">
          {STAGES.map(stage => {
            const stageDonors = donors.filter(d => d.stage === stage);
            const stageTotal = stageDonors.reduce((s, d) => s + d.amount, 0);
            const colors = STAGE_COLORS[stage];
            return (
              <div key={stage} className="w-64 flex-shrink-0">
                <div className={`flex justify-between items-center px-3 py-2 rounded-t-xl ${colors.bg} border-x border-t ${colors.border}`}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{stage}</span>
                  <span className="text-slate-400 text-xs">{stageTotal > 0 ? fmt(stageTotal) : `${stageDonors.length} donors`}</span>
                </div>
                <div className={`min-h-32 p-2 border-x border-b rounded-b-xl ${colors.border} bg-slate-950/50`}>
                  {stageDonors.map(d => (
                    <DonorCard key={d.id} donor={d} onMove={onMove} onEdit={onEdit} />
                  ))}
                  {stageDonors.length === 0 && (
                    <div className="text-slate-700 text-xs text-center py-6">No donors</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConstructionView({ committed, vtpCheckpoints, onVtpUpdate }) {
  const milestones = useMemo(() => MILESTONES.map(m => ({
    ...m,
    status: m.special ? m.status : committed >= m.threshold ? "unlocked" : "locked",
  })), [committed]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <div className="text-slate-400 text-xs font-medium tracking-widest uppercase mb-3">Capital → Concrete Gate Status</div>
        <div className="space-y-2">
          {milestones.map(m => (
            <div key={m.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${m.status === "unlocked" ? "bg-emerald-950/40 border-emerald-700/50" : "bg-slate-800/50 border-slate-700/50 opacity-60"}`}>
              <span className="text-xl mt-0.5">{m.status === "unlocked" ? "✅" : "🔒"}</span>
              <div className="min-w-0">
                <div className={`font-semibold text-sm ${m.status === "unlocked" ? "text-emerald-300" : "text-slate-400"}`}>{m.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.action}</div>
                {m.threshold > 0 && m.status === "locked" && (
                  <div className="text-xs text-amber-500 mt-1">Requires {fmt(m.threshold)} committed</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-slate-400 text-xs font-medium tracking-widest uppercase">Verify-Then-Pour Checkpoints</div>
          <div className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/30">
            {vtpCheckpoints.filter(v => v.status === "pending").length} pending
          </div>
        </div>
        <div className="space-y-2">
          {vtpCheckpoints.map(vtp => (
            <div key={vtp.id} className={`p-3 rounded-xl border ${vtp.status === "approved" ? "bg-emerald-950/30 border-emerald-700/40" : vtp.status === "failed" ? "bg-red-950/30 border-red-700/40" : "bg-slate-800 border-slate-700"}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium">{vtp.id}: {vtp.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{vtp.spec}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {vtp.status === "pending" && (
                    <>
                      <button onClick={() => onVtpUpdate(vtp.id, "approved")} className="bg-emerald-800 hover:bg-emerald-700 text-emerald-300 text-xs px-2 py-1 rounded-lg transition-colors">✓ Pass</button>
                      <button onClick={() => onVtpUpdate(vtp.id, "failed")} className="bg-red-900 hover:bg-red-800 text-red-300 text-xs px-2 py-1 rounded-lg transition-colors">✗ Fail</button>
                    </>
                  )}
                  {vtp.status === "approved" && <span className="text-emerald-400 text-sm">✅ Passed</span>}
                  {vtp.status === "failed" && (
                    <button onClick={() => onVtpUpdate(vtp.id, "pending")} className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-lg">🛑 STOP</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-700/50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <div className="text-amber-300 font-bold text-sm">Jan 1 Construction Target</div>
            <div className="text-amber-500/80 text-xs mt-1">Chiller deposit must be placed by July 1. That means $4M (Rock #1) must close by June — not as a goal, as a procurement necessity.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RocksView({ rocks, onUpdate }) {
  const [competitorNote, setCompetitorNote] = useState("");
  const [competitor, setCompetitor] = useState("Saratoga");
  const [flags, setFlags] = useState([]);
  const complete = rocks.filter(r => r.status === "Complete").length;

  const flagCompetitor = () => {
    if (!competitorNote.trim()) return;
    setFlags(f => [{ competitor, note: competitorNote, date: new Date().toLocaleDateString() }, ...f]);
    setCompetitorNote("");
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-slate-400 text-xs font-medium tracking-widest uppercase">Q1 Rocks</div>
          <div className="text-cyan-400 font-bold text-sm">{complete}/{rocks.length} Complete</div>
        </div>
        <div className="h-2 bg-slate-800 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all" style={{ width: `${(complete / rocks.length) * 100}%` }} />
        </div>
        <div className="space-y-2">
          {rocks.map(rock => (
            <div key={rock.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="text-white text-sm font-semibold">{rock.id}</div>
                  <div className="text-slate-300 text-sm">{rock.name}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-slate-500">👤 {rock.owner}</span>
                    <span className="text-xs text-slate-500">📅 {rock.due}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">✓ {rock.metric}</div>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {["On Track", "At Risk", "Blocked", "Complete"].map(s => (
                    <button
                      key={s}
                      onClick={() => onUpdate(rock.id, s)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-all whitespace-nowrap ${rock.status === s ? ROCK_STATUS_COLORS[s] : "bg-slate-900 text-slate-600 border-slate-700 hover:border-slate-500"}`}
                    >
                      {s === "On Track" ? "✓" : s === "At Risk" ? "⚠" : s === "Blocked" ? "🚫" : "✅"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
        <div className="text-slate-400 text-xs font-medium tracking-widest uppercase mb-3">🏁 Race to the Rink — Competitor Intel</div>
        <div className="flex gap-2 mb-3">
          <select value={competitor} onChange={e => setCompetitor(e.target.value)} className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none">
            <option>Saratoga</option>
            <option>Lehi</option>
            <option>Other</option>
          </select>
          <input value={competitorNote} onChange={e => setCompetitorNote(e.target.value)} placeholder="Log competitor event..." className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-red-500" />
          <button onClick={flagCompetitor} className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">Flag</button>
        </div>
        {flags.length === 0 && <div className="text-slate-700 text-xs text-center py-4">No competitor events logged</div>}
        {flags.map((f, i) => (
          <div key={i} className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 mb-2">
            <div className="flex justify-between">
              <span className="text-red-400 font-bold text-xs">{f.competitor}</span>
              <span className="text-slate-600 text-xs">{f.date}</span>
            </div>
            <div className="text-slate-300 text-sm mt-1">{f.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function CivicNexusOS() {
  const [tab, setTab] = useState("capital");
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [rocks, setRocks] = useState(INITIAL_ROCKS);
  const [vtpCheckpoints, setVtpCheckpoints] = useState(VTP_CHECKPOINTS);
  const [modal, setModal] = useState(null); // null | "new" | donorObj

  const committed = useMemo(() =>
    donors.filter(d => d.stage === "Committed" || d.stage === "Received").reduce((s, d) => s + d.amount, 0),
    [donors]
  );

  const moveDonor = (id, dir) => {
    setDonors(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = STAGES.indexOf(d.stage);
      return { ...d, stage: STAGES[idx + dir], daysInStage: 0 };
    }));
  };

  const saveDonor = (updated) => {
    if (updated.id) {
      setDonors(prev => prev.map(d => d.id === updated.id ? updated : d));
    } else {
      setDonors(prev => [...prev, { ...updated, id: Date.now() }]);
    }
  };

  const updateRock = (id, status) => setRocks(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  const updateVtp = (id, status) => setVtpCheckpoints(prev => prev.map(v => v.id === id ? { ...v, status } : v));

  const TABS = [
    { id: "capital", label: "Capital", icon: "💰" },
    { id: "construction", label: "Build", icon: "🏗️" },
    { id: "rocks", label: "Rocks", icon: "🪨" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-white font-black text-lg tracking-tight">CIVIC NEXUS OS</div>
            <div className="text-slate-500 text-xs">$20M Blueprint · Mapleton Ice Rink</div>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 font-bold text-lg">{fmt(committed)}</div>
            <div className="text-slate-600 text-xs">committed</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-28">
        {tab === "capital" && <CapitalView donors={donors} onMove={moveDonor} onEdit={d => setModal(d)} onAdd={() => setModal("new")} />}
        {tab === "construction" && <ConstructionView committed={committed} vtpCheckpoints={vtpCheckpoints} onVtpUpdate={updateVtp} />}
        {tab === "rocks" && <RocksView rocks={rocks} onUpdate={updateRock} />}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 z-40">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${tab === t.id ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"}`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <PledgeModal
          donor={modal === "new" ? null : modal}
          onSave={saveDonor}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
