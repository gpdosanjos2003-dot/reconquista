import { useState, useEffect, useRef } from "react";

// ─── DADOS DO FUNIL ───────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Quanto tempo faz desde o término?",
    options: [
      { emoji: "🔴", text: "Menos de 72 horas", tag: "critico" },
      { emoji: "🟡", text: "Entre 3 dias e 3 semanas", tag: "ativo" },
      { emoji: "🟠", text: "Entre 3 semanas e 3 meses", tag: "estreitando" },
      { emoji: "⚫", text: "Mais de 3 meses", tag: "avancado" },
    ],
  },
  {
    id: 2,
    question: "Como ela age com você hoje?",
    options: [
      { emoji: "💬", text: "Conversamos, mas ela é fria e distante" },
      { emoji: "📵", text: "Só responde o necessário" },
      { emoji: "🔇", text: "Me bloqueou em tudo" },
      { emoji: "👻", text: "Sumiu completamente, zero contato" },
    ],
  },
  {
    id: 3,
    question: "Sendo brutalmente honesto: o que mais dói desde o término?",
    options: [
      { emoji: "🌑", text: "O vazio e a solidão que ela deixou" },
      { emoji: "😔", text: "A culpa pelo que eu fiz ou deixei de fazer" },
      { emoji: "😰", text: "A ideia dela já estar com outro" },
      { emoji: "💔", text: "Saber que ela me vê como descartável" },
    ],
  },
  {
    id: 4,
    question: "Nas últimas 48 horas, o que você fez sem pensar muito?",
    options: [
      { emoji: "📱", text: "Mandei mensagem ou liguei mais de uma vez" },
      { emoji: "👀", text: "Fiquei analisando o Instagram ou WhatsApp dela" },
      { emoji: "🕵️", text: "Pedi pra alguém ver o que ela tava postando" },
      { emoji: "😶", text: "Não fiz nada — mas me forcei muito" },
    ],
  },
  {
    id: 5,
    question: "Se ela seguir em frente com outro amanhã, o que acontece com você?",
    options: [
      { emoji: "💥", text: "Perderia o rumo da minha vida completamente" },
      { emoji: "😤", text: "Tentaria reconquistar ela de qualquer jeito" },
      { emoji: "🥀", text: "Fingiria que não ligo, mas morreria por dentro" },
      { emoji: "🏃", text: "Ficaria mal, mas tentaria seguir em frente" },
    ],
  },
  {
    id: 6,
    question: "Hoje, como ela te vê?",
    options: [
      { emoji: "🚫", text: "Alguém que ela odeia ou não perdoa" },
      { emoji: "🔄", text: "Uma segunda opção quando se sente sozinha" },
      { emoji: "👻", text: "Completamente invisível e descartável" },
      { emoji: "❓", text: "Não sei — e essa incerteza me mata" },
    ],
  },
  {
    id: 7,
    question: "Se eu te mostrasse o protocolo exato para fazer ela sentir sua falta — você aplicaria HOJE?",
    options: [
      { emoji: "🔥", text: "Sim, preciso agir agora antes que seja tarde" },
      { emoji: "✅", text: "Sim, mas quero entender cada passo antes" },
      { emoji: "😟", text: "Tenho medo de errar de novo" },
      { emoji: "🤔", text: "Não sei se ainda tem jeito no meu caso" },
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    age: 34,
    city: "São Paulo",
    text: "Ela tinha me bloqueado em tudo. Achei que era o fim. Apliquei o protocolo na segunda semana. Na terceira semana, ela me mandou mensagem às 2 da manhã dizendo que tava com saudade. Hoje a gente tá junto de novo.",
    result: "Reconquistou em 19 dias",
    stars: 5,
  },
  {
    name: "Marcos T.",
    age: 29,
    city: "Rio de Janeiro",
    text: "Não acreditava que ia funcionar. Ela estava saindo com outro cara. Mas tentei porque não tinha mais nada a perder. Três semanas depois, ela terminou com ele e me mandou áudio chorando pedindo uma chance.",
    result: "Reconquistou em 23 dias",
    stars: 5,
  },
  {
    name: "André F.",
    age: 41,
    city: "Belo Horizonte",
    text: "Cinco meses sem falar com ela. Todo mundo dizia que era impossível. O protocolo avançado mudou tudo. Ela apareceu na minha porta com a desculpa de que tinha esquecido um casaco.",
    result: "Reconquistou após 5 meses",
    stars: 5,
  },
  {
    name: "Ricardo L.",
    age: 26,
    city: "Curitiba",
    text: "Tava mandando mensagem todo dia implorando. Aprendi o que eu tava fazendo de errado. Mudei o comportamento em 48 horas. Em uma semana ela me ligou perguntando se eu tava bem.",
    result: "Reconquistou em 9 dias",
    stars: 5,
  },
];

