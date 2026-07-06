// Analytics tracker
class AnalyticsTracker {
  constructor(apiBase = '/api') {
    this.apiBase = apiBase;
    this.enabled = true;
  }

  /**
   * Track a tool click
   * @param {string} toolId - The tool identifier
   */
  async trackClick(toolId) {
    if (!this.enabled || !toolId) return;

    try {
      const response = await fetch(`${this.apiBase}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });

      if (!response.ok) {
        console.error(`[Analytics] Failed to track click for ${toolId}`);
      }
    } catch (error) {
      console.error('[Analytics] Tracking error:', error);
    }
  }

  /**
   * Get statistics for a specific tool
   * @param {string} toolId - The tool identifier
   * @returns {Promise<{clicks: number, toolId: string} | null>}
   */
  async getStats(toolId) {
    if (!toolId) return null;

    try {
      const response = await fetch(`${this.apiBase}/hot?tool=${encodeURIComponent(toolId)}`);
      if (!response.ok) {
        console.error(`[Analytics] Failed to fetch stats for ${toolId}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Analytics] Stats fetch error:', error);
      return null;
    }
  }

  /**
   * Get stats for multiple tools
   * @param {string[]} toolIds - Array of tool identifiers
   * @returns {Promise<Object>} Object mapping toolId to stats
   */
  async getMultipleStats(toolIds) {
    const results = {};
    
    try {
      const promises = toolIds.map(id => this.getStats(id));
      const stats = await Promise.all(promises);
      
      stats.forEach((stat, index) => {
        results[toolIds[index]] = stat || { clicks: 0 };
      });
    } catch (error) {
      console.error('[Analytics] Multiple stats fetch error:', error);
    }

    return results;
  }

  /**
   * Format click count for display
   * @param {number} count - Click count
   * @returns {string}
   */
  static formatCount(count) {
    if (count === undefined || count === null) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}

// Initialize tracker globally
const tracker = new AnalyticsTracker();

// Auto-track links with data-track-id
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('[data-track-id]');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const toolId = link.getAttribute('data-track-id');
      tracker.trackClick(toolId);
    });
  });
});
