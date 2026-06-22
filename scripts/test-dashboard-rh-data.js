#!/usr/bin/env node
/* eslint-disable no-console */

const axios = require("axios");

const API = process.env.API_URL || "http://localhost:3334";
const COMPANY_ID = "a1000000-0000-4000-8000-000000000001";
const EMAIL = "teste.empresa@prepara.me";
const PASSWORD = "Teste@123";

const results = [];

function pass(name, detail) {
  results.push({ status: "PASS", name, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  results.push({ status: "FAIL", name, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function warn(name, detail) {
  results.push({ status: "WARN", name, detail });
  console.warn(`! ${name}${detail ? ` — ${detail}` : ""}`);
}

function encodeFilter(name, values) {
  return `${name}=${encodeURIComponent(JSON.stringify(values))}`;
}

async function login() {
  const { data } = await axios.post(`${API}/sessions`, {
    email: EMAIL,
    password: PASSWORD,
  });

  const token = data.token || data.accessToken;

  if (!token) {
    throw new Error("Login sem token na resposta");
  }

  return token;
}

async function getReport(token, filters) {
  const params = filters
    .filter((f) => f.model !== undefined && f.model !== null && f.model !== "")
    .map((f) => `${f.name}=${encodeURIComponent(f.model)}`)
    .join("&");

  const url = `${API}/reports/npsSurveyAnswers${params ? `?${params}` : ""}`;
  const { data } = await axios.get(url, {
    headers: { authorization: `Bearer ${token}` },
  });

  return data;
}

async function getConfig(token) {
  const { data } = await axios.get(`${API}/companies/config/${COMPANY_ID}`, {
    headers: { authorization: `Bearer ${token}` },
  });

  return data;
}

function assertNotNaMetric(label, value) {
  if (value === undefined || value === null || value === "" || value === "N/A") {
    fail(label, `valor inválido: ${value}`);
    return false;
  }

  pass(label, String(value));
  return true;
}

async function main() {
  console.log(`\n=== Teste de dados Dashboard RH ===`);
  console.log(`API: ${API}`);
  console.log(`Empresa: ${COMPANY_ID}\n`);

  let token;

  try {
    token = await login();
    pass("Login RH", EMAIL);
  } catch (error) {
    fail("Login RH", error.message);
    printSummary();
    process.exit(1);
  }

  let config;

  try {
    config = await getConfig(token);
    const areas = config.area || [];
    const periods = config.period || [];

    pass("Config empresa", `${areas.length} áreas, ${periods.length} períodos`);

    if (periods.length < 2) {
      warn(
        "Períodos para timeline",
        `apenas ${periods.length} — gráfico de evolução precisa de ≥2 meses`
      );
    } else {
      pass("Períodos para timeline", periods.join(" | "));
    }

    if (!areas.includes("Operações") || !areas.includes("Tecnologia")) {
      fail(
        "Áreas seed",
        `esperado Operações e Tecnologia; recebido: ${areas.join(", ")}`
      );
    } else {
      pass("Áreas seed", "Operações e Tecnologia disponíveis");
    }
  } catch (error) {
    fail("Config empresa", error.response?.data?.message || error.message);
    printSummary();
    process.exit(1);
  }

  try {
    const baseline = await getReport(token, [
      { name: "companyId", model: COMPANY_ID },
    ]);

    assertNotNaMetric("Baseline e-NPS", baseline.nps);
    pass("Baseline lessThanFive", String(baseline.lessThanFive));
    pass(
      "Baseline shutDown",
      `${(baseline.shutDown || []).length} perguntas pós-demissão`
    );
    pass(
      "Baseline feelingMap",
      `${(baseline.feelingMap || []).length} sentimentos`
    );

    if (baseline.lessThanFive) {
      warn(
        "Baseline lessThanFive",
        "true — COMPANY_ADMIN deveria bypass; verificar seed/respostas"
      );
    }
  } catch (error) {
    fail("Relatório baseline", error.response?.data?.message || error.message);
  }

  try {
    const operacoes = await getReport(token, [
      { name: "companyId", model: COMPANY_ID },
      { name: "area", model: JSON.stringify(["Operações"]) },
    ]);

    const tecnologia = await getReport(token, [
      { name: "companyId", model: COMPANY_ID },
      { name: "area", model: JSON.stringify(["Tecnologia"]) },
    ]);

    assertNotNaMetric("Filtro Operações e-NPS", operacoes.nps);
    assertNotNaMetric("Filtro Tecnologia e-NPS", tecnologia.nps);

    if (operacoes.nps !== tecnologia.nps) {
      pass(
        "Comparativo áreas distintas",
        `Operações=${operacoes.nps} vs Tecnologia=${tecnologia.nps}`
      );
    } else {
      warn(
        "Comparativo áreas distintas",
        `mesmo e-NPS (${operacoes.nps}) — seed pode ter valores iguais`
      );
    }

    if (operacoes.lessThanFive || tecnologia.lessThanFive) {
      fail(
        "COMPANY_ADMIN bypass filtros",
        `lessThanFive Operações=${operacoes.lessThanFive}, Tecnologia=${tecnologia.lessThanFive}`
      );
    } else {
      pass("COMPANY_ADMIN bypass filtros", "lessThanFive=false com filtro de área");
    }
  } catch (error) {
    fail("Comparativo por área", error.response?.data?.message || error.message);
  }

  try {
    const periods = (config.period || []).slice(0, 3);
    const timelinePoints = [];

    for (const period of periods) {
      const report = await getReport(token, [
        { name: "companyId", model: COMPANY_ID },
        { name: "area", model: JSON.stringify(["Operações"]) },
        { name: "period", model: JSON.stringify([period]) },
      ]);

      timelinePoints.push({
        period,
        nps: report.nps,
      });
    }

    pass(
      "Timeline por mês (Operações)",
      timelinePoints
        .map((p) => `${p.period.split(" ")[0]}=${p.nps}`)
        .join(" → ")
    );

    const rawValues = timelinePoints.map((p) =>
      p.nps === "N/A" || !p.nps ? null : Number(String(p.nps).replace("%", ""))
    );

    let last = null;
    const filled = rawValues.map((v) => {
      if (v !== null && !Number.isNaN(v)) {
        last = v;
        return v;
      }

      return last;
    });

    if (filled.some((v) => v !== null) && filled.filter((v) => v !== null).length >= 1) {
      pass("Forward-fill simulado", filled.map((v) => (v === null ? "null" : v)).join(" → "));
    }
  } catch (error) {
    fail("Timeline por mês", error.response?.data?.message || error.message);
  }

  printSummary();
  process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
}

function printSummary() {
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warnings = results.filter((r) => r.status === "WARN").length;

  console.log(`\n--- Resumo: ${passed} ok, ${failed} falha(s), ${warnings} aviso(s) ---\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
