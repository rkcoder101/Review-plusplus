// manageUsersAndRoles.jsx
import { useState, useEffect } from "react";
import { useUser } from "../../custom_hooks/useUser";

export default function ManageUsersAndRoles() {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = "http://127.0.0.1:8000/asgns";

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/users/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch users.");

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    const getCSRFToken = async () => {
        const response = await fetch("http://127.0.0.1:8000/asgns/csrf/");
        const data = await response.json();
        console.log("yahan tak to aagye");
        console.log(data.csrfToken)
        return data.csrfToken;
      };

    const updateUserRole = async (userId, role, action) => {
        // const csrfToken = await getCSRFToken();
        const endpoint =
          role === "reviewer"
            ? action === "add"
              ? `/add-reviewer/${userId}/`
              : `/remove-reviewer/${userId}/`
            : action === "add"
            ? `/add-admin/${userId}/`
            : `/remove-admin/${userId}/`;
      
        try {
          const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            
          });
          const data = await response.json();
          alert(data.message);
        } catch (err) {
          console.error(err);
          alert("Failed to update role.");
        }
      };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Users and Roles</h1>
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-3 px-4 border-b text-left">Name</th>
                        <th className="py-3 px-4 border-b text-left">Branch</th>
                        <th className="py-3 px-4 border-b text-left">Enrollment Number</th>
                        <th className="py-3 px-4 border-b text-left">Role</th>
                        <th className="py-3 px-4 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-100">
                            <td className="py-3 px-4 border-b">{u.name}</td>
                            <td className="py-3 px-4 border-b">{u.branch}</td>
                            <td className="py-3 px-4 border-b">{u.enrollment_number}</td>
                            <td className="py-3 px-4 border-b">
                                {u.is_admin ? "Admin" : u.is_reviewer ? "Reviewer" : "User"}
                            </td>
                            <td className="py-3 px-4 border-b">
                                <div className="flex flex-wrap gap-20"> 
                                    {u.is_admin ? (
                                        <button
                                            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => updateUserRole(u.id, "admin", "remove")}
                                        >
                                            Remove Admin
                                        </button>
                                    ) : (
                                        <button
                                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => updateUserRole(u.id, "admin", "add")}
                                        >
                                            Make Admin
                                        </button>
                                    )}
                                    {u.is_reviewer ? (
                                        <button
                                            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => updateUserRole(u.id, "reviewer", "remove")}
                                        >
                                            Remove Reviewer
                                        </button>
                                    ) : (
                                        <button
                                            className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                            onClick={() => updateUserRole(u.id, "reviewer", "add")}
                                        >
                                            Make Reviewer
                                        </button>
                                    )}
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