const NEWS_ITEMS = [
  {
    source: "Revista Saúde Mental",
    headline: "Neurociência explica por que o afastamento estratégico é mais eficaz do que tentar reconquistar ativamente",
    snippet: "Estudos sobre apego e memória emocional indicam que o sistema de proteção do cérebro feminino responde de forma oposta ao comportamento de perseguição...",
  },
  {
    source: "Psicologia Moderna",
    headline: "O papel do cortisol na tomada de decisão em relacionamentos: por que ela termina no pico emocional",
    snippet: "Pesquisadores identificaram padrões específicos de comportamento masculino que ativam o sistema de ameaça no cérebro feminino, acelerando decisões de separação...",
  },
  {
    source: "Instituto de Comportamento Relacional",
    headline: "Estudo com 12.000 casais: os 3 comportamentos pós-término que eliminam qualquer chance de reconciliação",
    snippet: "A pesquisa identificou que 87% dos homens cometem ao menos um dos três erros críticos nas primeiras 48 horas após a separação...",
  },
];

// ─── COMPONENTES AUXILIARES ───────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", background: "#1e1e2e", borderRadius: 99, height: 6, marginBottom: 24 }}>
      <div
        style={{
          height: "100%",
          borderRadius: 99,
          background: "linear-gradient(90deg, #d97706, #f59e0b)",
          width: `${pct}%`,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function StarRating({ stars }) {
  return (
    <div style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 2 }}>
      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
    </div>
  );
}

