const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const strengthBar = document.getElementById("strength-level");
const strengthText = document.getElementById("strength-text");
const tipsList = document.getElementById("tips-list");
const scanBtn = document.getElementById("scanBtn");
const scanResult = document.getElementById("scanResult");
const breachBtn = document.getElementById("breachCheckBtn");
const breachResult = document.getElementById("breachResult");

// Show/Hide password toggle
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

// Strength checker
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  checkPasswordStrength(password);
});

function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[\W_]/.test(password)) strength++;

  // Strength bar + text
  if (strength <= 2) {
    strengthBar.style.width = "30%";
    strengthBar.style.background = "#e74c3c";
    strengthText.textContent = "Weak Password";
    strengthText.style.color = "#e74c3c";
  } else if (strength === 3 || strength === 4) {
    strengthBar.style.width = "60%";
    strengthBar.style.background = "#f39c12";
    strengthText.textContent = "Moderate Password";
    strengthText.style.color = "#f39c12";
  } else if (strength === 5) {
    strengthBar.style.width = "100%";
    strengthBar.style.background = "#2ecc71";
    strengthText.textContent = "Strong Password";
    strengthText.style.color = "#2ecc71";
  }

  // Tips
  tipsList.innerHTML = "";
  if (password.length < 8) tipsList.innerHTML += "<li>Use at least 8 characters</li>";
  if (!/[A-Z]/.test(password)) tipsList.innerHTML += "<li>Add at least one uppercase letter</li>";
  if (!/[a-z]/.test(password)) tipsList.innerHTML += "<li>Add at least one lowercase letter</li>";
  if (!/[0-9]/.test(password)) tipsList.innerHTML += "<li>Include at least one number</li>";
  if (!/[\W_]/.test(password)) tipsList.innerHTML += "<li>Use at least one special character</li>";
}

// Local vulnerability scan
scanBtn.addEventListener("click", () => {
  const password = passwordInput.value;
  const vulnerabilities = [];

  if (["123456", "password", "qwerty"].includes(password.toLowerCase())) {
    vulnerabilities.push("Password is too common.");
  }
  if (password.length < 6) {
    vulnerabilities.push("Password is very short.");
  }
  if (/^[a-zA-Z]+$/.test(password)) {
    vulnerabilities.push("Only letters used. Try adding numbers/symbols.");
  }

  if (vulnerabilities.length === 0) {
    scanResult.innerHTML = "<p style='color: #2ecc71;'>✅ No basic vulnerabilities found.</p>";
  } else {
    scanResult.innerHTML = "<p style='color: #e74c3c;'>⚠️ Issues:</p><ul>" +
      vulnerabilities.map(v => `<li>${v}</li>`).join("") +
      "</ul>";
  }
});

// Breach check with Have I Been Pwned
breachBtn.addEventListener("click", async () => {
  const password = passwordInput.value;
  if (!password) {
    breachResult.innerHTML = "<p style='color: #e67e22;'>Enter a password first.</p>";
    return;
  }

  const sha1 = await hashPassword(password);
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5).toUpperCase();

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();

  const lines = text.split("\n");
  const match = lines.find(line => line.startsWith(suffix));
  if (match) {
    const count = match.split(":")[1].trim();
    breachResult.innerHTML = `<p style='color: #e74c3c;'>⚠️ This password has appeared <strong>${count}</strong> times in breaches. Choose a safer one.</p>`;
  } else {
    breachResult.innerHTML = `<p style='color: #2ecc71;'>✅ Password not found in public breaches.</p>`;
  }
});

async function hashPassword(pwd) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
