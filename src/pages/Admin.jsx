import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, [user]);

  const loadRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setError('Erro ao carregar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const { error } = await supabase
          .from('restaurants')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Restaurante atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('restaurants')
          .insert([{ ...formData, created_by: user.id }]);

        if (error) throw error;
        setSuccess('Restaurante cadastrado com sucesso!');
      }

      resetForm();
      loadRestaurants();
    } catch (error) {
      setError(error.message || 'Erro ao salvar restaurante');
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      category: restaurant.category,
      image_url: restaurant.image_url,
    });
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este restaurante?')) return;

    try {
      const { error } = await supabase.from('restaurants').delete().eq('id', id);

      if (error) throw error;
      setSuccess('Restaurante excluído com sucesso!');
      loadRestaurants();
    } catch (error) {
      setError(error.message || 'Erro ao excluir restaurante');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      category: '',
      image_url: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="main-content" style={{ minHeight: '80vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#814444', marginBottom: '30px' }}>
          Gerenciar Restaurantes
        </h1>

        {error && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
            }}
          >
            {success}
          </div>
        )}

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="button"
          style={{ marginBottom: '30px' }}
        >
          {showForm ? 'Cancelar' : 'Novo Restaurante'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '40px',
            }}
          >
            <h2 style={{ color: '#814444', marginBottom: '20px' }}>
              {editingId ? 'Editar Restaurante' : 'Novo Restaurante'}
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Categoria
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Fondue, Steak, Italiana"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                URL da Imagem
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button type="submit" className="button" style={{ marginRight: '10px' }}>
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '15px 20px',
                borderRadius: '15px',
                border: 'solid',
                borderColor: '#46070796',
                backgroundColor: 'transparent',
                color: '#492727',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </form>
        )}

        <div>
          <h2 style={{ color: '#814444', marginBottom: '20px' }}>
            Meus Restaurantes
          </h2>

          {loading ? (
            <p>Carregando...</p>
          ) : restaurants.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhum restaurante cadastrado ainda.</p>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '20px',
                    alignItems: 'start',
                  }}
                >
                  {restaurant.image_url && (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                  <div>
                    <h3 style={{ color: '#814444', marginBottom: '10px' }}>
                      {restaurant.name}
                    </h3>
                    {restaurant.category && (
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                        <strong>Categoria:</strong> {restaurant.category}
                      </p>
                    )}
                    {restaurant.description && (
                      <p style={{ color: '#666', marginBottom: '8px' }}>
                        {restaurant.description}
                      </p>
                    )}
                    {restaurant.address && (
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        <strong>Endereço:</strong> {restaurant.address}
                      </p>
                    )}
                    {restaurant.phone && (
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        <strong>Telefone:</strong> {restaurant.phone}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="button"
                      style={{ padding: '10px 15px', fontSize: '14px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      style={{
                        padding: '10px 15px',
                        borderRadius: '15px',
                        border: 'solid',
                        borderColor: '#721c24',
                        backgroundColor: 'transparent',
                        color: '#721c24',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
