function evaluateStrength(password) {
  const strength = document.getElementById("strength");
  let result = "Weak";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[\W]/.test(password);

  const lengthCriteria = password.length >= 8;
  const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  if (lengthCriteria && score === 4) result = "Strong";
  else if (lengthCriteria && score >= 2) result = "Medium";

  strength.innerText = `Strength: ${result}`;
  strength.style.color =
    result === "Strong" ? "#00FFAA" :
    result === "Medium" ? "#FFD700" :
    "#FF4C4C";
}

function toggleVisibility() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function lockPassword() {
  const input = document.getElementById("password");
  input.disabled = true;
  document.getElementById("strength").innerText = "Password Locked";
}

document.getElementById("password").addEventListener("input", (e) => {
  evaluateStrength(e.target.value);
});
