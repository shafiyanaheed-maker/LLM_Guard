# LLM-Guard: Generative AI Prompt Firewall

## Overview

LLM-Guard is a security layer designed to protect Large Language Model (LLM) applications from prompt-based attacks, malicious inputs, sensitive data leakage, and other AI security threats.

The system acts as a security gateway between users and an LLM application. It analyzes incoming prompts, detects suspicious behavior, calculates security risk, applies security controls, and validates responses before they are returned to the user.

LLM-Guard combines rule-based detection, machine-learning-based threat detection, authentication, rate limiting, Data Loss Prevention (DLP), output validation, logging, monitoring, and red-team security testing.

---

## Objectives

* Detect prompt injection and jailbreak attempts
* Identify malicious and suspicious prompts
* Calculate security risk associated with incoming requests
* Protect sensitive information using DLP controls
* Validate LLM responses for potential information leakage
* Enforce authentication and authorization
* Apply request/rate-limiting controls
* Monitor security events through logs and analytics
* Test the security pipeline using automated red-team attacks
* Provide a dashboard for security monitoring and prompt testing

---

## Key Features

### 1. Prompt Firewall

The Prompt Firewall analyzes incoming prompts before they reach the LLM.

It helps identify:

* Prompt injection
* Jailbreak attempts
* Role manipulation
* System prompt extraction
* Data exfiltration attempts
* Suspicious or blocked keywords
* Excessively long prompts

---

### 2. Prompt Injection Detection

LLM-Guard contains dedicated detection logic for multiple attack categories, including:

* Prompt Injection
* System Prompt Leakage
* Jailbreak Attempts
* Role Manipulation
* Data Exfiltration

The detection pipeline can identify malicious patterns before the request is forwarded to the LLM.

---

### 3. Risk Analysis

Detected prompts are evaluated using the project's risk calculation pipeline.

The dashboard exposes information such as:

* Risk score
* Risk level
* Request status
* Injection detection result
* DLP detection result

---

### 4. Data Loss Prevention (DLP)

The DLP layer helps detect sensitive information and prevent accidental or unauthorized exposure.

It is also integrated with output validation to help identify sensitive information in LLM responses.

---

### 5. Output Validation

LLM responses are validated before being returned to the user.

The output validation layer works with centralized DLP patterns to help detect potential sensitive-data leakage from generated responses.

---

### 6. Authentication & Security

The project includes authentication and security controls for protecting API endpoints.

Security functionality includes:

* Token-based authentication
* Role-based access handling
* Authentication validation
* Session/security checks
* Request authorization

Security regression tests are included in the project test suite.

---

### 7. Rate Limiting

LLM-Guard includes request-rate limiting to help prevent excessive or abusive requests from overwhelming the protected application.

---

### 8. Security Logging & Monitoring

Security events and requests are logged for monitoring and analysis.

The frontend provides monitoring pages including:

* Dashboard
* Logs
* Analytics
* Settings
* Prompt Firewall

---

### 9. AI/ML Threat Detection

The project includes an ML-based detection pipeline using trained models and vectorization components.

ML-related components include:

* Threat detection model
* Training data
* TF-IDF vectorization
* Logistic Regression model

---

### 10. Red-Team Security Testing

LLM-Guard includes a dedicated red-team simulator for automated security testing.

The simulator contains:

* Adversarial prompt datasets
* Advanced attack datasets
* Attack runner
* Mock target server
* Authentication security tests
* Error-handling tests
* Vulnerability analysis
* Automated report generation
* Run comparison reports

The advanced testing covers techniques such as:

* Encoding tricks
* Edge cases
* Multi-turn attacks
* Authentication attacks
* Error-handling scenarios
* Jailbreak techniques

---

## Security Testing Results

The latest advanced red-team testing achieved an overall detection rate of:

### **96.4%**

The testing identified a remaining security gap involving:

> **Incremental-escalation jailbreak attacks**

This technique can gradually escalate requests instead of using a single obvious malicious instruction.

The testing also confirmed improvements in authentication and error handling, including:

* Invalid authentication tokens are rejected
* Identity is derived from the authenticated token
* Role fields supplied directly by requests are not trusted
* Error responses do not expose the previously identified sensitive information

The complete vulnerability report is available under:

`red-team-simulator/report/`

---

## Frontend Dashboard

The project includes a React/Vite frontend for security monitoring and prompt testing.

The dashboard provides:

