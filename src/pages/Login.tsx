import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Factory } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { validateLogin, setCurrentUser } from "@/lib/usersStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin(username, password)) {
      sessionStorage.setItem("isLoggedIn", "true");
      setCurrentUser(username);
      toast({ title: "Login Successful", description: "Welcome to Production Scheduler" });
      navigate("/");
    } else {
      toast({ title: "Login Failed", description: "Invalid username or password", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] p-4 overflow-hidden relative font-sans">
      {/* Technical Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-transparent to-orange-500/5 pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Industrial Frame Decorations */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-orange-500" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-orange-500" />

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 border border-zinc-700 mb-6 group">
              <Factory className="w-8 h-8 text-orange-500 group-hover:rotate-90 transition-transform duration-700" />
            </div>
            <h1
              className="text-2xl font-extrabold tracking-tighter text-white uppercase italic"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Production <span className="text-orange-500">Control</span>
            </h1>
            <p
              className="text-xs font-medium text-zinc-500 mt-2 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              System Access Point // v4.0.2
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Terminal Identifier
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-3 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-700"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Access Key
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-3 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-700"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 uppercase tracking-[0.15em] text-sm transition-all shadow-[0_4px_20px_rgba(234,88,12,0.2)] active:translate-y-0.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Initialize Protocol
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <div
              className="flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span>Status: Standby</span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                Network Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
