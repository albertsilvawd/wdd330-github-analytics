export default class ArticleList {
    constructor(articles) {
        this.articles = articles;
    }

    render(container) {
        if (!this.articles || this.articles.length === 0) {
            return;
        }

        const html = `
      <div class="section">
        <h3 class="section-title">DEV.to Articles</h3>
        <ul class="article-list">
          ${this.articles.map(article => `
            <li class="article-card">
              <a href="${article.url}" target="_blank">${article.title}</a>
              <div class="article-stats">
                <span>❤️ ${article.positive_reactions_count}</span>
                <span>💬 ${article.comments_count}</span>
                <span>📅 ${new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              ${article.tag_list.length > 0 ? `
                <div class="article-tags">
                  ${article.tag_list.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
              ` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
        container.insertAdjacentHTML('beforeend', html);
    }
}