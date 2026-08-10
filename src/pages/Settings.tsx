import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Factory, ArrowLeft, Plus, Trash2, Users, LogOut, Eye, EyeOff, Pencil, Save, Shield, ShieldCheck, Palette, Image as ImageIcon, Upload, X as XIcon } from "lucide-react";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import NotificationBell from "@/components/NotificationBell";

import { getThemeSettings, saveThemeSettings, type ThemeSettings, type BgPattern, type BgIntensity } from "@/lib/themeStore";
import { validateImageFile, validateImageUrl, probeImage } from "@/lib/imageValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getUsers, addUser, deleteUser, updateUserPassword, updateUsername, isAdmin, getCurrentUser, type AppUser, type UserRole } from "@/lib/usersStore";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const admin = isAdmin();
  const [users, setUsers] = useState<AppUser[]>(getUsers());
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("manager");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [editingPassword, setEditingPassword] = useState<Record<string, string>>({});
  const [editingUsername, setEditingUsername] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<ThemeSettings>(getThemeSettings());
  const [themeKey, setThemeKey] = useState(0);
  const [bgUrlInput, setBgUrlInput] = useState<string>(
    theme.backgroundImage?.startsWith("data:") ? "" : theme.backgroundImage || ""
  );
  const [bgUrlError, setBgUrlError] = useState<string>("");
  const [bgChecking, setBgChecking] = useState(false);

  const updateTheme = (partial: Partial<ThemeSettings>) => {
    const updated = { ...theme, ...partial };
    setTheme(updated);
    saveThemeSettings(updated);
    setThemeKey((k) => k + 1);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) { toast({ title: "Access Denied", description: "Only admins can add users", variant: "destructive" }); return; }
    if (!newUsername.trim() || !newPassword.trim()) { toast({ title: "Error", description: "Username and password are required", variant: "destructive" }); return; }
    if (users.some((u) => u.username === newUsername.trim())) { toast({ title: "Error", description: "Username already exists", variant: "destructive" }); return; }
    addUser(newUsername.trim(), newPassword.trim(), newRole);
    setUsers(getUsers());
    setNewUsername("");
    setNewPassword("");
    setNewRole("manager");
    toast({ title: "User Added", description: `User "${newUsername.trim()}" created as ${newRole}` });
  };

  const handleDeleteUser = (user: AppUser) => {
    if (!admin) { toast({ title: "Access Denied", description: "Only admins can delete users", variant: "destructive" }); return; }
    if (users.length <= 1) { toast({ title: "Error", description: "Cannot delete the last user", variant: "destructive" }); return; }
    if (user.role === "admin" && users.filter(u => u.role === "admin").length <= 1) { toast({ title: "Error", description: "Cannot delete the last admin", variant: "destructive" }); return; }
    deleteUser(user.id);
    setUsers(getUsers());
    toast({ title: "User Deleted", description: `User "${user.username}" removed` });
  };

  const handleSavePassword = (user: AppUser) => {
    const newPwd = editingPassword[user.id];
    if (!newPwd?.trim()) { toast({ title: "Error", description: "Password cannot be empty", variant: "destructive" }); return; }
    updateUserPassword(user.id, newPwd.trim());
    setUsers(getUsers());
    setEditingPassword((prev) => { const n = { ...prev }; delete n[user.id]; return n; });
    toast({ title: "Password Updated", description: `Password for "${user.username}" updated` });
  };

  const handleSaveUsername = (user: AppUser) => {
    const newName = editingUsername[user.id]?.trim();
    if (!newName) { toast({ title: "Error", description: "Username cannot be empty", variant: "destructive" }); return; }
    if (newName === user.username) { setEditingUsername((prev) => { const n = { ...prev }; delete n[user.id]; return n; }); return; }
    const ok = updateUsername(user.id, newName);
    if (!ok) { toast({ title: "Error", description: "Username already taken", variant: "destructive" }); return; }
    setUsers(getUsers());
    setEditingUsername((prev) => { const n = { ...prev }; delete n[user.id]; return n; });
    toast({ title: "Username Updated", description: `Renamed to "${newName}"` });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting same file
    if (!file) return;
    const v = validateImageFile(file);
    if (!v.ok) {
      toast({ title: "Invalid image", description: v.error, variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast({ title: "Read failed", description: "Could not read file.", variant: "destructive" });
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      const ok = await probeImage(dataUrl);
      if (!ok) {
        toast({ title: "Invalid image", description: "File could not be decoded as an image.", variant: "destructive" });
        return;
      }
      updateTheme({ backgroundImage: dataUrl });
      toast({ title: "Background Updated", description: "Background image applied" });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyBgUrl = async () => {
    const v = validateImageUrl(bgUrlInput);
    if (!v.ok) { setBgUrlError(v.error); return; }
    setBgUrlError("");
    setBgChecking(true);
    const reachable = await probeImage(bgUrlInput.trim());
    setBgChecking(false);
    if (!reachable) {
      setBgUrlError("Image could not be loaded from this URL.");
      return;
    }
    updateTheme({ backgroundImage: bgUrlInput.trim() });
    toast({ title: "Background Updated", description: "Image URL applied" });
  };

  const handleClearBackground = () => {
    updateTheme({ backgroundImage: "" });
    setBgUrlInput("");
    setBgUrlError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("current_user");
    navigate("/login");
  };

  const togglePasswordVisibility = (id: string) => setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundDecoration key={themeKey} id="settings" />

      <header className="gradient-header sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/25">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-primary-foreground tracking-wider">Settings</h1>
                {currentUser && (
                  <p className="text-[10px] text-primary-foreground/60 tracking-widest uppercase">
                    Logged in as {currentUser.username} ({currentUser.role})
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link to="/"><Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"><LogOut className="h-4 w-4 mr-1" /> Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Confirm Logout</AlertDialogTitle><AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
        {/* Theme Settings */}
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Theme Settings</CardTitle>
            <CardDescription>Customize background pattern and intensity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Background Pattern</Label>
                <Select value={theme.pattern} onValueChange={(v) => updateTheme({ pattern: v as BgPattern })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Intensity</Label>
                <Select value={theme.intensity} onValueChange={(v) => updateTheme({ intensity: v as BgIntensity })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Glow Effects</Label>
                <Select value={theme.glowEnabled ? "on" : "off"} onValueChange={(v) => updateTheme({ glowEnabled: v === "on" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Enabled</SelectItem>
                    <SelectItem value="off">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Background Image */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Background Image</Label>
                <div className="flex items-center gap-2">
                  <input id="bg-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={handleBackgroundUpload} />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="bg-upload" className="cursor-pointer"><Upload className="h-3 w-3 mr-1" /> Upload</label>
                  </Button>
                  {theme.backgroundImage && (
                    <Button variant="ghost" size="sm" onClick={handleClearBackground}>
                      <XIcon className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste an image URL (https://example.com/img.png)"
                  value={bgUrlInput}
                  onChange={(e) => { setBgUrlInput(e.target.value); setBgUrlError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyBgUrl(); } }}
                  aria-invalid={!!bgUrlError}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleApplyBgUrl} disabled={bgChecking || !bgUrlInput.trim()}>
                  {bgChecking ? "Checking…" : "Apply"}
                </Button>
              </div>
              {bgUrlError && <p className="text-xs text-destructive">{bgUrlError}</p>}
              <p className="text-[11px] text-muted-foreground">
                Allowed: JPG, PNG, WEBP, GIF, SVG. Max 3MB. URLs must be http(s).
              </p>
              {theme.backgroundImage && (
                <div className="space-y-2">
                  <div
                    className="h-24 rounded border bg-cover bg-center bg-muted"
                    style={{ backgroundImage: `url("${theme.backgroundImage}")` }}
                    role="img"
                    aria-label="Background preview"
                  />
                  <div className="space-y-1">
                    <Label className="text-xs">Image Opacity: {Math.round((theme.backgroundImageOpacity ?? 0.25) * 100)}%</Label>
                    <input
                      type="range" min={0} max={100} step={5}
                      value={Math.round((theme.backgroundImageOpacity ?? 0.25) * 100)}
                      onChange={(e) => updateTheme({ backgroundImageOpacity: Number(e.target.value) / 100 })}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add User - Admin only */}
        {admin && (
          <Card className="backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Add New User</CardTitle>
              <CardDescription>Create a new login credential (Admin only)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-username">Username</Label>
                  <Input id="new-username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter username" />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-password">Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter password" />
                </div>
                <div className="w-36 space-y-1">
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit"><Plus className="h-4 w-4 mr-1" /> Add</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* User List */}
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Manage Users</CardTitle>
            <CardDescription>{users.length} user(s) registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {admin && editingUsername[user.id] !== undefined ? (
                        <div className="flex items-center gap-1">
                          <Input
                            className="h-7 text-xs w-36"
                            value={editingUsername[user.id]}
                            onChange={(e) => setEditingUsername((prev) => ({ ...prev, [user.id]: e.target.value }))}
                          />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSaveUsername(user)}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingUsername((prev) => { const n = { ...prev }; delete n[user.id]; return n; })}>
                            <span className="text-xs">✕</span>
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">{user.username}</p>
                          {admin && (
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingUsername((prev) => ({ ...prev, [user.id]: user.username }))} title="Rename user">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      )}
                      <Badge variant={user.role === "admin" ? "default" : user.role === "employee" ? "outline" : "secondary"} className="text-[10px]">
                        {user.role === "admin" ? <ShieldCheck className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </div>
                    {/* Password: visible/editable for admin */}
                    <div className="flex items-center gap-2 mt-1">
                      {admin ? (
                        editingPassword[user.id] !== undefined ? (
                          <div className="flex items-center gap-1">
                            <Input
                              className="h-7 text-xs w-32"
                              value={editingPassword[user.id]}
                              onChange={(e) => setEditingPassword((prev) => ({ ...prev, [user.id]: e.target.value }))}
                            />
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSavePassword(user)}>
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingPassword((prev) => { const n = { ...prev }; delete n[user.id]; return n; })}>
                              <span className="text-xs">✕</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">
                              Password: {visiblePasswords[user.id] ? user.password : "•".repeat(user.password.length)}
                            </p>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePasswordVisibility(user.id)}>
                              {visiblePasswords[user.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingPassword((prev) => ({ ...prev, [user.id]: user.password }))}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        )
                      ) : (
                        <p className="text-xs text-muted-foreground">Password: {"•".repeat(user.password.length)}</p>
                      )}
                    </div>
                  </div>
                  {admin && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