* Total request statistics
* Successful requests
* Blocked requests
* Blocked prompts
* Attack attempt statistics
* System health
* Prompt Firewall testing
* DLP detection results
* LLM response display
* Recent security activity
* Logs
* Analytics
* Settings

The frontend also supports dark, light, and system theme handling.

---

## Technology Stack

### Backend

* Python
* FastAPI
* REST API
* Authentication & authorization
* Security middleware/components

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Lucide React

### AI/ML

* scikit-learn
* TF-IDF Vectorization
* Logistic Regression

### Security Testing

* Python-based red-team simulator
* Automated adversarial datasets
* Security regression tests

---

## Project Structure

```text
LLM_Guard/
│
├── app/
│   ├── auth.py
│   ├── config.py
│   ├── dlp.py
│   ├── firewall.py
│   ├── injection_detector.py
│   ├── logger.py
│   ├── output_validator.py
│   ├── proxy.py
│   ├── rate_limiter.py
│   ├── risk.py
│   ├── routes.py
│   └── security.py
│
├── llm-guard-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
├── ml/
│   ├── detector.py
│   ├── train_model.py
│   ├── training_data.csv
│   ├── model.pkl
│   └── vectorizer.pkl
│
├── red-team-simulator/
│   ├── data/
│   ├── report/
│   ├── results/
│   ├── runner/
│   └── requirements.txt
│
├── red_team/
│   ├── attacks.json
│   ├── report.json
│   └── runner.py
│
├── scripts/
│   └── latency_audit.py
│
└── tests/
    ├── test_security.py
    └── test_security_pipeline.py
```

---

## Running the Project

### Backend

Activate the project virtual environment and run the FastAPI application.

```powershell
cd "C:\Users\shaafiya\Desktop\LLM\LLM 2"

..\venv\Scripts\Activate.ps1

uvicorn app.main:app --reload
```

---

### Frontend

```powershell
cd llm-guard-frontend

npm install

npm run dev
```

For a production build:

```powershell
npm run build
```

---

## Testing

Run the project tests using the project virtual environment:

```powershell
..\venv\Scripts\python.exe -m pytest tests -q
```

The project also contains automated red-team testing under:

```text
red-team-simulator/
```

---

## Team Members

| Name      | Role                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Shaafiya  | Team Lead, Project Planning, Module Integration, Code Review, Documentation & Submission |
| Srikanth  | Backend Development, API Integration & Configuration                                     |
| Vaishnavi | Frontend Development & UI Enhancement                                                    |
| Vyshnavi  | DLP Module Testing, Test Case Preparation & Validation                                   |
| Vamsi     | AI Threat Detection Testing & Validation                                                 |
| Anshika   | Red-Team Testing, Security Testing & Quality Validation                                  |

---

## Project Workflow

1. Project planning and requirement analysis
2. Backend security module development
3. Frontend dashboard development
4. Security module integration
5. AI/ML threat detection
6. DLP and output validation
7. Automated security testing
8. Red-team attack simulation
9. Vulnerability analysis
10. Final integration and validation
11. Documentation and project submission

---

## Current Project Status

### **Final Evaluation / Security Validation**

The major project modules have been integrated into the `main` branch.

The project has undergone:

* Frontend production build verification
* Backend import verification
* Security regression testing
* Authentication testing
* Error-handling testing
* Advanced red-team testing
* Vulnerability report generation

The latest advanced red-team run reported a **96.4% overall detection rate**.

---

## Known Limitation

The current red-team evaluation identified **incremental-escalation jailbreak** as a remaining detection gap.

This technique should be addressed in a future security enhancement by improving multi-turn/context-aware detection and adding additional escalation-pattern rules or ML features.

---

## Future Improvements

* Improve incremental-escalation jailbreak detection
* Add stronger multi-turn prompt analysis
* Improve ML detection accuracy
* Expand adversarial prompt datasets
* Improve real-time security monitoring
* Add richer analytics and visualization
* Improve model/version compatibility management
* Migrate deprecated Gemini API usage to the supported Google GenAI SDK
* Improve frontend code splitting and bundle optimization
* Expand automated security regression coverage

---

## Security Reports

Detailed security-testing reports and generated vulnerability analysis are available in:

```text
red-team-simulator/report/
red-team-simulator/results/
```

These reports contain the results of baseline and advanced attack simulations, authentication testing, error-handling testing, vulnerability analysis, and detection-rate comparisons.

---

## License

This project was developed as part of the Axlero internship project and is intended for educational and project-evaluation purposes.
