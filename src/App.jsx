import { useState } from "react";

const TAREFAS = [
  {
    id: 1,
    fase: "Configuração",
    faseEmoji: "⚙️",
    titulo: "Instalar e testar o Leap Motion",
    dificuldade: 2,
    tempoTotal: "1–2 dias",
    descricao: "Configurar o ambiente de desenvolvimento e confirmar que o sensor funciona corretamente.",
    subs: [
      { titulo: "Baixar e instalar Ultraleap Gemini SDK", tempo: "30 min", dif: 1 },
      { titulo: "Instalar Python 3.10+ e pip", tempo: "20 min", dif: 1 },
      { titulo: "Instalar bibliotecas: numpy, scikit-learn, pyttsx3", tempo: "15 min", dif: 1 },
      { titulo: "Rodar o visualizador oficial do Leap Motion", tempo: "20 min", dif: 2 },
      { titulo: "Confirmar detecção dos 27 joints no terminal Python", tempo: "1–2 h", dif: 2 },
    ],
  },
  {
    id: 2,
    fase: "Coleta de dados",
    faseEmoji: "🖐️",
    titulo: "Gravar gestos com coletor.py",
    dificuldade: 2,
    tempoTotal: "3–4 dias",
    descricao: "Executar o coletor e gravar no mínimo 30 amostras por sinal para cada membro do grupo.",
    subs: [
      { titulo: "Definir lista de 15 sinais alvo (ex: socorro, água, dor…)", tempo: "1 h", dif: 1 },
      { titulo: "Entender o formato do CSV e as colunas de joints", tempo: "30 min", dif: 2 },
      { titulo: "Coletar 30+ amostras por sinal — membro 1", tempo: "1 dia", dif: 1 },
      { titulo: "Coletar 30+ amostras por sinal — membro 2", tempo: "1 dia", dif: 1 },
      { titulo: "Coletar 30+ amostras por sinal — membro 3", tempo: "1 dia", dif: 1 },
      { titulo: "Verificar balanceamento do dataset (contagem por sinal)", tempo: "30 min", dif: 1 },
      { titulo: "Coletar amostras extras nos sinais com menos dados", tempo: "2 h", dif: 1 },
    ],
  },
  {
    id: 3,
    fase: "Modelo ML",
    faseEmoji: "🧠",
    titulo: "Treinar o classificador com treinar.py",
    dificuldade: 4,
    tempoTotal: "2–3 dias",
    descricao: "Entender a extração de features geométricas e interpretar as métricas de acurácia do modelo.",
    subs: [
      { titulo: "Ler e entender a função extrair_features() no código", tempo: "2 h", dif: 3 },
      { titulo: "Rodar treinar.py e analisar o relatório gerado", tempo: "1 h", dif: 2 },
      { titulo: "Interpretar a matriz de confusão: quais sinais se confundem?", tempo: "1 h", dif: 3 },
      { titulo: "Se acurácia < 80%: coletar mais amostras e retreinar", tempo: "1 dia", dif: 3 },
      { titulo: "Ajustar parâmetros do Random Forest (n_estimators, etc.)", tempo: "2 h", dif: 4 },
      { titulo: "Atingir ≥ 85% de acurácia e salvar modelo_libras.pkl", tempo: "1–2 h", dif: 2 },
    ],
  },
  {
    id: 4,
    fase: "Aplicativo",
    faseEmoji: "💻",
    titulo: "Rodar e personalizar o app.py",
    dificuldade: 3,
    tempoTotal: "2–3 dias",
    descricao: "Executar o aplicativo principal, ajustar parâmetros de reconhecimento e personalizar a interface.",
    subs: [
      { titulo: "Rodar app.py e testar reconhecimento em tempo real", tempo: "1 h", dif: 2 },
      { titulo: "Ajustar CONFIANCA_MINIMA e FRAMES_CONFIRMACAO para reduzir falsos positivos", tempo: "2 h", dif: 3 },
      { titulo: "Testar síntese de voz em português (pyttsx3)", tempo: "30 min", dif: 2 },
      { titulo: "Personalizar cores e nome do projeto na interface", tempo: "1 h", dif: 2 },
      { titulo: "Testar com pessoas que não participaram da coleta de dados", tempo: "1 dia", dif: 2 },
      { titulo: "Documentar limitações encontradas (para a apresentação)", tempo: "1 h", dif: 1 },
    ],
  },
  {
    id: 5,
    fase: "Apresentação",
    faseEmoji: "🎤",
    titulo: "Preparar bancada e roteiro para a feira",
    dificuldade: 2,
    tempoTotal: "2–3 dias",
    descricao: "Montar a bancada, preparar os cartazes e ensaiar o roteiro de 5 minutos para os avaliadores.",
    subs: [
      { titulo: "Montar suporte do Leap Motion na mesa de demonstração", tempo: "1 h", dif: 1 },
      { titulo: "Criar cartaz: problema → solução → impacto (dados IBGE)", tempo: "3 h", dif: 2 },
      { titulo: "Criar cartaz: como o sistema funciona (diagrama de fluxo)", tempo: "2 h", dif: 2 },
      { titulo: "Criar cartaz: resultados — gráfico de acurácia do modelo", tempo: "2 h", dif: 2 },
      { titulo: "Ensaiar demonstração ao vivo com visitante voluntário", tempo: "2 h", dif: 1 },
      { titulo: "Preparar respostas para perguntas técnicas da banca", tempo: "2 h", dif: 3 },
      { titulo: "Teste geral: notebook + Leap + alto-falante na bancada", tempo: "1 h", dif: 1 },
    ],
  },
];

