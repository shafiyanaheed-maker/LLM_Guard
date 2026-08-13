# LLM-Guard: Generative AI Prompt Firewall

## Overview

LLM-Guard is a cybersecurity solution designed to secure Large Language Model (LLM) applications by detecting and preventing malicious prompts, prompt injection attacks, AI-based threats, and sensitive data leakage.

The project works as a prompt security layer that analyzes user inputs and helps protect LLM applications from potential security risks.

---

## Objectives

- Detect malicious and unsafe prompts
- Prevent prompt injection attacks
- Identify AI-based security threats
- Protect sensitive information from leakage
- Improve security and reliability of LLM applications

---

## Key Modules

### 1. Prompt Firewall
- Analyzes incoming prompts
- Detects suspicious or harmful instructions
- Helps prevent unsafe LLM interactions

### 2. AI Threat Detection
- Identifies potential AI-based security threats
- Detects malicious prompt patterns
- Validates suspicious inputs

### 3. Data Loss Prevention (DLP)
- Detects sensitive information exposure
- Helps prevent unauthorized data leakage
- Validates secure handling of user inputs

---

## Technology Stack

### Backend
- Python
- FastAPI

### Frontend
- React

### Security Components
- Prompt Firewall
- AI Threat Detection
- Data Loss Prevention (DLP)

---

## Team Members

| Name      | Role                                                                                        |
|-----------|---------------------------------------------------------------------------------------------|
| Shaafiya  | Team Lead, Project Planning, Module Integration, Code Review, Documentation & Submission    |
| Srikanth  | Backend Development, API Integration & Configuration                                        |
| Vaishnavi | Frontend Development & UI Enhancement                                                       |
| Vyshnavi  | DLP Module Testing, Test Case Preparation & Validation                                      |
| Vamsi     | AI Threat Detection Testing & Validation                                                    |
| Anshika   | Final Testing & Quality Validation                                                          |

---

## Project Workflow

1. Project Planning and Requirement Analysis
2. Module Integration and Enhancement
3. Security Testing and Validation
4. Documentation Preparation
5. Final Review and Submission

---

## Project Status

Under Development

---

## Future Improvements

- Enhanced threat detection accuracy
- Additional security rules for prompt analysis
- Improved testing coverage
- Better monitoring and reporting features

## Latest Findings (Run: 20260812_205027)

Overall detection rate: **84.4%** (27/32 attacks blocked).

| Category | Detection Rate |
|---|---|
| dan_attack | 100% |
| data_exfiltration | 100% |
| jailbreak | **16.7%** ⚠️ |
| prompt_injection | 100% |
| role_manipulation | 100% |
| system_prompt_extraction | 100% |

**Key finding:** The `jailbreak` category is the weakest area — 5 of 6 attacks
bypassed the guard using techniques like hypothetical framing, authority
override, and translation bypass. See `report/vulnerability_findings_20260812_205027.md`
for the full breakdown and suggested owner files.

Dataset has since been expanded with 4 additional jailbreak variants
(JB-007 to JB-010) to test whether fixes hold up against similar patterns.