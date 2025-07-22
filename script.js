const passwordInput = document.getElementById("password");
const bar = document.getElementById("bar");
const strengthText = document.getElementById("strength-text");
const vulnList = document.getElementById("vuln-list");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("change", () => {
  passwordInput.type = togglePassword.checked ? "text" : "password";
});

passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;
  updateStrength(pwd);
  runVulnerabilityScan(pwd);
});

function updateStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  let width = strength * 20;
  bar.style.width = width + "%";

  let color;
  let text;

  if (strength <= 2) {
    color = "#a94442"; // red
    text = "Weak";
  } else if (strength === 3 || strength === 4) {
    color = "#c0a036"; // yellow
    text = "Moderate";
  } else {
    color = "#8fbc8f"; // muted green-grey
    text = "Strong";
  }

  bar.style.background = color;
  strengthText.textContent = `Strength: ${text}`;
}

function runVulnerabilityScan(password) {
  vulnList.innerHTML = "";

  const issues = [];
  if (password.length < 8) issues.push("Too short (less than 8 characters)");
  if (!/[A-Z]/.test(password)) issues.push("Missing uppercase letter");
  if (!/[a-z]/.test(password)) issues.push("Missing lowercase letter");
  if (!/[0-9]/.test(password)) issues.push("Missing number");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("Missing special character");

  if (issues.length === 0) {
    vulnList.innerHTML = "<li style='color: #8fbc8f;'>No common vulnerabilities found.</li>";
  } else {
    issues.forEach(issue => {
      const li = document.createElement("li");
      li.textContent = `• ${issue}`;
      vulnList.appendChild(li);
    });
  }
}
