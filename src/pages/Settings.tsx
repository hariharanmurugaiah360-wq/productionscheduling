import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Factory, ArrowLeft, Plus, Trash2, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getUsers, addUser, deleteUser, type AppUser } from "@/lib/usersStore";

const Settings = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>(getUsers());
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({ title: "Error", description: "Username and password are required", variant: "destructive" });
      return;
    }
    if (users.some((u) => u.username === newUsername.trim())) {
      toast({ title: "Error", description: "Username already exists", variant: "destructive" });
      return;
    }
    addUser(newUsername.trim(), newPassword.trim());
    setUsers(getUsers());
    setNewUsername("");
    setNewPassword("");
    toast({ title: "User Added", description: `User "${newUsername.trim()}" created successfully` });
  };

  const handleDeleteUser = (user: AppUser) => {
    if (users.length <= 1) {
      toast({ title: "Error", description: "Cannot delete the last user", variant: "destructive" });
      return;
    }
    deleteUser(user.id);
    setUsers(getUsers());
    toast({ title: "User Deleted", description: `User "${user.username}" removed` });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-header sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/25">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold font-heading text-primary-foreground tracking-wider">Settings</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Add User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Add New User</CardTitle>
            <CardDescription>Create a new login credential</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-username">Username</Label>
                <Input id="new-username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter username" />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="new-password">Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter password" />
              </div>
              <div className="flex items-end">
                <Button type="submit"><Plus className="h-4 w-4 mr-1" /> Add User</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Manage Users</CardTitle>
            <CardDescription>{users.length} user(s) registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-xs text-muted-foreground">Password: {"•".repeat(user.password.length)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
