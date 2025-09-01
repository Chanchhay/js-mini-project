        // Global variables
        let templeData = [];
        let favorites = JSON.parse(localStorage.getItem('temple-favorites') || '[]');
        let currentPage = 'home';

        // API endpoint
        const API_URL = 'https://angkor-api.onrender.com/temples';

        // Fetch temple data
        async function fetchTemples() {
            try {
                const response = await fetch(API_URL);
                templeData = await response.json();
                renderTemples();
            } catch (error) {
                console.error('Error fetching temples:', error);
                // Fallback data in case API is unavailable
                templeData = [
                    {
                        "id": "angkor-wat",
                        "title": "Angkor Wat",
                        "summary": "The iconic heart of Angkor—an immense temple-mountain surrounded by moats and causeways.",
                        "descriptions": [
                            {"label": "Overview", "text": "Built in the Khmer imperial era, Angkor Wat blends grand symmetry with detailed bas‑reliefs and soaring towers."},
                            {"label": "Details", "text": "Visitors come for sunrise reflections in the moat, kilometer‑long reliefs of epics and history."}
                        ],
                        "images": [{"role": "cover", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d4/20171126_Angkor_Wat_4712_DxO.jpg"}],
                        "tags": ["temple", "Angkor", "Khmer", "Hindu", "Buddhist", "sunrise"],
                        "location": {"province": "Siem Reap"}
                    }
                ];
                renderTemples();
            }
        }

        // Show page function
        function showPage(page, templeId = null) {
            // Hide all pages
            document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));

            // Show selected page
            const pageElement = document.getElementById(`${page}-page`);
            if (pageElement) {
                pageElement.classList.remove('hidden');
                pageElement.classList.add('animate-fade-in');
            }

            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('text-white', 'font-bold');
                link.classList.add('text-white/80');
            });

            currentPage = page;

            // Page-specific logic
            switch(page) {
                case 'temples':
                    renderTemples();
                    break;
                case 'favorites':
                    renderFavorites();
                    break;
                case 'temple-detail':
                    if (templeId) renderTempleDetail(templeId);
                    break;
            }
        }

        // Render temples grid
        function renderTemples(templesToRender = null) {
            const temples = templesToRender || templeData;
            const grid = document.getElementById('temples-grid');

            if (!grid) return;

            grid.innerHTML = temples.map(temple => `
                <div class="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 animate-slide-up">
                    <div class="relative">
                        <img src="${temple.images[0]?.url || '/api/placeholder/400/300'}"
                             alt="${temple.title}"
                             class="w-full h-64 object-cover"
                             onerror="this.src='/api/placeholder/400/300'">
                        <button
                            onclick="toggleFavorite('${temple.id}')"
                            class="absolute top-4 right-4 favorite-heart ${favorites.includes(temple.id) ? 'active' : ''} text-2xl bg-white/20 backdrop-blur rounded-full p-2 hover:bg-white/30"
                        >
                            ${favorites.includes(temple.id) ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-2xl font-bold text-white">${temple.title}</h3>
                            <span class="text-sm text-white/60">${temple.location.province}</span>
                        </div>
                        <p class="text-white/70 mb-4 line-clamp-3">${temple.summary}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${temple.tags.slice(0, 3).map(tag => `
                                <span class="glass px-3 py-1 rounded-full text-xs text-white/80">${tag}</span>
                            `).join('')}
                        </div>
                        <button
                            onclick="showPage('temple-detail', '${temple.id}')"
                            class="w-full glass px-4 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
                        >
                            Explore Temple ✨
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Render temple detail
        function renderTempleDetail(templeId) {
            const temple = templeData.find(t => t.id === templeId);
            if (!temple) return;

            const content = document.getElementById('temple-detail-content');
            content.innerHTML = `
                <div class="animate-slide-up">
                    <button onclick="showPage('temples')" class="glass px-4 py-2 rounded-full text-white mb-6 hover:bg-white/20 transition-colors">
                        ← Back to Temples
                    </button>

                    <div class="glass-card rounded-3xl overflow-hidden mb-8">
                        <div class="relative h-96">
                            <img src="${temple.images[0]?.url || '/api/placeholder/800/400'}"
                                 alt="${temple.title}"
                                 class="w-full h-full object-cover"
                                 onerror="this.src='/api/placeholder/800/400'">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div class="absolute bottom-6 left-6 right-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h1 class="text-5xl font-bold text-white mb-2">${temple.title}</h1>
                                        <p class="text-xl text-white/80">${temple.location.province}, Cambodia</p>
                                    </div>
                                    <button
                                        onclick="toggleFavorite('${temple.id}')"
                                        class="favorite-heart ${favorites.includes(temple.id) ? 'active' : ''} text-4xl bg-white/20 backdrop-blur rounded-full p-4 hover:bg-white/30"
                                    >
                                        ${favorites.includes(temple.id) ? '❤️' : '🤍'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <div class="glass-card rounded-3xl p-8 mb-8">
                                <h2 class="text-3xl font-bold text-white mb-4">Overview</h2>
                                <p class="text-white/80 text-lg leading-relaxed mb-6">${temple.summary}</p>
                                ${temple.descriptions.map(desc => `
                                    <div class="mb-6">
                                        <h3 class="text-xl font-semibold text-white mb-2">${desc.label}</h3>
                                        <p class="text-white/70 leading-relaxed">${desc.text}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="glass-card rounded-3xl p-6">
                                <h3 class="text-2xl font-bold text-white mb-4">Temple Tags</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${temple.tags.map(tag => `
                                        <span class="glass px-3 py-2 rounded-full text-sm text-white">${tag}</span>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="glass-card rounded-3xl p-6">
                                <h3 class="text-2xl font-bold text-white mb-4">Location</h3>
                                <p class="text-white/80">📍 ${temple.location.province} Province</p>
                                <p class="text-white/80">🇰🇭 ${temple.location.country}</p>
                            </div>

                            <div class="glass-card rounded-3xl p-6">
                                <h3 class="text-2xl font-bold text-white mb-4">Last Updated</h3>
                                <p class="text-white/80">${new Date(temple.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render favorites
        function renderFavorites() {
            const favoriteTemples = templeData.filter(temple => favorites.includes(temple.id));
            const grid = document.getElementById('favorites-grid');
            const noFavorites = document.getElementById('no-favorites');

            if (favoriteTemples.length === 0) {
                grid.innerHTML = '';
                noFavorites.classList.remove('hidden');
            } else {
                noFavorites.classList.add('hidden');
                grid.innerHTML = favoriteTemples.map(temple => `
                    <div class="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300">
                        <div class="relative">
                            <img src="${temple.images[0]?.url || '/api/placeholder/400/300'}"
                                 alt="${temple.title}"
                                 class="w-full h-64 object-cover"
                                 onerror="this.src='/api/placeholder/400/300'">
                            <button
                                onclick="toggleFavorite('${temple.id}')"
                                class="absolute top-4 right-4 favorite-heart active text-2xl bg-white/20 backdrop-blur rounded-full p-2 hover:bg-white/30"
                            >
                                ❤️
                            </button>
                        </div>
                        <div class="p-6">
                            <h3 class="text-2xl font-bold text-white mb-2">${temple.title}</h3>
                            <p class="text-white/70 mb-4">${temple.summary}</p>
                            <button
                                onclick="showPage('temple-detail', '${temple.id}')"
                                class="w-full glass px-4 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
                            >
                                Explore Temple ✨
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Toggle favorite
        function toggleFavorite(templeId) {
            if (favorites.includes(templeId)) {
                favorites = favorites.filter(id => id !== templeId);
            } else {
                favorites.push(templeId);
            }

            localStorage.setItem('temple-favorites', JSON.stringify(favorites));

            // Update UI
            if (currentPage === 'temples') renderTemples();
            if (currentPage === 'favorites') renderFavorites();
            if (currentPage === 'temple-detail') {
                // Update heart button in detail view
                document.querySelectorAll('.favorite-heart').forEach(heart => {
                    if (heart.onclick.toString().includes(templeId)) {
                        heart.classList.toggle('active', favorites.includes(templeId));
                        heart.innerHTML = favorites.includes(templeId) ? '❤️' : '🤍';
                    }
                });
            }
        }

        // Search temples
        function searchTemples() {
            const query = document.getElementById('search-input').value.toLowerCase() ||
                         document.getElementById('mobile-search').value.toLowerCase();

            if (!query) {
                renderTemples();
                return;
            }

            const filteredTemples = templeData.filter(temple =>
                temple.title.toLowerCase().includes(query) ||
                temple.summary.toLowerCase().includes(query) ||
                temple.tags.some(tag => tag.toLowerCase().includes(query)) ||
                temple.location.province.toLowerCase().includes(query)
            );

            renderTemples(filteredTemples);
        }

        // Mobile menu toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            fetchTemples();
        });
