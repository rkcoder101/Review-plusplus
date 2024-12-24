import { useUser } from "../../custom_hooks/useUser";
export default function ProfileForm() {
    const { user } = useUser();
    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Profile</h2>
            <form>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                        <input
                            readOnly
                            type="text"
                            id="first_name"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                            placeholder={user.name}
                        />
                    </div>

                    <div>
                        <label htmlFor="branch" className="block mb-2 text-sm font-medium text-gray-700">Branch</label>
                        <input
                            readOnly
                            type="text"
                            id="branch"
                            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                            placeholder={user.branch}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="enrollment_number" className="block mb-2 text-sm font-medium text-gray-700">Enrollment Number</label>
                    <input
                        readOnly
                        type="text"
                        id="enrollment_number"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder={user.enrollment_number}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm_password"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
