import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="principal top-content">
        <div className="main-top-content">
          <span className="icon-spoon-knife"></span>
          <h2 className="title">Gastronomia</h2>
          <p>
            Descubra os melhores restaurantes da Serra Gaúcha. Experiências
            gastronômicas únicas em um ambiente acolhedor e sofisticado.
          </p>
        </div>
      </div>

      <div className="gallery-div">
        <section className="grid">
          {loading ? (
            <p style={{ color: 'white', textAlign: 'center', gridColumn: '1 / -1' }}>
              Carregando restaurantes...
            </p>
          ) : restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <article key={restaurant.id} className="gallery-card">
                <img
                  src={restaurant.image_url || '/images/fundo4.jpg'}
                  alt={restaurant.name}
                />
                <p className="gallery-title">{restaurant.name}</p>
                <p className="gallery-text">
                  <Link to={`/restaurant/${restaurant.id}`} className="button">
                    Ver mais
                  </Link>
                </p>
              </article>
            ))
          ) : (
            <article className="gallery-card">
              <img src="/images/fundo4.jpg" alt="Restaurant" />
              <p className="gallery-title">Restaurant</p>
              <p className="gallery-text">
                <a href="#" className="button">
                  Ver mais
                </a>
              </p>
            </article>
          )}
        </section>
      </div>

      <div className="principal">
        <article className="main-content">
          <h2>Nossa História</h2>
          <p>
            A Gastro-Serra nasceu da paixão pela gastronomia da Serra Gaúcha,
            reunindo os melhores restaurantes da região em um só lugar. Nossa
            missão é conectar pessoas a experiências culinárias memoráveis.
          </p>
        </article>

        <article className="main-content">
          <h2>Experiência Única</h2>
          <p>
            Cada restaurante parceiro foi cuidadosamente selecionado para
            oferecer o melhor da culinária regional e internacional. Descubra
            sabores autênticos em ambientes acolhedores.
          </p>
        </article>

        <article className="midle-card">
          <div className="midle-content">
            <img src="/images/fundo6.jpg" className="image-text ajust-image" />
            <p className="midle-text">
              Explore a rica tradição gastronômica da Serra Gaúcha. De fondues
              artesanais a carnes nobres perfeitamente preparadas, nossa seleção
              de restaurantes oferece opções para todos os gostos. Venha descobrir
              por que a região é conhecida como um dos principais destinos
              gastronômicos do Brasil.
            </p>
          </div>
        </article>

        <article className="main-content" id="sobre">
          <h2>Sobre Nós</h2>
          <p>
            Somos apaixonados pela culinária da Serra Gaúcha e trabalhamos para
            trazer as melhores opções gastronômicas para você. Nossa plataforma
            conecta restaurantes de excelência com pessoas que buscam
            experiências gastronômicas autênticas.
          </p>
        </article>

        <article className="main-content" id="contato">
          <h2>Contato</h2>
          <p>
            Entre em contato conosco para mais informações sobre nossos
            restaurantes parceiros ou para incluir seu estabelecimento em nossa
            plataforma. Estamos sempre em busca de novos parceiros comprometidos
            com a excelência.
          </p>
        </article>
      </div>
    </main>
  );
}