const difLabel = [null, "Muito fácil", "Fácil", "Médio", "Difícil", "Muito difícil"];
const difColor = [null, "#4ade80", "#86efac", "#fbbf24", "#fb923c", "#f87171"];
const difBg   = [null, "#052e16", "#052e16", "#422006", "#431407", "#450a0a"];

function DifBadge({ nivel }) {
  return (
    <span style={{
      background: difBg[nivel],
      color: difColor[nivel],
      border: `1px solid ${difColor[nivel]}40`,
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 10px",
      whiteSpace: "nowrap",
    }}>
      {"★".repeat(nivel) + "☆".repeat(5 - nivel)} {difLabel[nivel]}
    </span>
  );
}

function BarraDif({ nivel }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 18, height: 6, borderRadius: 3,
          background: i <= nivel ? difColor[nivel] : "#1e293b",
          transition: "background 0.2s",
        }} />
      ))}
    </div>
  );
}

function SubTarefa({ sub, feito, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "8px 10px", borderRadius: 8, cursor: "pointer",
        background: feito ? "#0f2918" : "#0f172a",
        border: `1px solid ${feito ? "#166534" : "#1e293b"}`,
        marginBottom: 6, transition: "all 0.15s ease",
      }}
      className="sub-tarefa"
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4, minWidth: 18, marginTop: 1,
        border: `2px solid ${feito ? "#4ade80" : "#334155"}`,
        background: feito ? "#4ade80" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease"
      }}>
        {feito && <span style={{ color: "#052e16", fontSize: 12, fontWeight: 900 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: 14, color: feito ? "#4ade80" : "#e2e8f0",
          textDecoration: feito ? "line-through" : "none",
          opacity: feito ? 0.6 : 1,
          transition: "all 0.2s ease"
        }}>
          {sub.titulo}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>⏱ {sub.tempo}</span>
        <DifBadge nivel={sub.dif} />
      </div>
    </div>
  );
}

