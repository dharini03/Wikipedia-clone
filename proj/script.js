document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    async function searchWikipedia(query) {
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(query)}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch search results.");
        const json = await response.json();
        return json.query.search;
    }

    function displayResults(results) {
        searchResults.innerHTML = "";
        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";
            resultItem.innerHTML = `
                <h3 class="result-title">
                    <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" class="result-link">${result.title}</a>
                </h3>
                <p class="result-snippet">${result.snippet}</p>
            `;
            searchResults.appendChild(resultItem);
        });
    }

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.innerHTML = "<p>Please enter a search term.</p>";
            return;
        }
        searchResults.innerHTML = "<div class='spinner'>Loading...</div>";
        try {
            const results = await searchWikipedia(query);
            if (results.length === 0) {
                searchResults.innerHTML = "<p>No results found.</p>";
            } else {
                displayResults(results);
            }
        } catch (error) {
            searchResults.innerHTML = "<p>An error occurred. Please try again later.</p>";
        }
    });
});
