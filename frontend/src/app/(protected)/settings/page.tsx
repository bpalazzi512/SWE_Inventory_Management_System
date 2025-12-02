"use client";

import { User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { decodeJwt } from "@/lib/utils";
import AddUserModal from "@/components/settings/add-user-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function SettingsPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const pathname = usePathname();

    async function fetchUsers(): Promise<User[]> {
        const data = await api.get<User[]>("/users");
        return data.map((u: User) => ({
            id: u.id ?? 0,
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            password: u.password ?? "",
        }));
    }


    async function fetchCurrentUser() {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;

        const payload = decodeJwt(token);
        const id = payload && typeof payload === "object" && "sub" in payload ? String(payload.sub) : null;
        if (!id) return;

        try {
            const data: User = await api.get<User>(`/users/${id}`);
            setCurrentUser({
                id: id,
                firstName: data.firstName ?? "",
                lastName: data.lastName ?? "",
                email: data.email ?? "",
                password: data.password ?? "",
            });
        } catch {
            setCurrentUser(null);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers().then((data) => {
            setUsers(data);
            setIsLoadingUsers(false);
        });
    }, [pathname, isUpdating]);


    const handleField = (field: keyof User, value: string) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, [field]: value });
    };

    async function handleProfileUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!currentUser) return;

        setIsUpdating(true);

        try {
            const updated = await api.put<User>(`/users/${currentUser.id}`, {
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
            });
            setCurrentUser(updated);
            alert("Profile updated!");
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            fetchUsers();
            setIsUpdating(false);
        }
    }

    async function createUser(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<void> {
        await api.post("/users", data);
    }


    const handleAddUser = useCallback(
        async (data: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        }) => {
            try {
                await createUser(data);
                // Refresh users after successful creation
                await fetchUsers();
            } catch (e: unknown) {
                throw e; // Re-throw to let the modal handle the error
            }
        },
        []
    );


    return (
        <div className="p-8 w-full bg-gray-50">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Profile Section */}
            <section className="mb-12 border border-2 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

                {!currentUser ? (
                    <p>Loading your profile...</p>
                ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">First Name</label>
                            <input
                                className="mt-1 w-full border rounded p-2"
                                value={currentUser.firstName}
                                onChange={(e) => handleField("firstName", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Last Name</label>
                            <input
                                className="mt-1 w-full border rounded p-2"
                                value={currentUser.lastName}
                                onChange={(e) => handleField("lastName", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                className="mt-1 w-full border rounded p-2"
                                value={currentUser.email}
                                onChange={(e) => handleField("email", e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="default"
                            className="mt-4 px-4 py-2"
                        >
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </Button>
                    </form>
                )}
            </section>

            {/* Users Section */}
            <section className="border border-2 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <AddUserModal
                        onAddUser={handleAddUser }
                        onCreated={fetchUsers}
                    />
                </div>

                {isLoadingUsers ? (
                    <p>Loading users...</p>
                ) : (
                    <ul className="space-y-2">
                        {users.map((u) => (
                            <li
                                key={u.email}
                                className="border p-3 rounded-md flex justify-between"
                            >
                                <span>{u.firstName} {u.lastName}</span>
                                <span className="text-gray-500">{u.email}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Placeholder Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 opacity-100">
                        <h3 className="text-lg font-semibold mb-3">Add User</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This is a placeholder modal. No functionality yet.
                        </p>

                        <button
                            className="mt-2 w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                            onClick={() => setModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
