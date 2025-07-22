function toggleVisibility() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function checkPassword() {
  const pwd = document.getElementById("password").value;
  const feedback = document.getElementById("feedback");
  const pwned = document.getElementById("pwnedResult");
  feedback.innerHTML = "";
  pwned.innerHTML = "";

  const checks = [
    { test: /.{12,}/, message: "✅ Minimum 12 characters" },
    { test: /[A-Z]/, message: "✅ Contains uppercase letter" },
    { test: /[0-9]/, message: "✅ Contains number" },
    { test: /[^A-Za-z0-9]/, message: "✅ Contains special character" }
  ];

  checks.forEach(rule => {
    const passed = rule.test.test(pwd);
    const color = passed ? "lightgreen" : "orange";
    feedback.innerHTML += `<p style="color:${color}">${rule.message}</p>`;
  });

  checkPwned(pwd);
}

async function checkPwned(password) {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5).toUpperCase();

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
    const found = text.split("\n").find(line => line.startsWith(suffix));

    const pwned = document.getElementById("pwnedResult");
    if (found) {
      const count = found.split(":")[1].trim();
      pwned.innerHTML = `<p style="color:red">⚠️ Password found in ${count} breaches! Choose another.</p>`;
    } else {
      pwned.innerHTML = `<p style="color:lightgreen">✅ Password not found in breaches.</p>`;
    }
  } catch (err) {
    document.getElementById("pwnedResult").innerHTML = `<p style="color:orange">Error checking HaveIBeenPwned API</p>`;
  }
}

async function sha1(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function generateSuggestion() {
  const length = 16;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("suggestionBox").innerText = `💡 Suggested: ${password}`;
}
