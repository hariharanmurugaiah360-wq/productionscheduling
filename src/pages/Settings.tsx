import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Factory, ArrowLeft, Plus, Trash2, Users, LogOut, Eye, EyeOff, Pencil, Save, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getUsers, addUser, deleteUser, updateUserPassword, isAdmin, getCurrentUser, type AppUser, type UserRole } from "@/lib/usersStore";
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

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("current_user");
    navigate("/login");
  };

  const togglePasswordVisibility = (id: string) => setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="settings-grid" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1" fill="currentColor" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#settings-grid)" />
        </svg>
      </div>

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
                      <p className="font-medium text-foreground">{user.username}</p>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px]">
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