function CartaoFase({ tarefa, aberta, onToggle, completedTasks, toggleTask }) {
  const totalSubs = tarefa.subs.length;
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 14,
      marginBottom: 16,
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: aberta ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)" : "none",
      transform: aberta ? "translateY(-2px)" : "none",
    }}>
      {/* Cabeçalho clicável */}
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 18px", cursor: "pointer",
          background: aberta ? "#111827" : "#0f172a",
          transition: "background 0.3s ease"
        }}
        className="fase-header"
      >
        <span style={{ fontSize: 26, filter: aberta ? "drop-shadow(0 0 8px rgba(255,255,255,0.2))" : "none", transition: "all 0.3s ease" }}>
          {tarefa.faseEmoji}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Fase {tarefa.id} — {tarefa.fase}
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc", marginTop: 2 }}>
            {tarefa.titulo}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
            <DifBadge nivel={tarefa.dificuldade} />
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>⏱ {tarefa.tempoTotal}</span>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{totalSubs} subtarefas</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <BarraDif nivel={tarefa.dificuldade} />
          <span style={{ 
            fontSize: 18, color: "#475569", 
            transform: aberta ? "rotate(180deg)" : "none", 
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
          }}>
            ▾
          </span>
        </div>
      </div>

      {/* Conteúdo expansível */}
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: aberta ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: "4px 18px 18px", borderTop: "1px solid #1e293b" }}>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: "12px 0 16px", lineHeight: 1.6 }}>
              {tarefa.descricao}
            </p>
            {tarefa.subs.map((sub, i) => {
              const taskId = `${tarefa.id}-${i}`;
              return (
                <SubTarefa 
                  key={i} 
                  sub={sub} 
                  feito={completedTasks.has(taskId)}
                  onToggle={() => toggleTask(taskId)}
                />
              );
            })}
            <p style={{ fontSize: 12, color: "#475569", marginTop: 12, textAlign: "center" }}>
              Clique em cada subtarefa para marcar como concluída.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanoEquipe() {
  const [abertas, setAbertas] = useState({ 1: true });
  const [filtro, setFiltro] = useState("todos");
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggle = (id) => setAbertas(a => ({ ...a, [id]: !a[id] }));

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const tarefasFiltradas = TAREFAS.filter(t => {
    if (filtro === "todos") return true;
    if (filtro === "facil") return t.dificuldade <= 2;
    if (filtro === "medio") return t.dificuldade === 3;
    if (filtro === "dificil") return t.dificuldade >= 4;
    return true;
  });

  const totalDias = "12–18 dias";
  const totalTarefas = TAREFAS.reduce((a, t) => a + t.subs.length, 0);
  const tarefasRestantes = totalTarefas - completedTasks.size;

  return (
    <div style={{ 
      background: "radial-gradient(circle at top left, #051429 0%, #020617 100%)", 
      minHeight: "100vh", 
      padding: "32px 20px", 
      fontFamily: "'Inter', system-ui, sans-serif" 
    }}>
      {/* Cabeçalho */}
      <div style={{ maxWidth: 720, margin: "0 auto 32px" }}>
        <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, textShadow: "0 0 10px rgba(56, 189, 248, 0.3)" }}>
          Feira de Ciências — Robótica &amp; Saúde
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          Plano de Projeto — 1 Equipe
        </h1>
        <p style={{ fontSize: 15, color: "#94a3b8", margin: 0, fontWeight: 400 }}>
          Tradutor de Libras com Leap Motion · Python + Machine Learning
        </p>

        {/* Resumo */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          {[
            { label: "Fases", valor: "5" },
            { label: "Restantes", valor: String(tarefasRestantes) },
            { label: "Tempo total", valor: totalDias },
            { label: "Dificuldade", valor: "Médio" },
          ].map(item => (
            <div key={item.label} style={{
              background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(30, 41, 59, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 12, padding: "12px 16px", flex: "1 1 120px", minWidth: 120,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{item.valor}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          {[
            { id: "todos", label: "Todas as fases" },
            { id: "facil", label: "⭐ Fáceis" },
            { id: "medio", label: "⭐⭐⭐ Médias" },
            { id: "dificil", label: "⭐⭐⭐⭐ Difíceis" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                padding: "8px 16px", borderRadius: 24, fontSize: 13, cursor: "pointer",
                border: `1px solid ${filtro === f.id ? "#38bdf8" : "rgba(30, 41, 59, 0.8)"}`,
                background: filtro === f.id ? "rgba(12, 46, 69, 0.8)" : "rgba(15, 23, 42, 0.6)",
                color: filtro === f.id ? "#38bdf8" : "#94a3b8",
                fontWeight: filtro === f.id ? 600 : 500,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(4px)",
                boxShadow: filtro === f.id ? "0 0 12px rgba(56, 189, 248, 0.2)" : "none"
              }}
              className="filter-btn"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cartões */}
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {tarefasFiltradas.map(t => (
          <CartaoFase
            key={t.id}
            tarefa={t}
            aberta={!!abertas[t.id]}
            onToggle={() => toggle(t.id)}
            completedTasks={completedTasks}
            toggleTask={toggleTask}
          />
        ))}

        {/* Legenda */}
        <div style={{
          background: "rgba(15, 23, 42, 0.4)", border: "1px dashed #1e293b",
          borderRadius: 14, padding: "16px 20px", marginTop: 16,
        }}>
          <p style={{ fontSize: 12, color: "#475569", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Legenda de dificuldade
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: difColor[n], boxShadow: `0 0 6px ${difColor[n]}60` }} />
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{difLabel[n]}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 14, fontStyle: "italic" }}>
            Dica: Começar pela fase 1 (configuração) antes de qualquer outra. As fases 2 e 3 podem ser intercaladas.
          </p>
        </div>
      </div>
    </div>
  );
}
