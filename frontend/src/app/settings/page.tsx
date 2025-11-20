"use client";

import { User } from "@/types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { decodeJwt } from "@/lib/utils";

export default function SettingsPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const pathname = usePathname();
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

    async function fetchUsers(): Promise<User[]> {
        const res = await fetch(`${apiBase}/users`, { cache: "no-store" });

        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await res.json();
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

        const payload: any = decodeJwt(token);
        const id = payload?.sub;
        if (!id) return;


        fetch(`${apiBase}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            })
            .then((data: User) => {
                setCurrentUser({
                    id: id,
                    firstName: data.firstName ?? "",
                    lastName: data.lastName ?? "",
                    email: data.email ?? "",
                    password: data.password ?? "",
                });
            })
            .catch(() => setCurrentUser(null));
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
            const res = await fetch(`${apiBase}/users/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email,
                }),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const updated = await res.json();
            setCurrentUser(updated);
            alert("Profile updated!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            fetchUsers();
            setIsUpdating(false);
        }
    }


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

                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                )}
            </section>

            {/* Users Section */}
            <section className="border border-2 p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                    >
                        Add User
                    </button>
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
