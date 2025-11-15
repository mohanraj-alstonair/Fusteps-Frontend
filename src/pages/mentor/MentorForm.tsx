import { useState } from 'react';
import { api } from '../../lib/api';

export default function MentorForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: '',
    experience_years: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience_years' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('[2025-09-26 16:05 IST] Submitting mentor data:', formData);

    try {
      const response = await api.post('/api/mentors/register/', formData);

      console.log('[2025-09-26 16:05 IST] Response:', response.data);
      alert('Mentor registered successfully! ID: ' + response.data.id);
    } catch (err) {
      console.error('[2025-09-26 16:05 IST] Error:', err);
      setError(`Failed to register mentor: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Register Mentor</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="text"
        name="expertise"
        value={formData.expertise}
        onChange={handleChange}
        placeholder="Expertise (e.g., AI Development)"
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="number"
        name="experience_years"
        value={formData.experience_years}
        onChange={handleChange}
        placeholder="Years of Experience"
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Submitting...</p>}
      <button
        type="submit"
        disabled={loading || !formData.name || !formData.email || !formData.expertise || !formData.experience_years}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
      >
        Register Mentor
      </button>
    </form>
  );
}