export default function ProfileForm() {
    return (
        <div>
            <form>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First name</label>
                        <input type="text" id="first_name" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[40%] p-2.5" placeholder="John" disabled />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last name</label>
                        <input type="text" id="last_name" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[40%] p-2.5" placeholder="Doe" disabled />
                    </div>
                    <div>
                        <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900">Branch</label>
                        <input type="text" id="company" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[40%] p-2.5" placeholder="Mechanical Engineering" disabled />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone number</label>
                        <input type="tel" id="phone" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" disabled />
                    </div>
                    <div>
                        <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900">Website URL</label>
                        <input type="url" id="website" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" placeholder="flowbite.com" disabled />
                    </div>
                    <div>
                        <label htmlFor="visitors" className="block mb-2 text-sm font-medium text-gray-900">Unique visitors (per month)</label>
                        <input type="number" id="visitors" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" disabled />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
                    <input type="email" id="email" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" placeholder="john.doe@company.com" disabled />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input type="password" id="password" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                    <input type="password" id="confirm_password" className="bg-white border border-gray-300 text-black text-sm rounded-lg block w-[30%] p-2.5" />
                </div>
                <div className="flex items-start mb-6">

                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" disabled>Reset Password</button>
            </form>
        </div>
    )

}