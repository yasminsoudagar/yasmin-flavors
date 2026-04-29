import React from 'react';
import { motion } from 'framer-motion';

const mockUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', orders: 15, joined: '2023-06-12', blocked: false },
  { id: 2, name: 'Mike Chen', email: 'mike@email.com', orders: 8, joined: '2023-09-01', blocked: false },
  { id: 3, name: 'Priya Patel', email: 'priya@email.com', orders: 23, joined: '2023-04-20', blocked: true },
  { id: 4, name: 'David Kim', email: 'david@email.com', orders: 5, joined: '2024-01-05', blocked: false },
];

const ManageUsersPage = () => {
  const [users, setUsers] = React.useState(mockUsers);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Orders</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4 text-right">{user.orders}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, blocked: !u.blocked } : u))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        user.blocked ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                      }`}
                    >
                      {user.blocked ? 'Blocked' : 'Active'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
