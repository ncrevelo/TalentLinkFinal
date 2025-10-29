'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Star, Users, Calendar, ChevronRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">TalentLink</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/for-talents" className="text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium">
                Para Artistas
              </Link>
              <Link href="/for-representatives" className="text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium">
                Para Representantes
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium">
                Acerca de
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium">
                Contacto
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <button className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Iniciar sesión
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                  Registrarse
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 px-4">
            Conectando <span className="text-purple-600">artistas</span> con{' '}
            <span className="text-purple-600">oportunidades</span> extraordinarias
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto px-4 leading-relaxed">
            TalentLink es la plataforma que conecta a artistas emergentes con representantes y empresas,
            creando un espacio donde el talento y las oportunidades se encuentran.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-4">
            <Link href="/auth/login">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
                Soy Artista
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Soy Representante
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.pexels.com/photos/6953867/pexels-photo-6953867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Artistas colaborando"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Características destacadas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre las herramientas que hacen de TalentLink la plataforma ideal para artistas y representantes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Perfiles detallados</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Crea un perfil completo que destaque tus mejores características y habilidades para ser encontrado más fácilmente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Búsqueda avanzada</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Encuentra el talento perfecto con filtros precisos por características físicas, habilidades y disponibilidad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Gestión de agenda</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Organiza tus audiciones, castings y reuniones con nuestro sistema integrado de calendario.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Sistema de recomendaciones</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Construye tu reputación con valoraciones y reseñas que demuestren la calidad de tu trabajo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              El proceso es simple y efectivo, tanto para artistas como para representantes
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
            <div className="flex-1 order-2 lg:order-1">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold flex items-center justify-center mb-6 mx-auto lg:mx-0">
                1
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Crea tu perfil profesional
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-center lg:text-left">
                Registra una cuenta y completa tu perfil con toda la información relevante,
                incluyendo tu experiencia, habilidades, características y disponibilidad.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link href="/auth/login">
                  <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Comenzar ahora
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Crear perfil"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 mb-16">
            <div className="flex-1 order-2">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold flex items-center justify-center mb-6 mx-auto lg:mx-0">
                2
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Conecta con oportunidades
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-center lg:text-left">
                Explora las ofertas de trabajo publicadas por representantes y empresas,
                o busca talentos específicos para tus proyectos si eres representante.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link href="/auth/login">
                  <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Explorar oportunidades
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 order-1">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Conectar oportunidades"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 order-2 lg:order-1">
              <div className="w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold flex items-center justify-center mb-6 mx-auto lg:mx-0">
                3
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Colabora y construye tu reputación
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-center lg:text-left">
                Inicia proyectos, colabora con otros profesionales de la industria y recibe
                valoraciones que fortalezcan tu perfil para futuras oportunidades.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link href="/auth/login">
                  <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Ver historias de éxito
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/8112172/pexels-photo-8112172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Colaborar"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conoce las historias de quienes ya han encontrado oportunidades a través de TalentLink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;Gracias a TalentLink pude conseguir mi primer papel importante en una producción nacional.
                La plataforma me permitió mostrar mi talento de manera profesional y conectar con directores de casting.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Laura Martínez"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Laura Martínez</h4>
                  <p className="text-sm text-gray-600">Actriz</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;Como director de casting, TalentLink ha revolucionado mi forma de encontrar talento.
                Los filtros avanzados y los perfiles detallados me permiten ahorrar tiempo y encontrar exactamente lo que busco.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Carlos Vega"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Carlos Vega</h4>
                  <p className="text-sm text-gray-600">Director de Casting</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                &quot;Desde que me uní a TalentLink, mi carrera como modelo ha despegado. Las oportunidades son
                constantes y de calidad, y el sistema de recomendaciones me ha ayudado a construir mi reputación.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img
                    src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Ana Torres"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Ana Torres</h4>
                  <p className="text-sm text-gray-600">Modelo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Haz que tu talento brille
          </h2>
          <p className="text-lg sm:text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ya sea que estés buscando tu gran oportunidad o el talento perfecto para tu próximo proyecto,
            TalentLink es tu mejor aliado en la industria creativa.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/login">
              <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-purple-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
                Unirse como Artista
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-purple-800 border-2 border-white rounded-lg hover:bg-purple-900 transition-colors">
                Unirse como Representante
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-2xl font-bold text-purple-500 mb-4">TalentLink</div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Conectando talentos emergentes con oportunidades excepcionales en la industria creativa.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-base font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/for-talents" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Para Artistas
                  </Link>
                </li>
                <li>
                  <Link href="/for-representatives" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Para Representantes
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Precios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-base font-semibold mb-4">Empresa</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Acerca de nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-base font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Política de cookies
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Seguridad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2025 TalentLink. Todos los derechos reservados.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
