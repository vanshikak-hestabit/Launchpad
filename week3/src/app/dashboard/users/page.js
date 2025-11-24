export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created at</th>
              <th className="py-3 px-4">Updated at</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">user@example.com</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Dr. Ray Stoltenberg</td>
              <td className="py-3 px-4">rosalinda42@example.com</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Mrs. Mertie Murray MD</td>
              <td className="py-3 px-4">ernser.susanna@example.net</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Gilbert Rice</td>
              <td className="py-3 px-4">willard.walter@example.org</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Sydney Rau</td>
              <td className="py-3 px-4">doug.padberg@example.org</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Mr. Arvid Veum DDS</td>
              <td className="py-3 px-4">schinner.meaghan@example.org</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 px-4">Jayme Beier DDS</td>
              <td className="py-3 px-4">orn.ahmed@example.com</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>

            <tr>
              <td className="py-3 px-4">Uriah Swaniawski</td>
              <td className="py-3 px-4">wilburn.champlin@example.org</td>
              <td className="py-3 px-4">User</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
              <td className="py-3 px-4">18/10/2024 05:27</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
