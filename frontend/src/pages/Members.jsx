import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.get('members/').then(res => setMembers(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {members.map(member => (
          <div key={member.id} className="border rounded-lg p-4 bg-white">
            <img
              src={member.image_url || '/default-avatar.png'}
              alt="avatar"
              className="w-20 h-20 rounded-full mb-2"
            />
            <p className="font-semibold">{member.first_name} {member.last_name}</p>
            <p className="text-sm">{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
