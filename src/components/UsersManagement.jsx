// src/components/UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import { database } from '../utils/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UsersManagement = () => {
  const [users, setUsers] = useState({});
  const [status, setStatus] = useState('');

  // Listen for changes in the users data from Firebase
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data || {});
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await remove(ref(database, `users/${userId}`));
      setStatus(`User with ID ${userId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting user: ", error);
      setStatus('An error occurred while deleting the user.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">إدارة المستخدمين</h2>
      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
      
      {Object.keys(users).length === 0 ? (
        <p className="text-center text-gray-500">لا يوجد مستخدمون حالياً.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">معرف المستخدم</TableHead>
                  <TableHead>التقدم</TableHead>
                  <TableHead>الإجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(users).map((userId) => (
                  <TableRow key={userId}>
                    <TableCell className="font-medium">{userId}</TableCell>
                    <TableCell>
                      {/* You would need to structure your Firebase data to include progress to display it here */}
                      <span>لم يتم تسجيل التقدم بعد</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(userId)}
                        className="text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersManagement;