function Timer({ seconds }) {
  const [time, setTime] = useState(seconds);
  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  return (
    <div style={{
      display: "inline-flex", gap: 4, alignItems: "center",
      background: "#7f1d1d", color: "#fca5a5", borderRadius: 8,
      padding: "6px 14px", fontSize: 15, fontWeight: 700,
    }}>
      ⏱ {mm}:{ss}
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────
export default function FunilReconquista() {
  const [step, setStep] = useState(0); // 0=hero, 1-7=quiz, 8=processando, 9=resultado, 10=salespage
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  const handleAnswer = (option) => {
    setSelected(option.text);
    setTimeout(() => {
      const q = QUIZ_QUESTIONS[step - 1];
      setAnswers((prev) => ({ ...prev, [q.id]: option }));
      setSelected(null);
      if (step < 7) setStep(step + 1);
      else {
        setStep(8); // processando
        setTimeout(() => setStep(9), 2800);
      }
    }, 420);
  };

  // ── Estilos globais ──
  const S = {
    page: {
      minHeight: "100vh",
      background: "#07070f",
      color: "#f1f1f3",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 0 60px 0",
    },
    btn: {
      display: "block", width: "100%",
      background: "linear-gradient(135deg, #d97706, #f59e0b)",
      color: "#0a0a0f", fontWeight: 800, fontSize: 18,
      border: "none", borderRadius: 14, padding: "18px 24px",
      cursor: "pointer", textAlign: "center", letterSpacing: "-0.3px",
      boxShadow: "0 4px 24px rgba(245,158,11,0.35)",
    },
    btnRed: {
      display: "block", width: "100%",
      background: "linear-gradient(135deg, #b91c1c, #ef4444)",
      color: "#fff", fontWeight: 800, fontSize: 18,
      border: "none", borderRadius: 14, padding: "18px 24px",
      cursor: "pointer", textAlign: "center",
      boxShadow: "0 4px 24px rgba(239,68,68,0.4)",
    },
    card: {
      background: "#0f0f1a",
      border: "1px solid #1e1e2e",
      borderRadius: 16, padding: 20,
    },
    tag: (c) => ({
      display: "inline-block", padding: "3px 10px",
      borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: c === "r" ? "#7f1d1d" : "#422006",
      color: c === "r" ? "#fca5a5" : "#fcd34d",
      marginBottom: 8,
    }),
    answerBtn: (sel) => ({
      display: "flex", alignItems: "center", gap: 14,
      background: sel ? "#1a2e05" : "#0f0f1a",
      border: sel ? "2px solid #84cc16" : "1.5px solid #1e1e2e",
      borderRadius: 14, padding: "15px 18px",
      cursor: "pointer", textAlign: "left", width: "100%",
      marginBottom: 10, transition: "all 0.2s",
      color: "#f1f1f3",
    }),
  };

  // ── STEP 0: HERO ──────────────────────────────────────────────────
  if (step === 0) return (
    <div style={S.page} ref={topRef}>
      {/* Header urgência */}
      <div style={{ background: "#7f1d1d", padding: "10px 20px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>
        ⚠️ JANELA CRÍTICA ABERTA — A cada hora que passa, suas chances diminuem
      </div>

      <div style={{ padding: "32px 20px 24px" }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={S.tag("r")}>PROTOCOLO DE RECONQUISTA</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 32, fontWeight: 900, lineHeight: 1.15,
          textAlign: "center", marginBottom: 16,
          background: "linear-gradient(135deg, #ffffff, #f59e0b)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Sua Ex de Volta<br />em Até 48 Horas
        </h1>

        <p style={{ color: "#9ca3af", textAlign: "center", fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>
          Descubra se o <strong style={{ color: "#f59e0b" }}>Protocolo de Reconexão</strong> ainda está ativo para o seu caso — e o que fazer nas próximas horas antes que seja tarde demais.
        </p>

        {/* Prova rápida */}
        <div style={{ ...S.card, marginBottom: 24, borderColor: "#d97706" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 32 }}>📊</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>47.000+ casos estudados</div>
              <div style={{ color: "#9ca3af", fontSize: 13 }}>Método validado pelo Dr. Lucas Monteiro, psicólogo comportamental</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
            {[["89%", "de aprovação"], ["21 dias", "protocolo"], ["48h", "primeiros sinais"]].map(([n, l]) => (
              <div key={n} style={{ background: "#0a0a14", borderRadius: 10, padding: "10px 6px" }}>
                <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18 }}>{n}</div>
                <div style={{ color: "#6b7280", fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Depoimento rápido */}
        <div style={{ ...S.card, marginBottom: 28, borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>💬 Carlos M., 34 anos — São Paulo</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#e2e8f0", margin: 0 }}>
            <em>"Ela tinha me bloqueado em tudo. Achei que era o fim. Na terceira semana ela me mandou mensagem às 2 da manhã dizendo que estava com saudade."</em>
          </p>
          <div style={{ color: "#84cc16", fontSize: 12, fontWeight: 700, marginTop: 8 }}>✓ Reconquistou em 19 dias</div>
        </div>

        <button style={S.btnRed} onClick={() => setStep(1)}>
          🔥 DESCOBRIR SE AINDA TEM TEMPO — RESPONDER AGORA
        </button>

        <p style={{ textAlign: "center", color: "#4b5563", fontSize: 12, marginTop: 12 }}>
          🔒 Quiz gratuito · Resultado personalizado em 60 segundos
        </p>
      </div>
    </div>
  );

  // ── STEPS 1-7: QUIZ ───────────────────────────────────────────────
  if (step >= 1 && step <= 7) {
    const q = QUIZ_QUESTIONS[step - 1];
    return (
      <div style={S.page} ref={topRef}>
        <div style={{ background: "#7f1d1d", padding: "10px 20px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>
          ⚠️ Responda com honestidade — o diagnóstico depende disso
        </div>

        <div style={{ padding: "28px 20px" }}>
          <ProgressBar current={step} total={7} />

          <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
            PERGUNTA {step} DE 7
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 28, color: "#f1f1f3" }}>
            {q.question}
          </h2>

          <div>
            {q.options.map((opt) => (
              <button
                key={opt.text}
                style={S.answerBtn(selected === opt.text)}
                onClick={() => handleAnswer(opt)}
              >
                <span style={{ fontSize: 24, minWidth: 32 }}>{opt.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{opt.text}</span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 24, color: "#4b5563", fontSize: 12 }}>
            Suas respostas são anônimas e protegidas
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 8: PROCESSANDO ───────────────────────────────────────────
  if (step === 8) return (
    <div style={{ ...S.page, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32 }} ref={topRef}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>🔍</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 16 }}>
        Analisando seu caso...
      </h2>
      <p style={{ color: "#9ca3af", textAlign: "center", marginBottom: 32 }}>
        O Dr. Lucas Monteiro está avaliando suas respostas e calculando o status do Protocolo de Reconexão para a sua situação específica.
      </p>
      {/* Loading bar animado */}
      <div style={{ width: "100%", background: "#1e1e2e", borderRadius: 99, height: 8 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #d97706, #f59e0b)",
          animation: "loading 2.8s ease forwards",
          width: "100%",
        }} />
      </div>
      <style>{`@keyframes loading { from { width: 0% } to { width: 100% } }`}</style>
      <div style={{ color: "#6b7280", fontSize: 13, marginTop: 16 }}>Identificando a janela de reconexão...</div>
    </div>
  );

  // ── STEP 9: RESULTADO ─────────────────────────────────────────────
  if (step === 9) {
    const firstAnswer = answers[1];
    const isCritico = firstAnswer?.tag === "critico";
    const isAvancado = firstAnswer?.tag === "avancado";
    const chancePct = isCritico ? 23 : isAvancado ? 9 : 17;

    return (
      <div style={S.page} ref={topRef}>
        {/* Alerta vermelho */}
        <div style={{ background: "#7f1d1d", padding: "14px 20px", textAlign: "center" }}>
          <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: 14 }}>⚠️ DIAGNÓSTICO DO SEU CASO</div>
        </div>

        <div style={{ padding: "28px 20px" }}>
          {/* Gauge de chances */}
          <div style={{ ...S.card, textAlign: "center", marginBottom: 24, borderColor: "#dc2626" }}>
            <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 8 }}>PROBABILIDADE ATUAL DE RECONQUISTA</div>
            <div style={{
              fontSize: 72, fontWeight: 900, lineHeight: 1,
              color: chancePct < 15 ? "#ef4444" : "#f59e0b",
            }}>
              {chancePct}%
            </div>
            <div style={{ color: "#dc2626", fontWeight: 700, fontSize: 14, marginTop: 8 }}>
              {isCritico ? "⏱ JANELA CRÍTICA ATIVA — Menos de 48 horas" :
               isAvancado ? "⚠️ SITUAÇÃO GRAVE — Protocolo avançado necessário" :
               "🟡 JANELA ESTREITANDO — Aja nas próximas horas"}
            </div>
          </div>

          {/* Mensagem personalizada */}
          <div style={{ ...S.card, marginBottom: 24, borderLeft: "3px solid #dc2626" }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#e2e8f0", margin: 0 }}>
              {isCritico ? (
                <>Com base nas suas respostas, o <strong style={{ color: "#f59e0b" }}>Protocolo de Reconexão ainda está ativo</strong>. Mas essa janela se fecha nas próximas 48 horas. Depois disso, o sistema de proteção emocional dela completa o ciclo — e reverter fica 5 vezes mais difícil.</>
              ) : isAvancado ? (
                <>A janela primária fechou no seu caso. Mas existe um <strong style={{ color: "#f59e0b" }}>Protocolo Avançado</strong>, desenvolvido especificamente para situações onde o contato foi perdido por mais de 3 meses. Funcionou em 71% dos casos considerados impossíveis.</>
              ) : (
                <>O Protocolo de Reconexão ainda está parcialmente ativo — mas está se fechando. Cada hora que passa sem a ação correta envia sinais errados para o sistema emocional dela. <strong style={{ color: "#f59e0b" }}>O que você fizer nas próximas horas define tudo.</strong></>
              )}
            </p>
          </div>

          {/* O que você está fazendo errado */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: "#dc2626", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
              ❌ O que suas respostas revelam que você está fazendo errado:
            </div>
            {[
              "Mandando sinais de fraqueza sem perceber",
              "Ativando o sistema de proteção emocional dela",
              "Diminuindo suas chances a cada ação de desespero",
              "Usando exatamente o comportamento que a afasta",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#dc2626", minWidth: 20 }}>✗</span>
                <span style={{ color: "#9ca3af", fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "#0f0f1a", border: "1px solid #d97706", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center" }}>
            <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>
              ✅ O Protocolo de Reconquista está pronto
            </div>
            <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              O Dr. Lucas Monteiro criou um plano personalizado para o seu caso. Continue lendo para descobrir exatamente o que fazer nas próximas 48 horas.
            </p>
            <Timer seconds={900} />
            <p style={{ color: "#6b7280", fontSize: 12, marginTop: 8 }}>Essa oferta expira quando o timer zerar</p>
          </div>

          <button style={S.btnRed} onClick={() => setStep(10)}>
            👉 VER MEU PLANO PERSONALIZADO AGORA
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 10: SALES PAGE COMPLETA ──────────────────────────────────
  return (
    <div style={S.page} ref={topRef}>
      {/* Sticky header */}
      <div style={{ background: "#7f1d1d", padding: "10px 20px", textAlign: "center", position: "sticky", top: 0, zIndex: 99 }}>
        <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: 13 }}>
          ⚠️ OFERTA POR TEMPO LIMITADO &nbsp;|&nbsp; <Timer seconds={900} />
        </div>
      </div>

      <div style={{ padding: "32px 20px" }}>

        {/* ── HEADLINE ── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={S.tag("r")}>MÉTODO COMPROVADO</span>
          <h1 style={{
            fontSize: 30, fontWeight: 900, lineHeight: 1.2, marginBottom: 12,
            background: "linear-gradient(135deg, #ffffff, #f59e0b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Sua Ex de Volta<br />em Até 48 Horas
          </h1>
          <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.6 }}>
            O protocolo que 47.000 homens usaram para reverter separações que pareciam impossíveis — inclusive quando ela tinha bloqueado tudo e seguido em frente.
          </p>
        </div>

        {/* ── AUTORIDADE ── */}
        <div style={{ ...S.card, marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(135deg, #d97706, #92400e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, flexShrink: 0,
            }}>👨‍🔬</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Dr. Lucas Monteiro</div>
              <div style={{ color: "#9ca3af", fontSize: 13 }}>Psicólogo Comportamental • Pesquisador de Vínculos Afetivos</div>
              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>12 anos de pesquisa · 47.000+ casos analisados</div>
            </div>
          </div>
          <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            <em>"Passei mais de uma década estudando como o cérebro feminino processa separação e abandono. O que descobri mudou completamente o que sabemos sobre reconquista — e vai mudar o que você vai fazer a partir de agora."</em>
          </p>
        </div>

        {/* ── HISTÓRIA / COPY LONGO ── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: "#f59e0b" }}>
            Eu sei o que você fez nas últimas 48 horas.
          </h2>

          <div style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.8 }}>
            <p>Você leu o WhatsApp dela mil vezes sem abrir.</p>
            <p>Pediu pra alguém ver o Instagram dela.</p>
            <p>Escreveu uma mensagem enorme e apagou.</p>
            <p>Ou mandou e se arrependeu na mesma hora.</p>
            <p>Ficou analisando cada foto nova que ela postou, procurando alguma pista.</p>

            <div style={{ ...S.card, borderLeft: "3px solid #dc2626", margin: "20px 0" }}>
              <p style={{ margin: 0, color: "#fca5a5", fontWeight: 600 }}>
                E sabe qual é o problema?
              </p>
              <p style={{ margin: "8px 0 0", color: "#d1d5db" }}>
                Cada uma dessas ações foi um sinal enviado para o sistema de proteção emocional dela. Um sinal que disse: <strong style={{ color: "#f59e0b" }}>"Eu sou fraco. Você tomou a decisão certa em ir embora."</strong>
              </p>
            </div>

            <p>Eu não estou aqui para te julgar. Estou aqui porque ouvi essa mesma história <strong style={{ color: "#fff" }}>mais de 47.000 vezes.</strong></p>

            <p>E em todos esses casos, o homem estava fazendo a mesma coisa que você está fazendo agora — e que está destruindo qualquer chance de reconquista.</p>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "28px 0 16px", color: "#f59e0b" }}>
            O Protocolo de Reconexão — o que ninguém te conta
          </h2>

          <div style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.8 }}>
            <p>Após anos de pesquisa sobre comportamento afetivo e psicologia dos vínculos emocionais, identifiquei um padrão consistente:</p>

            <div style={{ ...S.card, borderColor: "#d97706", margin: "16px 0" }}>
              <p style={{ color: "#f59e0b", fontWeight: 700, margin: "0 0 8px" }}>A Janela de Reconexão</p>
              <p style={{ color: "#d1d5db", margin: 0, lineHeight: 1.7, fontSize: 14 }}>
                Existe um período específico após a separação onde o sistema emocional feminino ainda está em <strong style={{ color: "#fff" }}>estado de vulnerabilidade</strong>. As memórias positivas do relacionamento ainda são acessíveis. O vínculo emocional ainda responde a estímulos específicos. É nessa janela que o Protocolo de Reconexão funciona.
              </p>
            </div>

            <p>O problema é que a maioria dos homens — sem saber — faz exatamente o oposto do que ativa essa reconexão.</p>
            <p>E com cada ação errada, a janela vai se fechando.</p>
          </div>
        </div>

        {/* ── SEPARADOR ── */}
        <div style={{ borderTop: "1px solid #1e1e2e", margin: "28px 0" }} />

        {/* ── ARTIGOS E REFERÊNCIAS ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, marginBottom: 16 }}>
            PUBLICAÇÕES E REFERÊNCIAS
          </div>
          {NEWS_ITEMS.map((n, i) => (
            <div key={i} style={{ ...S.card, marginBottom: 12 }}>
              <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                📰 {n.source}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#f1f1f3", lineHeight: 1.4 }}>
                {n.headline}
              </div>
              <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>{n.snippet}</div>
            </div>
          ))}
        </div>

        {/* ── DEPOIMENTOS ── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>
            O que eles dizem depois de aplicar o protocolo
          </h2>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ ...S.card, marginBottom: 16, position: "relative", overflow: "hidden" }}>
              {/* WhatsApp style header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>{t.age} anos · {t.city}</div>
                </div>
                <StarRating stars={t.stars} />
              </div>
              {/* Bubble WhatsApp */}
              <div style={{ background: "#1a2e1a", border: "1px solid #166534", borderRadius: "0 12px 12px 12px", padding: "12px 14px", marginBottom: 10 }}>
                <p style={{ margin: 0, color: "#d1fae5", fontSize: 14, lineHeight: 1.6 }}>
                  <em>"{t.text}"</em>
                </p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0f2d12", borderRadius: 99, padding: "4px 10px" }}>
                <span style={{ color: "#4ade80", fontSize: 12 }}>✓</span>
                <span style={{ color: "#86efac", fontSize: 12, fontWeight: 700 }}>{t.result}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEPARADOR ── */}
        <div style={{ borderTop: "1px solid #1e1e2e", margin: "28px 0" }} />

        {/* ── A OFERTA ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={S.tag("a")}>OFERTA ESPECIAL</span>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
              O que você vai receber
            </h2>
            <Timer seconds={900} />
          </div>

          {/* Produto principal */}
          <div style={{ ...S.card, borderColor: "#d97706", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16, flex: 1 }}>
                📘 Protocolo de Reconquista — Guia Completo
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <div style={{ color: "#6b7280", fontSize: 12, textDecoration: "line-through" }}>De R$197</div>
                <div style={{ color: "#f59e0b", fontWeight: 900, fontSize: 22 }}>R$37</div>
              </div>
            </div>
            <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>
              O guia completo de 40+ páginas com o Protocolo de Reconexão dividido em fases. Inclui:
            </div>
            {[
              "Os 7 sinais de fraqueza que você envia sem perceber — e como parar imediatamente",
              "O protocolo fase por fase para as primeiras 48 horas",
              "O que fazer se ela te bloqueou em tudo",
              "Como agir se ela já está com outro",
              "As mensagens exatas que criam reconexão (com exemplos reais)",
              "O plano de 21 dias completo",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#84cc16", minWidth: 16, fontSize: 13 }}>✓</span>
                <span style={{ color: "#d1d5db", fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Bônus */}
          {[
            {
              emoji: "⚡",
              title: 'BÔNUS 1: "Modo Emergência — Protocolo das Primeiras 48 Horas"',
              desc: "Para quem terminou há menos de 3 dias. Ações específicas para as próximas horas.",
              valor: "R$67",
            },
            {
              emoji: "🔓",
              title: 'BÔNUS 2: "Protocolo do Bloqueio — Quando Ela Cortou Todo Contato"',
              desc: "O método alternativo para casos onde o contato direto é impossível.",
              valor: "R$47",
            },
            {
              emoji: "💬",
              title: 'BÔNUS 3: "Banco de Mensagens — 27 Mensagens Que Criam Reconexão"',
              desc: "Mensagens prontas, adaptáveis ao seu caso. Testadas em situações reais.",
              valor: "R$37",
            },
          ].map((b, i) => (
            <div key={i} style={{ ...S.card, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24 }}>{b.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: "#f1f1f3" }}>{b.title}</div>
                <div style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.5 }}>{b.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: "#6b7280", fontSize: 11, textDecoration: "line-through" }}>{b.valor}</div>
                <div style={{ color: "#84cc16", fontWeight: 700, fontSize: 12 }}>GRÁTIS</div>
              </div>
            </div>
          ))}

          {/* Resumo total */}
          <div style={{ ...S.card, borderColor: "#d97706", textAlign: "center", marginTop: 20, marginBottom: 24 }}>
            <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 4 }}>Valor total dos materiais</div>
            <div style={{ color: "#6b7280", fontSize: 18, textDecoration: "line-through", marginBottom: 4 }}>R$348</div>
            <div style={{ color: "#f59e0b", fontSize: 44, fontWeight: 900, lineHeight: 1 }}>R$37</div>
            <div style={{ color: "#84cc16", fontSize: 13, marginTop: 4 }}>Acesso imediato após a compra</div>
          </div>

          {/* CTA principal */}
          <button style={{ ...S.btnRed, marginBottom: 12, fontSize: 20, padding: "22px 24px" }} onClick={() => window.open("https://pay.kiwify.com.br/4fcrjeN", "_blank")}>
            🔥 QUERO MEU PROTOCOLO POR R$37
          </button>
          <button style={{ ...S.btn, fontSize: 14, padding: "14px 24px", marginBottom: 20 }} onClick={() => window.open("https://pay.kiwify.com.br/4fcrjeN", "_blank")}>
            👉 GARANTIR ACESSO IMEDIATO
          </button>

          {/* Garantia */}
          <div style={{ ...S.card, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛡️</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Garantia Total de 7 Dias</div>
            <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia. Você fica com os materiais de qualquer forma.
            </p>
          </div>

          {/* Segurança */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
            {["🔒 Pagamento Seguro", "⚡ Acesso Imediato", "📧 Enviado por Email"].map((item) => (
              <div key={item} style={{ color: "#6b7280", fontSize: 11, textAlign: "center" }}>{item}</div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Perguntas frequentes</h3>
            {[
              {
                q: "Funciona mesmo que ela tenha me bloqueado?",
                a: "Sim. O protocolo inclui uma seção específica para casos de bloqueio total, com ações alternativas que não dependem de contato direto.",
              },
              {
                q: "E se ela já estiver com outro?",
                a: "Essa situação é coberta pelo protocolo avançado incluído nos bônus. Funciona de forma diferente, mas temos casos de sucesso mesmo nessa situação.",
              },
              {
                q: "Em quanto tempo vou ver resultado?",
                a: "Os primeiros sinais costumam aparecer entre 48 horas e 21 dias, dependendo da situação. O protocolo tem fases específicas para cada período.",
              },
              {
                q: "Como recebo o material?",
                a: "Imediatamente após a compra, você recebe um email com o link de acesso. Tudo em PDF, pode ler no celular.",
              },
            ].map((item, i) => (
              <div key={i} style={{ ...S.card, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#f59e0b" }}>
                  {item.q}
                </div>
                <div style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>
              Você chegou até aqui porque ainda acredita que tem uma chance.<br />
              <strong style={{ color: "#fff" }}>Essa crença é o que vai fazer a diferença.</strong>
            </p>
            <button style={{ ...S.btnRed, fontSize: 18, padding: "20px 24px", marginBottom: 12 }} onClick={() => window.open("https://pay.kiwify.com.br/4fcrjeN", "_blank")}>
              🔥 SIM — QUERO MEU PROTOCOLO POR R$37
            </button>
            <p style={{ color: "#4b5563", fontSize: 11 }}>
              🔒 Compra 100% segura · Garantia de 7 dias sem questionamentos
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
