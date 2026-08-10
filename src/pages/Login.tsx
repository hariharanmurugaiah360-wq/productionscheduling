import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Factory, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { validateLogin, setCurrentUser } from "@/lib/usersStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin(username, password)) {
      setError("");
      sessionStorage.setItem("isLoggedIn", "true");
      setCurrentUser(username);
      toast({ title: "Login Successful", description: "Welcome to Production Scheduler" });
      navigate("/");
    } else {
      setError("Invalid username or password. Please try again.");
      toast({ title: "Login Failed", description: "Invalid username or password", variant: "destructive" });
    }
  };

  const fieldClass =
    "w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-3 transition-colors placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]";

  return (
    <main className="min-h-dvh w-full flex items-center justify-center bg-[#0a0a0c] p-4 overflow-hidden relative font-sans">
      {/* Technical Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-transparent to-orange-500/5 pointer-events-none"
      />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Industrial Frame Decorations */}
        <div aria-hidden="true" className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-orange-500" />
        <div aria-hidden="true" className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-orange-500" />

        <section
          aria-labelledby="login-heading"
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 border border-zinc-700 mb-6 group">
              <Factory aria-hidden="true" className="w-8 h-8 text-orange-500 group-hover:rotate-90 transition-transform duration-700" />
            </div>
            <h1
              id="login-heading"
              className="text-2xl font-extrabold tracking-tighter text-white uppercase italic"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Production <span className="text-orange-500">Control</span>
            </h1>
            <p
              className="text-xs font-medium text-zinc-400 mt-2 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              System Access Point // v4.0.2
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6" noValidate aria-describedby="login-error">
            <div>
              <label
                htmlFor="username"
                className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2 ml-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Terminal Identifier (Username)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                inputMode="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                aria-required="true"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className={fieldClass}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2 ml-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Access Key (Password)
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  aria-required="true"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "login-error" : undefined}
                  className={`${fieldClass} pr-12`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Live error region: announced to screen readers */}
            <p
              id="login-error"
              role="alert"
              aria-live="assertive"
              className={`text-xs font-bold text-orange-400 ${error ? "" : "sr-only"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {error}
            </p>

            <button
              type="submit"
              className="w-full min-h-11 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 uppercase tracking-[0.15em] text-sm transition-all shadow-[0_4px_20px_rgba(234,88,12,0.2)] active:translate-y-0.5 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Initialize Protocol
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <div
              className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span>Status: Standby</span>
              <span className="flex items-center">
                <span aria-hidden="true" className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                Network Secure
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
