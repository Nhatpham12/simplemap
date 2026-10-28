#!/usr/bin/env node

/**
 * ==============================================================================
 * AI DEV PIPELINE: CODE -> REVIEW -> FIX -> TEST
 * ==============================================================================
 * An automated self-healing engineering loop:
 *   1. AI Coder      : Generates or updates code based on task requirements.
 *   2. AI Reviewer   : Audits quality, security vulnerabilities, edge cases.
 *   3. Test Runner   : Executes automated tests (Jest, RTL, Build, Lint).
 *   4. AI Fixer      : Self-heals failing tests or review blockers (re-loops).
 *
 * Requirements: Node.js >= 18 (Zero external npm dependencies needed).
 * Supported APIs: Google Gemini API, OpenAI / OpenRouter / Ollama.
 * ==============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// --- ANSI Colors for rich CLI experience ---
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgYellow: '\x1b[43m',
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
};

function banner(text, color = colors.cyan) {
  const line = '═'.repeat(70);
  console.log(`\n${color}${colors.bold}╔${line}╗`);
  console.log(`║  ${text.padEnd(68, ' ')}║`);
  console.log(`╚${line}╝${colors.reset}\n`);
}

function log(stage, message, color = colors.white) {
  const time = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${time}]${colors.reset} ${color}${colors.bold}[${stage}]${colors.reset} ${message}`);
}

// --- Load Configuration ---
const CONFIG_FILE = path.join(__dirname, 'config.json');
let config = {
  provider: 'gemini',
  geminiModel: 'gemini-2.5-flash',
  openaiModel: 'gpt-4o-mini',
  maxIterations: 3,
  testCommand: 'npm test -- --watchAll=false',
  buildCommand: 'npm run build',
  sourceDir: 'src',
  strictReview: false,
  autoApplyFix: true,
  verbose: true,
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  } catch (err) {
    log('CONFIG', `Warning: Unable to parse config.json, using defaults: ${err.message}`, colors.yellow);
  }
}

// --- CLI Argument Parsing ---
const args = process.argv.slice(2);
function getArg(key, fallback = null) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === `--${key}` && args[i + 1]) return args[i + 1];
    if (args[i].startsWith(`--${key}=`)) return args[i].split('=')[1];
  }
  return fallback;
}

const taskDesc = getArg('task') || args.filter((a) => !a.startsWith('--')).join(' ');
const activeStage = getArg('stage', 'all').toLowerCase(); // 'all', 'code', 'review', 'test', 'fix'
const isMock = args.includes('--mock') || (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY && !getArg('apiKey'));
const isDryRun = args.includes('--dry-run');
const customMaxIter = parseInt(getArg('max-iterations', config.maxIterations), 10);
const apiKey = getArg('apiKey') || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
if (getArg('test-cmd')) config.testCommand = getArg('test-cmd');

// --- Prompt Loader ---
function loadPrompt(promptName) {
  const filePath = path.join(__dirname, 'prompts', `${promptName}.prompt.md`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '';
}

// --- LLM Client (Gemini & OpenAI Compatible) ---
async function callLLM(systemPrompt, userPrompt) {
  if (isMock) {
    log('AI-CLIENT', 'Chạy ở chế độ MOCK (Không có API Key hoặc gắn cờ --mock)', colors.yellow);
    return getMockResponse(systemPrompt, userPrompt);
  }

  const provider = config.provider.toLowerCase();

  if (provider === 'gemini') {
    const model = config.geminiModel || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return cleanAndParseJSON(content);
  } else {
    // OpenAI Compatible API
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = config.openaiModel || 'gpt-4o-mini';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return cleanAndParseJSON(content);
  }
}

function cleanAndParseJSON(str) {
  if (!str) return null;
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/i, '');
  if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/i, '');
  if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/i, '');
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    log('PARSER', `Lỗi parse JSON: ${err.message}\nRaw string:\n${cleaned.slice(0, 300)}...`, colors.red);
    return null;
  }
}

// --- Helper: Read Git Diff or Modified Files ---
function getGitChanges() {
  return new Promise((resolve) => {
    exec('git diff HEAD', { cwd: PROJECT_ROOT }, (err, stdout) => {
      if (!err && stdout && stdout.trim().length > 0) {
        return resolve({ type: 'diff', content: stdout });
      }
      // If no git diff, read files in src/
      const srcDir = path.join(PROJECT_ROOT, config.sourceDir);
      let fileList = [];
      try {
        if (fs.existsSync(srcDir)) {
          fileList = fs.readdirSync(srcDir).filter((f) => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx'));
        }
      } catch (e) {}

      let combined = '';
      for (const f of fileList.slice(0, 5)) {
        const full = path.join(srcDir, f);
        combined += `\n--- File: ${config.sourceDir}/${f} ---\n` + fs.readFileSync(full, 'utf8').slice(0, 1500);
      }
      resolve({ type: 'files', content: combined || 'No files scanned.' });
    });
  });
}

// --- Helper: Command Execution for Tests ---
function runCommand(command, cwd = PROJECT_ROOT, timeout = 30000) {
  return new Promise((resolve) => {
    log('EXEC', `Running: ${command}`, colors.dim);
    exec(command, { cwd, timeout, env: { ...process.env, CI: 'true', BROWSER: 'none' } }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        code: error ? error.code || 1 : 0,
        stdout: stdout ? stdout.trim() : '',
        stderr: stderr ? stderr.trim() : '',
      });
    });
  });
}

// --- Apply File Changes ---
function applyFileChanges(files) {
  if (!Array.isArray(files)) return;
  for (const item of files) {
    const targetPath = path.isAbsolute(item.path) ? item.path : path.join(PROJECT_ROOT, item.path);
    if (isDryRun) {
      log('DRY-RUN', `[${item.action.toUpperCase()}] ${item.path} (${item.content?.length || 0} bytes)`, colors.yellow);
      continue;
    }
    if (item.action === 'delete') {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        log('FS', `Deleted: ${item.path}`, colors.red);
      }
    } else {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(targetPath, item.content, 'utf8');
      log('FS', `Updated/Created: ${item.path}`, colors.green);
    }
  }
}

// ==============================================================================
// PIPELINE STAGES
// ==============================================================================

// --- STAGE 1: AI CODER ---
async function stageCoder(task) {
  banner('STAGE 1: 🚀 AI CODE GENERATION', colors.blue);
  log('CODER', `Đang phân tích và sinh mã nguồn cho task: "${task}"`, colors.cyan);

  const systemPrompt = loadPrompt('coder');
  const userPrompt = `
Task Requirement:
${task}

Current Context:
Target Root: ${PROJECT_ROOT}
Source Directory: ${config.sourceDir}
Please generate the required files or modifications in JSON format.
`;

  const result = await callLLM(systemPrompt, userPrompt);
  if (!result || !result.files) {
    log('CODER', 'Không nhận được danh sách file từ AI Coder.', colors.red);
    return false;
  }

  console.log(`\n${colors.bold}📝 Summary from Coder:${colors.reset} ${result.summary}\n`);
  applyFileChanges(result.files);
  return true;
}

// --- STAGE 2: AI REVIEWER ---
async function stageReviewer() {
  banner('STAGE 2: 🔍 AI CODE REVIEW (QUALITY & SECURITY)', colors.yellow);
  log('REVIEW', 'Đang thu thập diff và kiểm tra chất lượng code...', colors.yellow);

  const changes = await getGitChanges();
  const systemPrompt = loadPrompt('reviewer');
  const userPrompt = `
Code changes to review (${changes.type}):
${changes.content.slice(0, 8000)}

Review strictly against:
1. Logic, boundary checks, null handling.
2. Security vulnerabilities (OWASP, injection, token exposure).
3. Code style, React hooks dependencies, clean code.
Output your evaluation in JSON.
`;

  const result = await callLLM(systemPrompt, userPrompt);
  if (!result) {
    log('REVIEW', 'Không nhận được kết quả review hợp lệ từ AI Reviewer.', colors.red);
    return { status: 'CHANGES_REQUESTED', score: 0, issues: [] };
  }

  const statusColor = result.status === 'APPROVED' ? colors.green : colors.red;
  console.log(`\n${colors.bold}📊 Review Score:${colors.reset} ${result.score}/10 | ${statusColor}${colors.bold}Status: ${result.status}${colors.reset}`);
  console.log(`${colors.bold}📋 Summary:${colors.reset} ${result.summary}\n`);

  if (result.issues && result.issues.length > 0) {
    console.log(`${colors.bold}Issues Found (${result.issues.length}):${colors.reset}`);
    for (const issue of result.issues) {
      const sevColor = issue.severity === 'BLOCKER' ? colors.red : issue.severity === 'WARNING' ? colors.yellow : colors.dim;
      console.log(`  ${sevColor}[${issue.severity}]${colors.reset} ${issue.file || 'General'}:${issue.line || 0} - ${issue.description}`);
      if (issue.recommendation) {
        console.log(`    💡 Fix suggestion: ${issue.recommendation}`);
      }
    }
  }

  return result;
}

// --- STAGE 3: AUTOMATED TEST RUNNER ---
async function stageTester() {
  banner('STAGE 3: 🧪 AUTOMATED TEST & VERIFICATION', colors.cyan);
  log('TEST', `Executing test suite: "${config.testCommand}"`, colors.cyan);

  const testResult = await runCommand(config.testCommand);

  if (testResult.success) {
    log('TEST', `✅ All tests passed! (Exit code: 0)`, colors.green);
    return { passed: true, output: testResult.stdout };
  } else {
    log('TEST', `❌ Test failed! (Exit code: ${testResult.code})`, colors.red);
    const failureSnippet = (testResult.stderr || testResult.stdout).slice(-1500);
    console.log(`\n${colors.red}${colors.bold}--- Test Error Snippet ---${colors.reset}\n${failureSnippet}\n`);
    return { passed: false, output: failureSnippet };
  }
}

// --- STAGE 4: AI SELF-HEALING FIXER ---
async function stageFixer(reviewIssues, testError) {
  banner('STAGE 4: 🔧 AI SELF-HEALING FIX (AUTO-DEBUG)', colors.magenta);
  log('FIXER', 'Phân tích nguyên nhân gốc (RCA) và tự động tạo bản sửa lỗi...', colors.magenta);

  const systemPrompt = loadPrompt('fixer');
  const userPrompt = `
Issues to resolve:
1. Reviewer Feedback:
${JSON.stringify(reviewIssues, null, 2)}

2. Test Error Output:
${testError || 'None'}

Please inspect the failure, identify the root cause, and return the modified files in JSON format.
`;

  const result = await callLLM(systemPrompt, userPrompt);
  if (!result || !result.files) {
    log('FIXER', 'AI Fixer không tạo được file sửa lỗi.', colors.red);
    return false;
  }

  console.log(`\n${colors.bold}🔍 Root Cause:${colors.reset} ${result.rootCause}`);
  console.log(`${colors.bold}🛠️ Fix Applied:${colors.reset} ${result.fixSummary}\n`);

  applyFileChanges(result.files);
  return true;
}

// ==============================================================================
// MOCK / DEMO SIMULATOR
// ==============================================================================
function getMockResponse(systemPrompt, userPrompt) {
  if (systemPrompt.includes('CODER')) {
    return {
      summary: 'Tạo component MapControls và cấu hình leaflet controls',
      files: [
        {
          path: 'src/components/MapControls.js',
          action: 'create',
          content: `import React from 'react';\n\nexport default function MapControls({ onZoomIn, onZoomOut, onReset }) {\n  return (\n    <div className="map-controls" style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, background: '#fff', padding: 8, borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>\n      <button onClick={onZoomIn} style={{ margin: '0 4px', padding: '4px 8px' }}>+</button>\n      <button onClick={onZoomOut} style={{ margin: '0 4px', padding: '4px 8px' }}>-</button>\n      <button onClick={onReset} style={{ margin: '0 4px', padding: '4px 8px' }}>Reset</button>\n    </div>\n  );\n}\n`,
        },
      ],
    };
  } else if (systemPrompt.includes('REVIEWER')) {
    return {
      status: 'APPROVED',
      score: 9,
      summary: 'Code rõ ràng, không có rủi ro bảo mật hoặc memory leak. Component độc lập và dễ kiểm thử.',
      issues: [
        {
          severity: 'SUGGESTION',
          file: 'src/components/MapControls.js',
          line: 4,
          description: 'Nên thêm aria-label cho các button để hỗ trợ accessibility (a11y).',
          recommendation: 'Thêm aria-label="Phóng to", aria-label="Thu nhỏ"',
        },
      ],
    };
  } else if (systemPrompt.includes('FIXER')) {
    return {
      rootCause: 'Thêm props aria-label cho accessibility theo góp ý review',
      fixSummary: 'Cập nhật MapControls.js với aria-label chuẩn',
      files: [
        {
          path: 'src/components/MapControls.js',
          action: 'modify',
          content: `import React from 'react';\n\nexport default function MapControls({ onZoomIn, onZoomOut, onReset }) {\n  return (\n    <div className="map-controls" style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, background: '#fff', padding: 8, borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>\n      <button onClick={onZoomIn} aria-label="Phóng to" style={{ margin: '0 4px', padding: '4px 8px' }}>+</button>\n      <button onClick={onZoomOut} aria-label="Thu nhỏ" style={{ margin: '0 4px', padding: '4px 8px' }}>-</button>\n      <button onClick={onReset} aria-label="Khôi phục góc nhìn" style={{ margin: '0 4px', padding: '4px 8px' }}>Reset</button>\n    </div>\n  );\n}\n`,
        },
      ],
    };
  }
  return { status: 'OK' };
}

// ==============================================================================
// MAIN ORCHESTRATION LOOP
// ==============================================================================
async function main() {
  banner('🤖 AI DEVELOPMENT PIPELINE: CODE -> REVIEW -> FIX -> TEST', colors.magenta);
  log('INIT', `Chế độ thực thi: ${colors.bold}${activeStage.toUpperCase()}${colors.reset} | Provider: ${config.provider} | Mock: ${isMock}`);

  const startTime = Date.now();

  try {
    // Single-stage commands:
    if (activeStage === 'review') {
      await stageReviewer();
      return;
    }
    if (activeStage === 'test') {
      await stageTester();
      return;
    }
    if (activeStage === 'code') {
      if (!taskDesc) {
        log('ERROR', 'Vui lòng cung cấp task bằng cú pháp: --task "Mô tả tính năng"', colors.red);
        process.exit(1);
      }
      await stageCoder(taskDesc);
      return;
    }

    // Full Pipeline Loop:
    if (taskDesc) {
      await stageCoder(taskDesc);
    } else {
      log('INFO', 'Không có task mới, chạy Review & Test trên code hiện tại...', colors.yellow);
    }

    let iteration = 1;
    let allPassed = false;

    while (iteration <= customMaxIter) {
      console.log(`\n${colors.bold}${colors.bgBlue} >>> VÒNG LẶP KIỂM TRA & TỰ SỬA LỖI (ITERATION ${iteration}/${customMaxIter}) <<< ${colors.reset}\n`);

      // 1. Review stage
      const reviewResult = await stageReviewer();

      // 2. Test stage
      const testResult = await stageTester();

      const reviewPassed = reviewResult.status === 'APPROVED' || (!config.strictReview && reviewResult.score >= 7);
      const testsPassed = testResult.passed;

      if (reviewPassed && testsPassed) {
        allPassed = true;
        banner('🎉 PIPELINE THÀNH CÔNG: CODE ĐÃ ĐẠT CHUẨN REVIEW & TEST PASS!', colors.green);
        break;
      }

      // If failed, trigger Fixer
      log('LOOP', `Phát hiện lỗi (Review: ${reviewPassed ? 'PASS' : 'FAIL'}, Test: ${testsPassed ? 'PASS' : 'FAIL'}).`, colors.yellow);

      if (iteration < customMaxIter) {
        log('LOOP', `Kích hoạt AI Fixer để tự động sửa chữa...`, colors.magenta);
        const fixed = await stageFixer(reviewResult.issues || [], testsPassed ? '' : testResult.output);
        if (!fixed) {
          log('LOOP', 'AI Fixer không thể xử lý lỗi. Dừng pipeline.', colors.red);
          break;
        }
      } else {
        log('LOOP', `Đã đạt giới hạn tối đa ${customMaxIter} lần lặp. Cần sự can thiệp của lập trình viên.`, colors.red);
      }

      iteration++;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n${colors.bold}⏱️ Thời gian thực thi:${colors.reset} ${duration}s`);
    if (!allPassed) {
      process.exitCode = 1;
    }
  } catch (err) {
    log('FATAL', `Pipeline gặp sự cố ngoại lệ: ${err.message}`, colors.red);
    console.error(err);
    process.exitCode = 1;
  }
}

main();
